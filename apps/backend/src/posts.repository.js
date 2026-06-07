import { getDatabase } from "./database.js";

const seedPosts = [
  {
    post_id: 1,
    description: "Create the backend API"
  },
  {
    post_id: 2,
    description: "Connect the React frontend"
  }
];

let nextPostId = 3;
const memoryPosts = seedPosts.map((post) => ({ ...post }));

export async function listPosts() {
  const collection = getPostsCollection();

  if (!collection) {
    return memoryPosts;
  }

  await ensureSeedPosts(collection);
  return collection.find({}, { projection: { _id: 0 } }).sort({ post_id: 1 }).toArray();
}

export async function getPost(postId) {
  const normalizedPostId = Number(postId);
  const collection = getPostsCollection();

  if (!collection) {
    return memoryPosts.find((post) => post.post_id === normalizedPostId) || null;
  }

  await ensureSeedPosts(collection);
  return collection.findOne({ post_id: normalizedPostId }, { projection: { _id: 0 } });
}

export async function createPost(description) {
  const collection = getPostsCollection();

  if (!collection) {
    const post = {
      post_id: nextPostId,
      description
    };

    nextPostId += 1;
    memoryPosts.push(post);
    return post;
  }

  await ensureSeedPosts(collection);
  const lastPost = await collection.findOne({}, { sort: { post_id: -1 } });
  const post = {
    post_id: (lastPost?.post_id || 0) + 1,
    description
  };

  await collection.insertOne(post);
  return post;
}

export async function updatePost(postId, description) {
  const normalizedPostId = Number(postId);
  const collection = getPostsCollection();

  if (!collection) {
    const post = memoryPosts.find((item) => item.post_id === normalizedPostId);

    if (!post) {
      return null;
    }

    post.description = description;
    return post;
  }

  await ensureSeedPosts(collection);
  const result = await collection.findOneAndUpdate(
    { post_id: normalizedPostId },
    { $set: { description } },
    { returnDocument: "after", projection: { _id: 0 } }
  );

  return result || null;
}

export async function deletePost(postId) {
  const normalizedPostId = Number(postId);
  const collection = getPostsCollection();

  if (!collection) {
    const postIndex = memoryPosts.findIndex((post) => post.post_id === normalizedPostId);

    if (postIndex === -1) {
      return false;
    }

    memoryPosts.splice(postIndex, 1);
    return true;
  }

  await ensureSeedPosts(collection);
  const result = await collection.deleteOne({ post_id: normalizedPostId });
  return result.deletedCount === 1;
}

function getPostsCollection() {
  return getDatabase()?.collection("posts") || null;
}

async function ensureSeedPosts(collection) {
  const existingCount = await collection.estimatedDocumentCount();

  if (existingCount === 0) {
    await collection.insertMany(seedPosts);
  }

  await collection.createIndex({ post_id: 1 }, { unique: true });
}
