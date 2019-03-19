const slugifyMd = require('slugify');
const shortid = require('shortid');

const transformCity = (reqCity) => {
  reqCity = _.toUpper(reqCity);
  switch (reqCity) {
    case 'HN': return 'HN';
    case 'TPHCM': return 'TPHCM';
    case 'DN': return 'DN';
    default: return 'OTHER';
  }
};

const removeSpecialCharater = str => {
  return str.replace(/[ &\/\\#,+()$~%.'":*?<>{}]/g, " ").trim().replace(/( )+/g, " ").toLowerCase();
}

const slugify = (title) => {
  const cleanName = _.escape(title.trim());
  return `${slugifyMd(removeSpecialCharater(cleanName))}-${shortid.generate().toLowerCase()}`;
}

module.exports = {
  transformCity,
  slugify
}