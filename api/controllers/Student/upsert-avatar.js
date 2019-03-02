const fs = require('fs');

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
  const userId = _.get(req, 'user.id');
  const uploadFile = req.file('file');
  const originalFilename = _.get(uploadFile, '_files.0.stream.filename');
  
  if (!originalFilename || !isImage(originalFilename)) {
    return res.badRequest({
      message: "Invalid file extension.",
      devMessage: "Wrong image extension.",
      code: INVALID_EXTENSION
    });
  }

  const uploadFolder = process.env.UPLOAD_FOLDER || '.';

  uploadFile.upload({
    dirname: `${uploadFolder}/photos`,
    maxBytes
  }, async function (err, uploadedFiles) {
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
        message: 'No file was uploaded.',
        devMessage: "Upload failed.",
        code: INTERNAL_SERVER_ERROR
      });
    }

    const photoName = _.get(uploadedFiles, '0.fd', '').split('/').pop();
    const photoUrl = `/photos/${photoName}`;

    const oldProfileImageURL = _.get(req, 'user.profileImageURL');
    try {
      await Student.updateOne({ id: userId }).set({ profileImageURL: photoUrl });
      if (oldProfileImageURL) {
        deleteOldImage(oldProfileImageURL);
      }
  
      res.ok({
        photoUrl
      });
    } catch (err) {
      return res.serverError({
        message: "Something went wrong.",
        devMessage: err.message,
        code: INTERNAL_SERVER_ERROR
      })
    }
  })

  function deleteOldImage(imageURL) {
    const photoName = imageURL.split('/').pop();
    const uploadFolder = process.env.UPLOAD_FOLDER || '.tmp';
    const absolutePhotoPath = `${uploadFolder}/photos/${photoName}`;

    fs.unlink(absolutePhotoPath, (err) => {
      if (err) {
        fs.unlink(`.tmp/uploads/photos/${photoName}`, () => {})
      }
    })
  }
}
