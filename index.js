const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion } = require('mongodb');

const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DATABASE}:${process.env.PASS}@cluster.mrjcudi.mongodb.net/?appName=Cluster`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {


    const usersCollection = client.db("crowdcubeDB").collection("users");


    app.post('/users' , async (req ,res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result)
    })

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('CROWDCUBE')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
