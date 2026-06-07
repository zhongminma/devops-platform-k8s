import { MongoClient } from "mongodb";

const mongodbUri = process.env.MONGODB_URI || "";
const mongodbDatabase = process.env.MONGODB_DATABASE || "devops_platform";

let client;
let database;
let connectionStatus = mongodbUri ? "not_connected" : "disabled";

export async function connectToDatabase() {
  if (!mongodbUri) {
    console.log("MongoDB disabled. Set MONGODB_URI to enable persistence.");
    return null;
  }

  try {
    client = new MongoClient(mongodbUri);
    await client.connect();
    database = client.db(mongodbDatabase);
    connectionStatus = "connected";
    console.log(`MongoDB connected to database ${mongodbDatabase}`);
    return database;
  } catch (error) {
    connectionStatus = "error";
    console.error(`MongoDB connection failed: ${error.message}`);
    return null;
  }
}

export function getDatabase() {
  return database;
}

export function getDatabaseStatus() {
  return {
    status: connectionStatus,
    database: mongodbUri ? mongodbDatabase : null
  };
}

export async function closeDatabaseConnection() {
  if (client) {
    await client.close();
    connectionStatus = "closed";
  }
}
