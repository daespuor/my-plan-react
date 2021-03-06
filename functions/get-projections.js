const { client, q, indices } = require("../faunadb-client");

exports.handler = async function (event, context) {
  try {
    const { username } = event.queryStringParameters;
    const { user } = context.clientContext;
    if (user) {
      const projectionsByUser = await client.query(
        q.Map(
          q.Paginate(q.Match(q.Index(indices.projectionsByUser), username)),
          q.Lambda("projectionArray", {
            month: q.Select([1], q.Var("projectionArray")),
            year: q.Select([0], q.Var("projectionArray")),
            ref: q.Select([2], q.Var("projectionArray")),
          })
        )
      );

      return {
        statusCode: 200,
        body: JSON.stringify(projectionsByUser.data),
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
