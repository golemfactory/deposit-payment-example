import { MongoClient, Db } from "mongodb";

export async function connectToDatabase() {
  if (!process.env.MONGO_URI) {
    throw new Error("Specify MONGO_URI");
  }

  try {
    const client: MongoClient = new MongoClient(process.env.MONGO_URI);

    await client.connect();

    const db: Db = client.db(process.env.DB_NAME);
  } catch (error) {
    console.error("Error connecting to database", error);
  }

  console.log("Connected to database");
}
