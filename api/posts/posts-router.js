const router = require("express").Router();

const postModel = require("./post-model");
const mw = require("./post-middleware");
router.get("/", async (req, res, next) => {
  try {
    const allPost = await postModel.findAllPosts();
    res.json(allPost);
  } catch (error) {
    next(error);
  }
});
router.get("/:id", mw.checkPostId, async (req, res, next) => {
  try {
    const singlePost = await postModel.findPostById(req.params.id);
    res.json(singlePost);
  } catch (error) {
    next(error);
  }
});
router.get("/:id/userAllPost", mw.checkUserPostId, async (req, res, next) => {
  try {
    const userAllPost = await postModel.findUserPost(req.params.id);
    res.json(userAllPost);
  } catch (error) {
    next(error);
  }
});
router.post("/", async (req, res, next) => {
  try {
    const resPost = req.body;
    if (!resPost.post || !resPost.user_id) {
      res.status(404).json({
        message: "Geçerli bir post giriniz ve user id giriniz",
      });
    } else {
      postModel.createPost(resPost);
      res.status(201).json({
        message: "Başarıyla eklendi",
      });
    }
  } catch (error) {
    next(error);
  }
});
router.put("/:id", mw.checkPostId, async (req, res, next) => {
  try {
    const { post } = req.body;
    if (!post) {
      res.status(404).json({
        message: "Geçerli bir post giriniz",
      });
    } else {
      await postModel.editPostById(req.params.id, { post });
      res.json({ message: "Post Başarıyla Güncellendi" });
    }
  } catch (error) {
    next(error);
  }
});
router.delete("/:id", mw.checkPostId, async (req, res, next) => {
  try {
    await postModel.deletePostById(req.params.id);
    res.json({
      message: "Post başarıyla silindi",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
