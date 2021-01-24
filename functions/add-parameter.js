const { client, q, PARAMETERS } = require("../faunadb-client");

exports.handler = async function (event, context) {
  try {
    const { parameter } = JSON.parse(event.body);
    const { user } = context.clientContext;
    if (user) {
      const newParameter = await client.query(
        q.Create(q.Collection(PARAMETERS), {
          data: parameter,
        })
      );

      return {
        statusCode: 200,
        body: JSON.stringify(newParameter),
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
