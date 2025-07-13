import { Hono } from "hono";
import { createRequestHandler } from "react-router";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/api/runners", async (c) => {
  const { results } = await c.env.DB.prepare("SELECT * FROM runners").all();
  return c.json(results);
});

app.get("/api/locations", async (c) => {
  try {
    const { results } = await c.env.DB.prepare("SELECT * FROM locations").all();
    return c.json(results);
  } catch (e) {
    console.error(e);
    return c.json({ error: "Failed to fetch locations" }, 500);
  }
});

// Add more routes here

app.get("*", (c) => {
  const requestHandler = createRequestHandler(
    () => import("virtual:react-router/server-build"),
    import.meta.env.MODE,
  );

  return requestHandler(c.req.raw, {
    cloudflare: { env: c.env, ctx: c.executionCtx },
  });
});

export default app;
