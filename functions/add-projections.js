const { client, q, PROJECTIONS } = require("../faunadb-client");

exports.handler = async function (event, context) {
  try {
    const { projection } = JSON.parse(event.body);
    const newProjection = await client.query(
      q.Create(q.Collection(PROJECTIONS), {
        data: projection,
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(newProjection),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};
