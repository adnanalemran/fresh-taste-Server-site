const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const dotenv = require("dotenv"); // Import dotenv

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fhwdeyh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    const userCollection = client.db("FreshTasteDB").collection("user");
    const foodCollection = client.db("FreshTasteDB").collection("food");
    const foodBuyCollection = client.db("FreshTasteDB").collection("buy");
    //User api
    app.post("/user", async (req, res) => {
      const user = req.body;
      console.log(user);
      try {
        const result = await userCollection.insertOne(user);
        console.log("Inserted document with _id: " + result.insertedId);
        res.status(201).json({ message: "User added successfully" });
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ error: "Failed to insert data into the database" });
      }
    });

    app.get("/user", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });
    // single user
    app.get("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    //food api
    app.post("/food", async (req, res) => {
      const product = req.body;
      try {
        const result = await foodCollection.insertOne(product);
        console.log("Inserted document with _id: " + result.insertedId);
        res.status(201).json({ message: "Product added successfully" });
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ error: "Failed to insert data into the database" });
      }
    });

    app.get("/food", async (req, res) => {
      const result = await foodCollection.find().toArray();
      res.send(result);
    });

    app.get("/food/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await foodCollection.findOne(query);
      res.send(result);
    });
  
    app.get("/filtered-foods", async (req, res) => {
      const { email } = req.query;
      try {
        const filteredFoods = await foodBuyCollection.find({ email }).toArray();
        res.json(filteredFoods);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch and filter data" });
      }
    });
    
    app.get("/filtered-added-foods", async (req, res) => {
      const { email } = req.query; 
      try {
        const filteredFoods = await foodCollection.find({ email }).toArray();
        res.json(filteredFoods);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch and filter data" });
      }
    });

    // buy api
    app.post("/buy", async (req, res) => {
      const product = req.body;
      console.log(product);
      try {
        const result = await foodBuyCollection.insertOne(product);
        console.log("Inserted document with _id: " + result.insertedId);
        res.status(201).json({ message: "Product added successfully" });
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ error: "Failed to insert data into the database" });
      }
    });

    app.get("/buy", async (req, res) => {
      const result = await foodBuyCollection.find().toArray();
      res.send(result);
    });

    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
    //we are no end
  }
}

run().catch(console.dir);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Crud is running...");
});

app.listen(port, () => {
  console.log(`SERVER is Running on port ${port}`);
});
