module.exports = async function (req, res) {
  await req.logout();
  res.ok("Logged out.")
}