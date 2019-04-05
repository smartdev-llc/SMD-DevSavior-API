const fs = require('fs');

const {
  NOT_FOUND,
  PERMISSION_DENIED,
  INTERNAL_SERVER_ERROR
} = require('../../../constants/error-code');

const { 
  isImage
} = require('../../../utils/validator');

module.exports = async function (req, res) {
  const userId = _.get(req, "user.id");
  const role = _.get(req, "user.role");
  const companyId = _.get(req, "params.id");
  const photoName = req.params.photoName;

  if ((role === 'company') && (userId !== id)) {
    return res.unauthorized({
      message: "Permission denied.",
      devMessage: "You are not allowed to do this action.",
      code: PERMISSION_DENIED
    });
  }
  
  if (!photoName || !isImage(photoName)) {
    return res.notFound({
      message: "Photo not found.",
      devMessage: "Photo is not found.",
      code: NOT_FOUND
    });
  }

  const photoURL = `photos/${photoName}`;
  const uploadFolder = process.env.UPLOAD_FOLDER || '.tmp';
  const absolutePhotoPath = `${uploadFolder}/photos/${photoName}`;

  try {
    const company = await Company.findOne({ id: companyId });

    if (_.indexOf(company.photoURLs || [], photoURL)) {
      return res.notFound({
        message: "Photo not found.",
        devMessage: "Photo is not found.",
        code: NOT_FOUND
      });
    }

    const photoURLs = _.without(company.photoURLs || [], photoURL);
    await Company.updateOne({ id: companyId }).set({ photoURLs });

    fs.unlink(absolutePhotoPath, (err) => {
      if (err) {
        fs.unlink(`.tmp/uploads/photos/${photoName}`, () => {})
      }
    })

    res.ok({
      photoURLs
    });
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }
}
