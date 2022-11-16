const { MongoClient, ObjectId } = require("mongodb");

const mongoConnectionString =
  process.env.MONGO_CONNECTION_STRING || "mongodb://mongo:27017";
const port = process.env.PORT || 8080;

const mongoDbName = "pellets";
let collection;

async function getCollection() {
  if (!collection) {
    const client = new MongoClient(mongoConnectionString);
    await client.connect();
    const db = client.db(mongoDbName);
    collection = db.collection("documents");
  }
  return collection;
}

class PelletRepo {

  async get() {
    const collection = await getCollection();
    return collection.find().toArray();
  }

  async add(consumption) {
    const collection = await getCollection();
    await collection.insertOne(consumption);
  }

  async remove(id) {
    const collection = await getCollection();
    const result = await collection.deleteOne({ _id: ObjectId(id) });
    console.log(`Removed ${result.deletedCount} consumption(s).`);
  }
}

module.exports = {
  PelletRepo
}