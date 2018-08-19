const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  BearerStrategy = require('passport-http-bearer').Strategy,
  FacebookStrategy = require('passport-facebook').Strategy,
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
  bcrypt = require('bcrypt-nodejs');

passport.serializeUser(function (user, cb) {
  cb(null, _.pick(user, ['id', 'role', 'emailVerified']));
});

passport.deserializeUser(async function (userInfo, cb) {
  const { id, role } = userInfo;
  let user;
  try {
    if (role === 'company') {
      user = await Company.findOne({ id });
    } else {
      user = await Student.findOne({ id })
    }

    if (!user) {
      cb(null, false);
    } else {
      user.role = role;
      cb(null, user);
    }

  } catch (err) {
    return cb(err);
  }
});

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    handleLocalAuthentication
  )
);

passport.use(
  new BearerStrategy(
    {
      passReqToCallback: true
    },
    handleBearerAuthentication
  )
)

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK,
      profileFields: ['id', 'displayName', 'name', 'photos', 'email', 'gender', 'birthday'],
      passReqToCallback: true
    },
    handleFacebookAuthentication
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK,
      passReqToCallback: true
    },
    handleGoogleAuthentication
  )
);

async function handleLocalAuthentication(req, email, password, cb) {
  const role = req.param('role') || 'student';

  let user;

  try {
    if (role === 'company') {
      user = await Company.findOne({ email });
    } else {
      user = await Student.findOne({ email })
    }
  } catch (err) {
    return cb(err);
  }

  if (!user) {
    return cb(null, false, {
      message: 'Invalid email or password.'
    });
  }

  const isValidPassword = bcrypt.compareSync(password, user.password);
  if (!isValidPassword) {
    return cb(null, false, {
      message: 'Invalid email or password.'
    });
  }

  user.role = role;

  return cb(null, user);
}

async function handleBearerAuthentication(req, token, cb) {
  
}

async function handleFacebookAuthentication(req, accessToken, refreshToken, profile, cb) {
  const providerData = _.get(profile, '_json');
  if (!providerData) {
    return cb(null, false, {
      message: "Cannot get provider data."
    })
  }
  const userProfile = {
    firstName: providerData.first_name,
    lastName: `${providerData.last_name || ''} ${providerData.middle_name || ''}`.trim(),
    email: providerData.email,
    gender: transformGender(providerData.gender),
    profileImageURL: (providerData.id) ? `https://graph.facebook.com/${profile.id}/picture?type=large` : undefined,
    emailVerified: true
  }

  if (!userProfile.email) {
    return cb(null, false, {
      message: "Cannot get email from this social account."
    })
  }

  const existingUser = await Student.findOne({ email: userProfile.email });
  let user;

  if (existingUser) {
    if (_.indexOf(existingUser.providers, 'facebook') == -1) {
      const updatedData = {
        providers: _.concat(existingUser.providers, 'facebook'),
        providerData: _.assign(existingUser.providerData, { 'facebook': providerData }),
        emailVerified: true
      }

      const updatedUsers = await Student.update({ id: existingUser.id }).set(updatedData).fetch();
      user = _.get(updatedUsers, '0', existingUser);
    } else {
      user = existingUser;
    }
  } else {
    userProfile.providers = ['facebook'];
    userProfile.providerData = {
      'facebook': providerData
    };

    user = await Student.create(userProfile).fetch();

    EmailService.sendToUser(user, 'welcome-social-email', {
      provider: "Facebook",
      userInfo: user
    });
  }

  user.role = 'student';
  cb(null, user);
}

async function handleGoogleAuthentication(req, accessToken, refreshToken, profile, cb) {
  const providerData = _.get(profile, '_json');
  if (!providerData) {
    return cb(null, false, {
      message: "Cannot get provider data."
    })
  }
  const userProfile = {
    firstName: _.get(providerData, 'name.familyName'),
    lastName: _.get(providerData, 'name.givenName'),
    email: _.get(providerData, 'emails.0.value'),
    gender: transformGender(providerData.gender),
    profileImageURL: _.get(providerData, 'image.url'),
    emailVerified: true
  }

  if (!userProfile.email) {
    return cb(null, false, {
      message: "Cannot get email from this social account."
    })
  }

  const existingUser = await Student.findOne({ email: userProfile.email });
  let user;

  if (existingUser) {
    if (_.indexOf(existingUser.providers, 'google') == -1) {
      const updatedData = {
        providers: _.concat(existingUser.providers, 'google'),
        providerData: _.assign(existingUser.providerData, { 'google': providerData }),
        emailVerified: true
      }

      const updatedUsers = await Student.update({ id: existingUser.id }).set(updatedData).fetch();
      user = _.get(updatedUsers, '0', existingUser);
    } else {
      user = existingUser;
    }
  } else {
    userProfile.providers = ['google'];
    userProfile.providerData = {
      'google': providerData
    };

    user = await Student.create(userProfile).fetch();
    EmailService.sendToUser(user, 'welcome-social-email', {
      provider: "Google",
      userInfo: user
    });
  }

  user.role = 'student';
  cb(null, user);
}

function transformGender(givenGender) {
  givenGender = _.toLower(givenGender);
  switch (givenGender) {
    case 'male': return 'MALE';
    case 'female': return 'FEMALE';
    case 'other': return 'OTHER';
    default: return 'UNKNOWN';
  }
}