const slugify = require('slugify');
const shortid = require('shortid');
const {
  MISSING_PARAMETERS,
  PERMISSION_DENIED,
  INTERNAL_SERVER_ERROR
} = require('../../../constants/error-code');

module.exports = async function (req, res) {
  const companyUser = _.get(req, "user");
  const userId = companyUser.id;
  const role = companyUser.role;
  const companyId = _.get(req, "params.id");
  const {
    name,
    address,
    city,
    contactName,
    phoneNumber,
    website,
    description,
    videoURL
  } = req.body;

  if ((role === 'company') && (userId !== companyId)) {
    return res.unauthorized({
      message: "Permission denied.",
      devMessage: "You are not allowed to do this action.",
      code: PERMISSION_DENIED
    });
  }

  if (!name.trim() || !contactName.trim() || !phoneNumber || !address.trim()) {
    return res.badRequest({
      message: "Missing parameters.",
      devMessage: "Missing parameters (`name` | `contactName` || `phoneNumber` | `address`)",
      code: MISSING_PARAMETERS
    });
  }

  let updatedFields = {
    name: _.escape(name.trim()),
    address,
    city: transformCity(city),
    contactName,
    phoneNumber,
    website,
    description,
    videoURL
  }

  if (companyUser.name !== name || !companyUser.slug) {
    const cleanName = _.escape(name.trim().toLowerCase());
    updatedFields.slug = `${slugify(cleanName)}-${shortid.generate()}`;
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