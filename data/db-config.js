const knex = require("knex");

const configFile = require("../knexfile");

const environment = process.env.NODE_ENV || "development";

module.exports = knex(configFile[environment]);
