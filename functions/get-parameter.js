const { client, q, indices } = require("../faunadb-client");

exports.handler = async function (event, context) {
  try {
    const { username } = event.queryStringParameters;
    const { user } = context.clientContext;
    if (user) {
      const parameters = await client.query(
        q.Map(
          q.Paginate(q.Match(q.Index(indices.parameters), username)),
          q.Lambda("parameter", {
            name: q.Select([0], q.Var("parameter")),
            value: q.Select([1], q.Var("parameter")),
            total: q.Select([2], q.Var("parameter")),
            month: q.Select([3], q.Var("parameter")),
            year: q.Select([4], q.Var("parameter")),
            timestamp: q.Select([5], q.Var("parameter")),
            ref: q.Select([6], q.Var("parameter")),
          })
        )
      );
      const { data } = parameters;

      const incomes = data.filter(({ name }) => name === "income");
      const debts = data.filter(({ name }) => name === "debt");
      const savings = data.filter(({ name }) => name === "saving");

      return {
        statusCode: 200,
        body: JSON.stringify({
          income: incomes.length ? incomes[0] : null,
          debt: debts.length ? debts[0] : null,
          saving: savings.length ? savings[0] : null,
        }),
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
