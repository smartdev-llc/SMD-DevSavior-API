const isImage = require('is-image');

module.exports = async function (req, res) {
  const photoName = req.params.photoName;

  if (!photoName || !isImage(photoName)) {
    return res.notFound({
      message: "Photo not found."
    });
  }

  const fileAdapter = require('skipper-disk')();

  const uploadFolder = process.env.UPLOAD_FOLDER || '.tmp';
  const absolutePhotoPath = `${uploadFolder}/photos/${photoName}`;

  // Stream the file down
  fileAdapter.read(absolutePhotoPath)
    .on('error', function (err) {
      return res.notFound({
        message: "Photo not found."
      });
    })
    .pipe(res);
}
