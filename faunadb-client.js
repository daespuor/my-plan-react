const faunadb = require("faunadb");
const dotenv = require("dotenv");

dotenv.config();

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNA_DB_SECRET_KEY,
});
const PROJECTIONS = "projections";
const PROJECTION_ITEMS = "projection_items";

const indices = {
  projectionsByName: "projections_by_name",
  projectionsByUser: "projections_by_user",
  projectionItemByCategory: "projection_items_by_category",
};

module.exports = {
  q,
  client,
  PROJECTIONS,
  PROJECTION_ITEMS,
  indices,
};
