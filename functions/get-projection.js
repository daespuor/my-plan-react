const { client, q, PROJECTIONS } = require("../faunadb-client");

exports.handler = async function (event, context) {
  try {
    const { projectionId } = event.queryStringParameters;
    const { user } = context.clientContext;
    if (user) {
      const projection = await client.query(
        q.Get(q.Ref(q.Collection(PROJECTIONS), projectionId))
      );

      return {
        statusCode: 200,
        body: JSON.stringify(projection.data),
      };
    } else {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: "Unauthorized user" }),
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};
