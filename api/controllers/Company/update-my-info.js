module.exports = async function (req, res) {
  const companyId = _.get(req, "user.id");
  const {
    name,
    address,
    city,
    contactName,
    phoneNumber,
    website,
    description,
    photoURLs,
    videoURL
  } = req.body;

  if (!name || !contactName || !phoneNumber || !address) {
    return res.badRequest({
      message: "Missing parameters."
    });
  }

  if (!_.isString(name) || !_.isString(address) || !_.isString(description)) {
    return res.badRequest({
      message: "Invalid parameters."
    });
  }

  const updatedFields = {
    name: _.escape(name),
    address,
    city: transformCity(city),
    contactName,
    phoneNumber,
    website,
    description,
    photoURLs,
    videoURL
  }

  try {
    const updatedInfo = await Company.update({ id: companyId })
      .set(updatedFields)
      .fetch();
    const updatedCompany = _.get(updatedInfo, '0');
    if (updatedCompany) {
      res.ok(updatedCompany);
    } else {
      return res.serverError({
        message: "Something went wrong."
      });
    }
  } catch (err) {
    return res.serverError({
      message: "Something went wrong."
    });
  }
}

const transformCity = (reqCity) => {
  reqCity = _.toUpper(reqCity);
  switch (reqCity) {
    case 'HN': return 'HN';
    case 'TPHCM': return 'TPHCM';
    case 'DN': return 'DN';
    default: return 'OTHER';
  }
};