const fs = require('fs');
const isImage = require('is-image');

module.exports = async function (req, res) {
  const photoName = req.params.photoName;

  if (!photoName || !isImage(photoName)) {
    return res.notFound({
      message: "Photo not found."
    });
  }

  const uploadFolder = process.env.UPLOAD_FOLDER || '.tmp';
  const absolutePhotoPath = `${uploadFolder}/photos/${photoName}`;

  fs.unlink(absolutePhotoPath, (err) => {
    if (err) {
      fs.unlink(`${process.env.PWD}/.tmp/uploads/.tmp/photos/${photoName}`, () => {})
    }
  })

  return res.ok({
    message: 'File deleted!'
  });
}