const { client, q, indices, PROJECTIONS } = require("../faunadb-client");

exports.handler = async function (event, context) {
  try {
    const { projectionId } = event.queryStringParameters;
    const projection = await client.query(
      q.Get(q.Ref(q.Collection(PROJECTIONS), projectionId))
    );

    return {
      statusCode: 200,
      body: JSON.stringify(projection.data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};
