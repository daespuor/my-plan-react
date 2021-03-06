const { client, q, PROJECTIONS } = require("../faunadb-client");

exports.handler = async function (event, context) {
  try {
    const { projection } = JSON.parse(event.body);
    const { user } = context.clientContext;
    if (user) {
      const newProjection = await client.query(
        q.Create(q.Collection(PROJECTIONS), {
          data: projection,
        })
      );

      return {
        statusCode: 200,
        body: JSON.stringify(newProjection),
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
