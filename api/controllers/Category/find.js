module.exports = async function (req, res) {
    const categories = await Category.find();
    
    res.ok(categories);
}