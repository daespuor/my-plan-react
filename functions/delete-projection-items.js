const { client, q, PROJECTION_ITEMS } = require("../faunadb-client");

exports.handler = async function (event, context) {
  try {
    const { projectionItemId } = event.queryStringParameters;
    const projectionItem = await client.query(
      q.Delete(q.Ref(q.Collection(PROJECTION_ITEMS), projectionItemId))
    );
    return {
      statusCode: 200,
      body: JSON.stringify(projectionItem.data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};
