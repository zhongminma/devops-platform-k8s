import { useEffect, useState } from "react";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [description, setDescription] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingDescription, setEditingDescription] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${apiBaseUrl}/api/posts`);
      const data = await readJson(response);
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function createPost(event) {
    event.preventDefault();
    const value = description.trim();

    if (!value) {
      setError("Description is required.");
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: value })
      });
      const post = await readJson(response);
      setPosts((currentPosts) => [...currentPosts, post]);
      setDescription("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  function startEditing(post) {
    setEditingPostId(post.post_id);
    setEditingDescription(post.description);
  }

  function cancelEditing() {
    setEditingPostId(null);
    setEditingDescription("");
  }

  async function updatePost(postId) {
    const value = editingDescription.trim();

    if (!value) {
      setError("Description cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: value })
      });
      const updatedPost = await readJson(response);
      setPosts((currentPosts) =>
        currentPosts.map((post) => (post.post_id === postId ? updatedPost : post))
      );
      cancelEditing();
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function deletePost(postId) {
    try {
      const response = await fetch(`${apiBaseUrl}/api/posts/${postId}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        await readJson(response);
      }

      setPosts((currentPosts) => currentPosts.filter((post) => post.post_id !== postId));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">React + Node.js sample app</p>
        <h1>Posts Dashboard</h1>
        <p className="lede">
          A small frontend that calls the Node.js backend CRUD API at <code>/api/posts</code>.
        </p>
      </section>

      <section className="panel">
        <form className="post-form" onSubmit={createPost}>
          <label htmlFor="description">New post description</label>
          <div className="form-row">
            <input
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Write a short post description"
            />
            <button type="submit">Add Post</button>
          </div>
        </form>

        {error ? <p className="error">{error}</p> : null}

        <div className="posts-header">
          <h2>Posts</h2>
          <button className="secondary" type="button" onClick={loadPosts}>Refresh</button>
        </div>

        {isLoading ? <p className="muted">Loading posts...</p> : null}

        {!isLoading && posts.length === 0 ? <p className="muted">No posts yet.</p> : null}

        <ul className="post-list">
          {posts.map((post) => (
            <li className="post-item" key={post.post_id}>
              <span className="post-id">#{post.post_id}</span>
              {editingPostId === post.post_id ? (
                <div className="edit-row">
                  <input
                    value={editingDescription}
                    onChange={(event) => setEditingDescription(event.target.value)}
                  />
                  <button type="button" onClick={() => updatePost(post.post_id)}>Save</button>
                  <button className="secondary" type="button" onClick={cancelEditing}>Cancel</button>
                </div>
              ) : (
                <>
                  <p>{post.description}</p>
                  <div className="actions">
                    <button className="secondary" type="button" onClick={() => startEditing(post)}>
                      Edit
                    </button>
                    <button className="danger" type="button" onClick={() => deletePost(post.post_id)}>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

async function readJson(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
}
