const constants = require('../../../constants');
const { ACTIVE } = constants.STATUS;

const {
  INTERNAL_SERVER_ERROR
} = require('../../../constants/error-code');

module.exports = async function (req, res) {
  try {
    const skills = await Skill.find().where({ status: ACTIVE });;

    res.ok(skills);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }
};
