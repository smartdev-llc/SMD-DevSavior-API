module.exports = async function (req, res) {
  const accessToken = req.accessToken;
  if (accessToken) {
    try {
      await addTokenToBlackList(accessToken);
    } catch (err) {
      // Ignore
    }
  }

  res.ok({
    message: "Logged out."
  });

  async function addTokenToBlackList() {
    let decoded;
    try {
      decoded = await JwtService.verify(accessToken);
    } catch (err) {
      if (err) {
        return;
      }
    }

    const jwtid = _.get(decoded, 'jwtid');
    const expirationTime = _.get(decoded, 'exp');
    if (!_.isNil(jwtid) && _.isNumber(expirationTime)) {
      const now = Date.now();
      if (expirationTime - now / 1000 > 0) {
        const exp = Math.round(expirationTime - now / 1000);
        JwtService.addToBlackList(jwtid, exp);
      }
    }
  }
}