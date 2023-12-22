const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// console.log(process.env.STRIPE_SECRET_KEY)
// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_Pass}@cluster0.htztern.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // create batebase collection

    const todoCollection = client.db("taskManagement").collection("todo");

    app.post("/addTodo", async (req, res) => {
      const newTodo = req.body;
      const result = await todoCollection.insertOne(newTodo);
      res.send(result);
    });

    // get todos by email
    app.get("/todos/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await todoCollection.find(query).toArray();
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send({ message: "Task manageMent app is running" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
