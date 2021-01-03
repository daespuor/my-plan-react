const { client, q, indices, PROJECTIONS } = require("../faunadb-client");

exports.handler = async function (event, context) {
  try {
    const { projectionId } = event.queryStringParameters;
    const { user } = context.clientContext;
    if (user) {
      const ref = await client.query(
        q.Ref(q.Collection(PROJECTIONS), projectionId)
      );
      const projectionItems = await client.query(
        q.Map(
          q.Paginate(
            q.Match(q.Index(indices.projectionItemsByProjection), ref)
          ),
          q.Lambda("projectionItemsArray", {
            category: q.Select([0], q.Var("projectionItemsArray")),
            minValue: q.Select([1], q.Var("projectionItemsArray")),
            maxValue: q.Select([2], q.Var("projectionItemsArray")),
            ref: q.Select([3], q.Var("projectionItemsArray")),
          })
        )
      );

      return {
        statusCode: 200,
        body: JSON.stringify(projectionItems.data),
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
