/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("posts").truncate();
  await knex("posts").insert([
    { post: "rowValue1", user_id: 1 },
    { post: "rowValue2", user_id: 1 },
    { post: "rowValue3", user_id: 2 },
    { post: "rowValue1", user_id: 3 },
  ]);
};
