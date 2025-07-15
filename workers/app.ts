import { Hono } from "hono";
import { createRequestHandler } from "react-router";
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../app/db/schema';
import firstAid from "./data/firstAid";
import gate from "./data/gate";
import aid from "./data/aid";
import aed from "./data/aed";
import course from "./data/course";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/api/runners", async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const result = await db.query.runners.findMany();
  return c.json(result);
});

app.get("/api/locations", async (c) => {
  try {
    const db = drizzle(c.env.DB, { schema });
    const result = await db.query.locations.findMany();
    return c.json(result);
  } catch (e) {
    console.error(e);
    return c.json({ error: "Failed to fetch locations" }, 500);
  }
});

app.get("/api/geojson/firstAid", (c) => c.json(firstAid));
app.get("/api/geojson/gate", (c) => c.json(gate));
app.get("/api/geojson/aid", (c) => c.json(aid));
app.get("/api/geojson/aed", (c) => c.json(aed));
app.get("/api/geojson/course", (c) => c.json(course));

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