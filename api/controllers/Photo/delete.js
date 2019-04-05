const fs = require('fs');
const { 
  isImage
} = require('../../../utils/validator');

const {
  NOT_FOUND
} = require('../../../constants/error-code');

module.exports = async function (req, res) {
  const { photoName } = req.params;

  if (!photoName || !isImage(photoName)) {
    return res.notFound({
      message: "Photo not found.",
      devMessage: "Photo is not found.",
      code: NOT_FOUND
    });
  }

  const uploadFolder = process.env.UPLOAD_FOLDER || '.tmp';
  const absolutePhotoPath = `${uploadFolder}/photos/${photoName}`;

  fs.unlink(absolutePhotoPath, (err) => {
    if (err) {
      fs.unlink(`.tmp/uploads/photos/${photoName}`, () => {})
    }
  })

  return res.ok({
    message: 'File deleted!'
  });
}