const {
  client,
  q,
  PROJECTIONS,
  PROJECTION_ITEMS,
} = require("../faunadb-client");

exports.handler = async function (event, context) {
  // your server-side functionality
  try {
    const existsProjections = await client.query(
      q.Exists(q.Collection(PROJECTIONS))
    );
    if (!existsProjections) {
      await client.query(q.CreateCollection({ name: PROJECTIONS }));

      await client.query(
        q.CreateIndex({
          name: "projections_by_name",
          source: {
            collection: q.Collection(PROJECTIONS),
            fields: {
              name: q.Query(
                q.Lambda(
                  "projection",
                  q.Concat(
                    [
                      q.Select(["data", "month"], q.Var("projection")),
                      q.Select(["data", "year"], q.Var("projection")),
                    ],
                    " "
                  )
                )
              ),
            },
          },
          terms: [{ binding: "name" }],
          unique: true,
        })
      );

      await client.query(
        q.CreateIndex({
          name: "projections_by_user",
          source: q.Collection(PROJECTIONS),
          terms: [{ field: ["data", "username"] }],
          values: [
            { field: ["data", "month"], reverse: true },
            { field: ["data", "year"], reverse: true },
            { field: ["ref"] },
          ],
        })
      );

      const projection = await client.query(
        q.Create(q.Collection(PROJECTIONS), {
          data: {
            month: 1,
            year: 2020,
            username: "Test",
            createdAt: q.Now(),
          },
        })
      );

      console.log("Projection", projection);

      await client.query(q.CreateCollection({ name: PROJECTION_ITEMS }));
      await client.query(
        q.CreateIndex({
          name: "projection_items_by_category",
          source: q.Collection(PROJECTION_ITEMS),
          terms: [
            { field: ["data", "category"] },
            { field: ["data", "projectionRef"] },
          ],
          values: [{ field: ["data", "category"] }, { field: ["ref"] }],
          unique: true,
        })
      );
      const projectionItem = client.query(
        q.Create(q.Collection(PROJECTION_ITEMS), {
          data: {
            category: "vacations",
            minValue: 20000,
            maxValue: 50000,
            createdAt: q.Now(),
            projectionRef: projection.ref,
          },
        })
      );

      console.log("Projection Item", projectionItem);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "my text" }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};
