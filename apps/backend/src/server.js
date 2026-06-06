import cors from "cors";
import express from "express";

const app = express();
const port = Number(process.env.PORT || 8080);

let nextPostId = 3;
const posts = [
  {
    post_id: 1,
    description: "Create the backend API"
  },
  {
    post_id: 2,
    description: "Connect the React frontend"
  }
];

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "devops-platform-backend"
  });
});

app.get("/api/posts", (_req, res) => {
  res.json(posts);
});

app.get("/api/posts/:post_id", (req, res) => {
  const post = findPost(req.params.post_id);

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  return res.json(post);
});

app.post("/api/posts", (req, res) => {
  const description = normalizeDescription(req.body?.description);

  if (!description) {
    return res.status(400).json({ error: "Post description is required" });
  }

  const post = {
    post_id: nextPostId,
    description
  };

  nextPostId += 1;
  posts.push(post);

  return res.status(201).json(post);
});

app.put("/api/posts/:post_id", (req, res) => {
  const post = findPost(req.params.post_id);

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  const description = normalizeDescription(req.body?.description);

  if (req.body?.description !== undefined && !description) {
    return res.status(400).json({ error: "Post description cannot be empty" });
  }

  if (description) {
    post.description = description;
  }

  return res.json(post);
});

app.delete("/api/posts/:post_id", (req, res) => {
  const postIndex = posts.findIndex((post) => post.post_id === Number(req.params.post_id));

  if (postIndex === -1) {
    return res.status(404).json({ error: "Post not found" });
  }

  posts.splice(postIndex, 1);
  return res.status(204).send();
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found", path: req.path });
});

app.listen(port, () => {
  console.log(`Backend API listening on port ${port}`);
});

function findPost(postId) {
  return posts.find((post) => post.post_id === Number(postId));
}

function normalizeDescription(description) {
  return typeof description === "string" ? description.trim() : "";
}
