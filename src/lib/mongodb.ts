import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

let indexesEnsured = false;

const wrappedPromise = clientPromise.then(async (c) => {
  if (!indexesEnsured) {
    indexesEnsured = true;
    const db = c.db();
    await Promise.all([
      db.collection("users").createIndex({ discordId: 1 }, { unique: true }).catch(() => {}),
      db.collection("users").createIndex({ referralCode: 1 }, { sparse: true }).catch(() => {}),
      db.collection("users").createIndex({ referredBy: 1 }, { sparse: true }).catch(() => {}),
      db.collection("pending_payments").createIndex({ orderId: 1 }, { unique: true }).catch(() => {}),
      db.collection("pending_payments").createIndex({ status: 1, createdAt: 1 }).catch(() => {}),
    ]);
  }
  return c;
});

export default wrappedPromise;