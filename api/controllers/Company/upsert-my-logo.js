const fs = require('fs');

const constants = require('../../../constants');
const { FILE_LIMIT_SIZE: maxBytes } = constants;
const { 
  isImage
} = require('../../../utils/validator');

module.exports = async function (req, res) {
  const companyId = _.get(req, 'user.id');
  const uploadFile = req.file('file');
  const originalFilename = _.get(uploadFile, '_files.0.stream.filename');
  
  if (!originalFilename || !isImage(originalFilename)) {
    return res.badRequest({
      message: "Invalid file extension."
    });
  }

  const uploadFolder = process.env.UPLOAD_FOLDER || '.';

  uploadFile.upload({
    dirname: `${uploadFolder}/photos`,
    maxBytes
  }, async function (err, uploadedFiles) {
    if (err) {
      return res.serverError(err);
    }

    // If no files were uploaded, respond with an error.
    if (!_.size(uploadedFiles)) {
      return res.badRequest({
        message: 'No file was uploaded.'
      });
    }

    const photoName = _.get(uploadedFiles, '0.fd', '').split('/').pop();
    const photoUrl = `/photos/${photoName}`;

    const oldLogoURL = _.get(req, 'user.logoURL');

    try {
      await Company.update({ id: companyId }).set({ logoURL: photoUrl });
      if (oldLogoURL) {
        deleteOldImage(oldLogoURL);
      }
  
      res.ok({
        photoUrl
      });
    } catch (err) {
      return res.serverError({
        message: "Something went wrong."
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
