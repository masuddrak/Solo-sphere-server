const express = require('express');
const cors = require('cors');
require("dotenv").config()
const jwt = require('jsonwebtoken');

const cookieParser = require('cookie-parser')
const port = process.env.PORT || 5000
const app = express()

// midleware
const corsoption = {
    origin: ["http://localhost:5173"],
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsoption))
app.use(express.json())
app.use(cookieParser())
// mongodb
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kaocfbi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        // Send a ping to confirm a successful connection
        const jobsCollection = client.db("soloSphere").collection("jobs")
        const bidsCollection = client.db("soloSphere").collection("bids")
        // create jwt token
        app.get("/jwt",async(req,res)=>{
            
        })
        // add job
        app.post("/job", async (req, res) => {
            const job = req.body
            console.log(job)
            const result = await jobsCollection.insertOne(job)
            res.send(result)
        })

        //find all jobs
        app.get("/jobs", async (req, res) => {
            const result = await jobsCollection.find().toArray()
            res.send(result)
        })
        // find one job
        app.get("/job/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await jobsCollection.findOne(query)
            res.send(result)
        })
        // find buyer jobs
        app.get("/mypostedjobs/:email", async (req, res) => {
            const email = req.params.email
            const query = { "buyer.email": email }
            const result = await jobsCollection.find(query).toArray()
            res.send(result)
        })
        // delete job
        app.delete("/deletejob/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await jobsCollection.deleteOne(query)
            res.send(result)
        })
        // upadte job
        app.put("/updatejob/:id", async (req, res) => {
            const id = req.params.id
            const jobs = req.body
            const query = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    ...jobs
                },
            };
            const result = await jobsCollection.updateOne(query, updateDoc, options)
            res.send(result)
        })
        // ----------------bids collection data
        app.post("/bid", async (req, res) => {
            const bidData = req.body
            const result = await bidsCollection.insertOne(bidData)
            res.send(result)
        })
        // my bids
        app.get("/mybids/:email", async (req, res) => {
            const email = req.params.email
            const query = { email }
            const result = await bidsCollection.find(query).toArray()
            res.send(result)
        })
        // 
        // my bid requests
        app.get("/mybidrequest/:email", async (req, res) => {
            const email = req.params.email
            const query = { "buyer.email": email }
            const result = await bidsCollection.find(query).toArray()
            res.send(result)
        })
        // 
        // update bid requests
        app.patch("/updatestatus/:id", async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const status = req.body
            const udpadeDoc = {
                $set: status
            }
            const result = await bidsCollection.updateOne(filter, udpadeDoc)
            res.send(result)
        })
        // 
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
    res.send("helo solosphere")
})


app.listen(port, () => console.log(`server is running ${port}`))