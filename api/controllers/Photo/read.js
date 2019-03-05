const { 
  isImage
} = require('../../../utils/validator');

const {
  NOT_FOUND
} = require('../../../constants/error-code');

module.exports = async function (req, res) {
  const photoName = req.params.photoName;

  if (!photoName || !isImage(photoName)) {
    return res.notFound({
      message: "Photo not found.",
      devMessage: "Photo is not found.",
      code: NOT_FOUND
    });
  }

  const fileAdapter = require('skipper-disk')();

  const uploadFolder = process.env.UPLOAD_FOLDER || '.tmp/uploads';
  const absolutePhotoPath = `${uploadFolder}/photos/${photoName}`;

  // Stream the file down
  fileAdapter.read(absolutePhotoPath)
    .on('error', function (err) {
      return res.notFound({
        message: "Photo not found.",
        devMessage: "Photo is not found.",
        code: NOT_FOUND
      });
    })
    .pipe(res);
}
