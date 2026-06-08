import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { app } from "../src/app.js";

test("health returns backend and database status", async () => {
  const response = await request(app).get("/health").expect(200);

  assert.equal(response.body.status, "ok");
  assert.equal(response.body.service, "devops-platform-backend");
  assert.equal(response.body.database.status, "disabled");
});

test("ready succeeds when MongoDB is disabled", async () => {
  const response = await request(app).get("/ready").expect(200);

  assert.equal(response.body.status, "ready");
  assert.equal(response.body.database.required, false);
});

test("posts CRUD works with in-memory fallback", async () => {
  const listResponse = await request(app).get("/api/posts").expect(200);
  assert.ok(Array.isArray(listResponse.body));
  assert.ok(listResponse.body.length >= 2);

  const createResponse = await request(app)
    .post("/api/posts")
    .send({ description: "Test MongoDB fallback" })
    .expect(201);

  const postId = createResponse.body.post_id;
  assert.equal(createResponse.body.description, "Test MongoDB fallback");

  const getResponse = await request(app).get(`/api/posts/${postId}`).expect(200);
  assert.equal(getResponse.body.post_id, postId);

  const updateResponse = await request(app)
    .put(`/api/posts/${postId}`)
    .send({ description: "Updated MongoDB fallback" })
    .expect(200);

  assert.equal(updateResponse.body.description, "Updated MongoDB fallback");

  await request(app).delete(`/api/posts/${postId}`).expect(204);
  await request(app).get(`/api/posts/${postId}`).expect(404);
});

test("creating a post requires a description", async () => {
  const response = await request(app)
    .post("/api/posts")
    .send({ description: "   " })
    .expect(400);

  assert.equal(response.body.error, "Post description is required");
});
