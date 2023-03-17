const postModel = require("./post-model");
const userModel = require("../users/users-model");
const checkPostId = async (req, res, next) => {
  let postIdCheck = await postModel.findPostById(req.params.id);
  if (!postIdCheck) {
    res.status(404).json({ message: "Belirtilen id'li post bulunamadı" });
  } else {
    next();
  }
};
const checkUserPostId = async (req, res, next) => {
  let userIdCheck = await userModel.findUserById(req.params.id);
  if (!userIdCheck) {
    res.status(404).json({ message: "Belirtilen id'li User bulunamadı" });
  } else {
    next();
  }
};
module.exports = {
  checkPostId,
  checkUserPostId,
};
