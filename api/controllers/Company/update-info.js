const {
  MISSING_PARAMETERS,
  INVALID_PARAMETERS,
  PERMISSION_DENIED,
  INTERNAL_SERVER_ERROR
} = require('../../../constants/error-code');

module.exports = async function (req, res) {
  const userId = _.get(req, "user.id");
  const role = _.get(req, "user.role");
  const companyId = _.get(req, "params.id");
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

  if ((role === 'company') && (userId !== id)) {
    return res.unauthorized({
      message: "Permission denied.",
      devMessage: "You are not allowed to do this action.",
      code: PERMISSION_DENIED
    });
  }

  if (!name || !contactName || !phoneNumber || !address) {
    return res.badRequest({
      message: "Missing parameters.",
      devMessage: "Missing parameters (`name` | `contactName` || `phoneNumber` | `address`)",
      code: MISSING_PARAMETERS
    });
  }

  if (!_.isString(name) || !_.isString(address) || !_.isString(description)) {
    return res.badRequest({
      message: "Invalid parameters.",
      devMessage: "Invalid parameters (`name` | `address` | `description`)",
      code: INVALID_PARAMETERS
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
    const updatedCompany = await Company.updateOne({ id: companyId })
      .set(updatedFields);

    ElasticsearchService.updateByQuery({
      type: 'Job',
      body: {
        query: {
          nested: {
            path: "company",
            query: {
              term: {
                "company.id": companyId
              }
            }
          }
        },
        script: {
          source:  Object.keys(updatedFields).reduce((script, key)=>{
            return script + `ctx._source.company.${key} = '${updatedFields[key]}';`;
          }, "")
        }
      }
    });

    res.ok(updatedCompany);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
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