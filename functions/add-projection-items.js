const {
  client,
  q,
  PROJECTION_ITEMS,
  PROJECTIONS,
} = require("../faunadb-client");

exports.handler = async function (event, context) {
  try {
    const { projectionItem } = JSON.parse(event.body);
    const { user } = context.clientContext;
    if (user) {
      const ref = await client.query(
        q.Ref(q.Collection(PROJECTIONS), projectionItem.projectionRef)
      );
      projectionItem.projectionRef = ref;
      const newProjectionItem = await client.query(
        q.Create(q.Collection(PROJECTION_ITEMS), {
          data: projectionItem,
        })
      );

      return {
        statusCode: 200,
        body: JSON.stringify(newProjectionItem),
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
