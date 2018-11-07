const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  FacebookTokenStrategy = require("passport-facebook-token"),
  GoogleTokenStrategy = require("passport-google-token").Strategy,
  bcrypt = require("bcrypt-nodejs");

const {
  INVALID_PARAMETERS,
  INTERNAL_SERVER_ERROR,
  INACCESSIBLE_DATA
} = require("../constants/error-code");

passport.serializeUser(function(user, cb) {
  cb(null, _.pick(user, ["id", "role", "email"]));
});

passport.deserializeUser(async function(userInfo, cb) {
  const { id, email, role } = userInfo;
  let user;
  try {
    if (role === "company") {
      user = await Company.findOne({ id, email });
    } else {
      user = await Student.findOne({ id, email });
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
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    handleLocalAuthentication
  )
);

passport.use(
  new FacebookTokenStrategy(
    {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      profileFields: [
        "id",
        "displayName",
        "name",
        "photos",
        "email",
        "gender",
        "birthday"
      ],
      passReqToCallback: true
    },
    handleFacebookAuthentication
  )
);

passport.use(
  new GoogleTokenStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      passReqToCallback: true
    },
    handleGoogleAuthentication
  )
);

async function handleLocalAuthentication(req, email, password, cb) {
  const role = req.param("role") || "student";

  let user;

  try {
    if (role === "company") {
      user = await Company.findOne({ email });
    } else if (role === "admin") {
      user = await Admin.findOne({ email });
    } else {
      user = await Student.findOne({ email });
    }
  } catch (err) {
    return cb({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }

  if (!user) {
    return cb(null, false, {
      message: "Invalid email or password.",
      devMessage: "`email` or `password` is invalid.",
      code: INVALID_PARAMETERS
    });
  }

  const isValidPassword = bcrypt.compareSync(password, user.password);
  if (!isValidPassword) {
    return cb(null, false, {
      message: "Invalid email or password.",
      devMessage: "`email` or `password` is invalid.",
      code: INVALID_PARAMETERS
    });
  }

  user.role = role;

  return cb(null, user);
}

async function handleFacebookAuthentication(
  req,
  accessToken,
  refreshToken,
  profile,
  cb
) {
  const providerData = _.get(profile, "_json");
  if (!providerData) {
    return cb(null, false, {
      message: "Cannot get provider data.",
      devMessage: "`providerData` is empty",
      code: INACCESSIBLE_DATA
    });
  }

  const userProfile = {
    firstName: providerData.first_name,
    lastName: `${providerData.last_name || ""} ${providerData.middle_name ||
      ""}`.trim(),
    email: providerData.email,
    gender: transformGender(providerData.gender),
    profileImageURL: providerData.id
      ? `https://graph.facebook.com/${profile.id}/picture?type=large`
      : undefined,
    emailVerified: true
  };

  if (!userProfile.email) {
    return cb(null, false, {
      message: "Cannot get email from this social account.",
      devMessage: "`email` is empty",
      code: INACCESSIBLE_DATA
    });
  }

  let existingUser;
  try {
    existingUser = await Student.findOne({ email: userProfile.email });
  } catch (err) {
    return cb({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }
  let user;

  if (existingUser) {
    if (_.indexOf(existingUser.providers, "facebook") == -1) {
      const updatedData = {
        providers: _.concat(existingUser.providers, "facebook"),
        providerData: _.assign(existingUser.providerData, {
          facebook: providerData
        }),
        emailVerified: true
      };

      try {
        const updatedUsers = await Student.update({ id: existingUser.id })
          .set(updatedData)
          .fetch();
        user = _.get(updatedUsers, "0", existingUser);
      } catch (err) {
        return cb({
          message: "Something went wrong.",
          devMessage: err.message,
          code: INTERNAL_SERVER_ERROR
        });
      }
    } else {
      user = existingUser;
    }
  } else {
    userProfile.providers = ["facebook"];
    userProfile.providerData = {
      facebook: providerData
    };

    try {
      user = await Student.create(userProfile).fetch();
      await Profile.create({ owner: user.id });
    } catch (err) {
      return cb({
        message: "Something went wrong.",
        devMessage: err.message,
        code: INTERNAL_SERVER_ERROR
      });
    }

    EmailService.sendToUser(user, "welcome-social-email", {
      provider: "Facebook",
      userInfo: user
    });
  }

  user.role = "student";
  cb(null, user);
}

async function handleGoogleAuthentication(
  req,
  accessToken,
  refreshToken,
  profile,
  cb
) {
  const providerData = _.get(profile, "_json");
  if (!providerData) {
    return cb(null, false, {
      message: "Cannot get provider data.",
      devMessage: "`providerData` is empty",
      code: INACCESSIBLE_DATA
    });
  }

  const userProfile = {
    firstName: _.get(providerData, "family_name"),
    lastName: _.get(providerData, "given_name"),
    email: _.get(providerData, "email", _.get(providerData, "emails.0.value")),
    gender: transformGender(providerData.gender),
    profileImageURL: _.get(providerData, "picture"),
    emailVerified: true
  };

  if (!userProfile.email) {
    return cb(null, false, {
      message: "Cannot get email from this social account.",
      devMessage: "`email` is empty",
      code: INACCESSIBLE_DATA
    });
  }

  let existingUser;
  try {
    existingUser = await Student.findOne({ email: userProfile.email });
  } catch (err) {
    return cb({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }
  let user;

  if (existingUser) {
    if (_.indexOf(existingUser.providers, "google") == -1) {
      const updatedData = {
        providers: _.concat(existingUser.providers, "google"),
        providerData: _.assign(existingUser.providerData, {
          google: providerData
        }),
        emailVerified: true
      };

      try {
        const updatedUsers = await Student.update({ id: existingUser.id })
          .set(updatedData)
          .fetch();
        user = _.get(updatedUsers, "0", existingUser);
      } catch (err) {
        return cb({
          message: "Something went wrong.",
          devMessage: err.message,
          code: INTERNAL_SERVER_ERROR
        });
      }
    } else {
      user = existingUser;
    }
  } else {
    userProfile.providers = ["google"];
    userProfile.providerData = {
      google: providerData
    };

    try {
      user = await Student.create(userProfile).fetch();
      await Profile.create({ owner: user.id });
    } catch (err) {
      return cb({
        message: "Something went wrong.",
        devMessage: err.message,
        code: INTERNAL_SERVER_ERROR
      });
    }
    EmailService.sendToUser(user, "welcome-social-email", {
      provider: "Google",
      userInfo: user
    });
  }

  user.role = "student";
  cb(null, user);
}

function transformGender(givenGender) {
  givenGender = _.toUpper(givenGender);
  switch (givenGender) {
    case "MALE":
      return "MALE";
    case "FEMALE":
      return "FEMALE";
    case "OTHER":
      return "OTHER";
    default:
      return "UNKNOWN";
  }
}
