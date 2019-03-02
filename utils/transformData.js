const transformCity = (reqCity) => {
  reqCity = _.toUpper(reqCity);
  switch (reqCity) {
    case 'HN': return 'HN';
    case 'TPHCM': return 'TPHCM';
    case 'DN': return 'DN';
    default: return 'OTHER';
  }
};

module.exports = {
  transformCity
}