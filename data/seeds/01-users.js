/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").truncate();
  await knex("users").insert([
    {
      user_id: 1,
      username: "rowValue1",
      password: "123456",
      role_name: "admin",
    },
    {
      user_id: 2,
      username: "rowValue2",
      password: "123456",
      role_name: "user",
    },
    {
      user_id: 3,
      username: "rowValue3",
      password: "123456",
      role_name: "user",
    },
  ]);
};
