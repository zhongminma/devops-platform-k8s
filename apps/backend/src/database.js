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
    required: isDatabaseRequired(),
    database: mongodbUri ? mongodbDatabase : null
  };
}

export function isDatabaseRequired() {
  return Boolean(mongodbUri);
}

export async function pingDatabase() {
  if (!mongodbUri) {
    return {
      ok: true,
      status: "disabled",
      required: false
    };
  }

  if (!database) {
    return {
      ok: false,
      status: connectionStatus,
      required: true
    };
  }

  try {
    await database.command({ ping: 1 });
    connectionStatus = "connected";
    return {
      ok: true,
      status: connectionStatus,
      required: true
    };
  } catch (error) {
    connectionStatus = "error";
    return {
      ok: false,
      status: connectionStatus,
      required: true,
      error: error.message
    };
  }
}

export async function closeDatabaseConnection() {
  if (client) {
    await client.close();
    connectionStatus = "closed";
  }
}
