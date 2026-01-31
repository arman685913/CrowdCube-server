const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
    const campaignsCollection = client.db("crowdcubeDB").collection("campaigns");
    const donationCollection = client.db("crowdcubeDB").collection("donated");


    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result)
    })

    app.post('/donated', async (req, res) => {
      const donated = req.body;
      const result = await donationCollection.insertOne(donated);
      res.send(result)
    })

    app.get('/donated', async (req, res) => {
      const result = await donationCollection.find().toArray();
      res.send(result);
    });

    app.patch('/users/:email', async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const updateDoc = {
        $set: {
          name: user.name,
          photo: user.photo
        },
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result)
    })

    app.get('/campaigns', async (req, res) => {
      const result = await campaignsCollection.find().toArray();
      res.send(result);
    });

     app.get('/campaigns/active', async (req, res) => {
      const today = new Date();
      const campaigns = await campaignsCollection
        .find({ date: { $gte: today.toISOString() } })
        .limit(6)
        .toArray();
      res.send(campaigns);
    });

    app.get('/campaigns/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await campaignsCollection.findOne(query);
      res.send(result);
    });

   

    app.put('/campaigns/:id', async (req, res) => {
      const id = req.params.id;
      const updatedCampaign = req.body;
      const filter = { _id: new ObjectId(id) }
      const updateDoc = {
        $set: {
          Campaign: updatedCampaign.Campaign,
          description: updatedCampaign.description,
          type: updatedCampaign.type,
          amount: updatedCampaign.amount,
          date: updatedCampaign.date,
          photo: updatedCampaign.photo
        },
      };
      const result = await campaignsCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.post('/campaigns', async (req, res) => {
      const user = req.body;
      const result = await campaignsCollection.insertOne(user);
      res.send(result)
    })

    app.delete('/campaigns/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await campaignsCollection.deleteOne(query);
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
