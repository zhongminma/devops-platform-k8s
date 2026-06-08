import cors from "cors";
import express from "express";
import { getDatabaseStatus, pingDatabase } from "./database.js";
import {
  createPost,
  deletePost,
  getPost,
  listPosts,
  updatePost
} from "./posts.repository.js";
import client from "prom-client";

client.collectDefaultMetrics();

const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"]
});

const httpRequestDurationSeconds = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5]
});

export const app = express();

app.use(cors());
app.use(express.json());
app.use(recordHttpMetrics);

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "devops-platform-backend",
    database: getDatabaseStatus()
  });
});

app.get("/ready", async (_req, res) => {
  const database = await pingDatabase();
  const ready = database.ok;

  res.status(ready ? 200 : 503).json({
    status: ready ? "ready" : "not_ready",
    service: "devops-platform-backend",
    database
  });
});

app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.get("/api/posts", async (_req, res) => {
  res.json(await listPosts());
});

app.get("/api/posts/:post_id", async (req, res) => {
  const post = await getPost(req.params.post_id);

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  return res.json(post);
});

app.post("/api/posts", async (req, res) => {
  const description = normalizeDescription(req.body?.description);

  if (!description) {
    return res.status(400).json({ error: "Post description is required" });
  }

  const post = await createPost(description);

  return res.status(201).json(post);
});

app.put("/api/posts/:post_id", async (req, res) => {
  const description = normalizeDescription(req.body?.description);

  if (req.body?.description !== undefined && !description) {
    return res.status(400).json({ error: "Post description cannot be empty" });
  }

  const existingPost = await getPost(req.params.post_id);

  if (!existingPost) {
    return res.status(404).json({ error: "Post not found" });
  }

  const post = description ? await updatePost(req.params.post_id, description) : existingPost;

  return res.json(post);
});

app.delete("/api/posts/:post_id", async (req, res) => {
  const deleted = await deletePost(req.params.post_id);

  if (!deleted) {
    return res.status(404).json({ error: "Post not found" });
  }

  return res.status(204).send();
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found", path: req.path });
});

function recordHttpMetrics(req, res, next) {
  const endTimer = httpRequestDurationSeconds.startTimer();

  res.on("finish", () => {
    const labels = {
      method: req.method,
      route: getRouteLabel(req),
      status_code: String(res.statusCode)
    };

    httpRequestsTotal.inc(labels);
    endTimer(labels);
  });

  next();
}

function getRouteLabel(req) {
  return req.route?.path || normalizeRoutePath(req.path);
}

function normalizeRoutePath(path) {
  if (path.startsWith("/api/posts/") && path !== "/api/posts/") {
    return "/api/posts/:post_id";
  }

  return path || "unknown";
}

function normalizeDescription(description) {
  return typeof description === "string" ? description.trim() : "";
}
