const db = require("../../data/db-config");

function findAllPosts() {
  return db("posts as p")
    .leftJoin("users as u", "p.user_id", "u.user_id")
    .select("p.*", "u.username")
    .orderBy("p.post_id", "asc");
}
async function findPostById(id) {
  return db("posts as p")
    .leftJoin("users as u", "p.user_id", "u.user_id")
    .select("p.*", "u.username")
    .where("p.post_id", id)
    .first();
}
async function findUserPost(id) {
  const UserPosts = await db("posts as p")
    .leftJoin("users as u", "p.user_id", "u.user_id")
    .select("p.*", "u.username")
    .where("p.user_id", id)
    .orderBy("p.post_id", "asc");
  const response = {
    user_id: parseInt(id),
    username: UserPosts[0].username,
    posts: [],
  };
  UserPosts.forEach((item) => {
    response.posts.push({
      post_id: item.post_id,
      post: item.post,
    });
  });
  return response;
}
async function createPost(post) {
  const insertedPost = await db("posts").insert(post);
  return await findPostById(insertedPost);
}
async function editPostById(id, post) {
  return db("posts").where("post_id", id).update(post);
}
async function deletePostById(id) {
  return db("posts").where("post_id", id).del();
}
module.exports = {
  findAllPosts,
  findPostById,
  findUserPost,
  createPost,
  editPostById,
  deletePostById,
};
