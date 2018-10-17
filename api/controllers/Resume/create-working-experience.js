module.exports = async function (req, res) {
  const userId = _.get(req, 'user.id');

  const {
    fullName,
    phoneNumber,
    email,
    dateOfBirth,
    gender,
    maritalStatus,
    country,
    city,
    currentAddress
  } = req.body;

  if (!fullName || !phoneNumber || !email || !dateOfBirth || !gender || _.isNil(maritalStatus) || !country || !city || !currentAddress) {
    return res.badRequest({
      message: "Missing parameters."
    });
  }

  if (!validator.isEmail(email)) {
    return res.badRequest({
      message: "Invalid email."
    });
  }

  



}