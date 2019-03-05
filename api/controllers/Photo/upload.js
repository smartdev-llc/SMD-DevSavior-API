const constants = require('../../../constants');
const { FILE_LIMIT_SIZE: maxBytes } = constants;
const { 
  isImage
} = require('../../../utils/validator');

const {
  INVALID_EXTENSION,
  INTERNAL_SERVER_ERROR
} = require('../../../constants/error-code');

module.exports = async function (req, res) {
  const uploadFile = req.file('file');
  const originalFilename = _.get(uploadFile, '_files.0.stream.filename');
  
  if (!originalFilename || !isImage(originalFilename)) {
    return res.badRequest({
      message: "Invalid file extension.",
      devMessage: "Invalid file extension.",
      code: INVALID_EXTENSION
    });
  }

  const uploadFolder = process.env.UPLOAD_FOLDER || '.';

  uploadFile.upload({
    dirname: `${uploadFolder}/photos`,
    maxBytes
  }, function (err, uploadedFiles) {
    if (err) {
      return res.serverError({
        message: "Something went wrong.",
        devMessage: err.message,
        code: INTERNAL_SERVER_ERROR
      });
    }

    // If no files were uploaded, respond with an error.
    if (!_.size(uploadedFiles)) {
      return res.serverError({
        message: "Something went wrong.",
        devMessage: "File is not uploaded.",
        code: INTERNAL_SERVER_ERROR
      });
    }

    const photoName = _.get(uploadedFiles, '0.fd', '').split('/').pop();

    res.ok({
      photoURL: `/photos/${photoName}`
    });
  })
}
