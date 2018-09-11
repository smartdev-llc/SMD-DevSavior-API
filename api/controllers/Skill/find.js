module.exports = async function (req, res) {
    const skills = await Skill.find();
    
    res.ok(skills);
}