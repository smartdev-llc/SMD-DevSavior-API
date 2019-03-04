const fs = require('fs');

const {
  INVALID_EXTENSION,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR
} = require('../../../constants/error-code');

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
      message: "Invalid file extension.",
      devMessage: "Invalid file extension.",
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
      return res.badRequest({
        message: "No file was uploaded.",
        devMessage: "File is not uploaded",
        code: BAD_REQUEST
      });
    }

    const photoName = _.get(uploadedFiles, '0.fd', '').split('/').pop();
    const photoUrl = `/photos/${photoName}`;

    const oldLogoURL = _.get(req, 'user.logoURL');

    try {
      await Company.updateOne({ id: companyId }).set({ logoURL: photoUrl });
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
            source: `ctx._source.company.logoURL = '${photoUrl}';`
          }
        }
      });
      if (oldLogoURL) {
        deleteOldImage(oldLogoURL);
      }
  
      res.ok({
        photoUrl
      });
    } catch (err) {
      return res.serverError({
        message: "Something went wrong.",
        devMessage: err.message,
        code: INTERNAL_SERVER_ERROR
      });
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
