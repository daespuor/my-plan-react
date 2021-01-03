const { client, q, PROJECTION_ITEMS } = require("../faunadb-client");

exports.handler = async function (event, context) {
  try {
    const { projectionItemId } = event.queryStringParameters;
    const { user } = context.clientContext;
    if (user) {
      const projectionItem = await client.query(
        q.Delete(q.Ref(q.Collection(PROJECTION_ITEMS), projectionItemId))
      );
      return {
        statusCode: 200,
        body: JSON.stringify(projectionItem.data),
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
