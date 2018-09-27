const constants = require('../../../constants');
const { FILE_LIMIT_SIZE: maxBytes } = constants;
const isImage = require('is-image');

module.exports = async function (req, res) {
  const uploadFile = req.file('file');
  const originalFilename = _.get(uploadFile, '_files.0.stream.filename');
  
  if (!isImage(originalFilename)) {
    return res.badRequest({
      message: "Invalid file extension."
    });
  }

  const uploadFolder = process.env.UPLOAD_FOLDER || '.';

  uploadFile.upload({
    dirname: `${uploadFolder}/photos`,
    maxBytes
  }, function (err, uploadedFiles) {
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

    res.ok({
      photoUrl: `/photo/${photoName}`
    });
  })
}
