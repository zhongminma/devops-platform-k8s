import { closeDatabaseConnection, connectToDatabase, getDatabase } from "./database.js";

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

const database = await connectToDatabase();

if (!database) {
  console.error("MongoDB is not connected. Set MONGODB_URI before running the seed script.");
  process.exitCode = 1;
} else {
  const collection = getDatabase().collection("posts");
  await collection.createIndex({ post_id: 1 }, { unique: true });

  for (const post of seedPosts) {
    await collection.updateOne(
      { post_id: post.post_id },
      { $setOnInsert: post },
      { upsert: true }
    );
  }

  console.log(`Seeded ${seedPosts.length} posts into MongoDB.`);
}

await closeDatabaseConnection();
