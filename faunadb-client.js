const faunadb = require("faunadb");
const dotenv = require("dotenv");

dotenv.config();

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNA_DB_SECRET_KEY,
});
const PROJECTIONS = "projections";
const PROJECTION_ITEMS = "projection_items";
const PARAMETERS = "parameters";
const indices = {
  projectionsByMonthAndYear: "projections_by_month_and_year",
  projectionsByUser: "projections_by_user",
  projectionById: "projection_by_id",
  projectionItemByCategory: "projection_items_by_category",
  projectionItemsByProjection: "projection_items_by_projection",
  projections: "projections",
  parameters: "parameters_by_username",
};

module.exports = {
  q,
  client,
  PROJECTIONS,
  PROJECTION_ITEMS,
  PARAMETERS,
  indices,
};
