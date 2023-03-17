/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema

    .createTable("users", (tablo) => {
      tablo.increments("user_id");
      tablo.string("username").unique().notNullable();
      tablo.string("password").notNullable();
      tablo.string("role_name").notNullable();
    })
    .createTable("posts", (tablo) => {
      tablo.increments("post_id");
      tablo.string("post", 256);
      tablo
        .integer("user_id")
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("users")
    .dropTableIfExists("posts")
    .dropTableIfExists("role");
};
