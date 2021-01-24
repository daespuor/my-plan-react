const {
  client,
  q,
  PROJECTIONS,
  PROJECTION_ITEMS,
  PARAMETERS,
} = require("../faunadb-client");

const setupProjections = async () => {
  const existsProjections = await client.query(
    q.Exists(q.Collection(PROJECTIONS))
  );
  if (!existsProjections) {
    await client.query(q.CreateCollection({ name: PROJECTIONS }));
    await client.query(
      q.CreateIndex({
        name: "projections",
        source: q.Collection(PROJECTIONS),
      })
    );

    await client.query(
      q.CreateIndex({
        name: "projections_by_month_and_year",
        source: q.Collection(PROJECTIONS),
        terms: [
          { field: ["data", "username"] },
          { field: ["data", "month"] },
          { field: ["data", "year"] },
        ],
        unique: true,
      })
    );
    await client.query(
      q.CreateIndex({
        name: "projections_by_user",
        source: q.Collection(PROJECTIONS),
        terms: [{ field: ["data", "username"] }],
        values: [
          { field: ["data", "year"], reverse: true },
          { field: ["data", "month"], reverse: true },
          { field: ["ref"] },
        ],
        unique: true,
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
  }
};

const setupProjectionItems = async () => {
  const existProjectionItems = await client.query(
    q.Exists(q.Collection(PROJECTION_ITEMS))
  );
  if (!existProjectionItems) {
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
    await client.query(
      q.CreateIndex({
        name: "projection_items_by_projection",
        source: q.Collection(PROJECTION_ITEMS),
        terms: [{ field: ["data", "projectionRef"] }],
        values: [
          { field: ["data", "category"] },
          { field: ["data", "minValue"] },
          { field: ["data", "maxValue"] },
          { field: ["ref"] },
        ],
        unique: true,
      })
    );

    const projection = await client.query(
      q.Paginate(q.Match(q.Index("projections")))
    );

    if (projection) {
      const projectionItem = client.query(
        q.Create(q.Collection(PROJECTION_ITEMS), {
          data: {
            category: "vacations",
            minValue: 20000,
            maxValue: 50000,
            createdAt: q.Now(),
            projectionRef: projection.data[0],
          },
        })
      );

      console.log("Projection Item", projectionItem);
    }
  }
};

const setupGeneralParameters = async () => {
  const existParameters = await client.query(
    q.Exists(q.Collection(PARAMETERS))
  );

  if (!existParameters) {
    await client.query(q.CreateCollection({ name: PARAMETERS }));
    await client.query(
      q.CreateIndex({
        name: "parameters_by_username",
        source: q.Collection(PARAMETERS),
        terms: [{ field: ["data", "username"] }],
        values: [
          { field: ["data", "name"] },
          { field: ["data", "value"] },
          { field: ["data", "total"] },
          { field: ["data", "month"] },
          { field: ["data", "year"] },
          { field: ["data", "timestamp"], reverse: true },
          { field: ["ref"] },
        ],
      })
    );
  }
};

exports.handler = async function (event, context) {
  // your server-side functionality
  try {
    await setupProjections();
    await setupProjectionItems();
    await setupGeneralParameters();
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
