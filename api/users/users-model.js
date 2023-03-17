const db = require("../../data/db-config");

async function findAllUsers() {
  return db("users");
}
async function findUserById(id) {
  const user = await db("users").where("user_id", id).first();
  return user;
}
async function createUser(user) {
  const createdUserId = await db("users").insert(user);
  const createdUser = await findUserById(createdUserId);
  return createdUser;
}
async function deleteUser(id) {
  const deleteUser = await db("users").where("user_id", id).del();
  return deleteUser;
}
async function updateUserById(id, user) {
  return db("users").where("user_id", id).update(user);
}
async function findByFilter(filter) {
  let filteredUser = await db("users").where(filter).first();
  return filteredUser;
}

module.exports = {
  findAllUsers,
  findUserById,
  createUser,
  deleteUser,
  updateUserById,
  findByFilter,
};
