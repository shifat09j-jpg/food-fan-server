const express = require('express')
const cors = require("cors")

 const { ObjectId } = require("mongodb");

const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = 3000

app.use(cors())
app.use(express.json())

const uri = "mongodb+srv://food-db:KCaxcgdzOxQepxVD@cluster9.jsim6tq.mongodb.net/?appName=Cluster9";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
  
    await client.connect();
    const db = client.db("food-db");
    const foodCollection = db.collection("foods")

    app.get('/foods', async(req,res)=>{
        const result = await foodCollection.find().toArray()
       res.send(result)
    })

    app.post('/foods', async(req,res)=>{
        const data = req.body
        console.log(data)
        const result = await foodCollection.insertOne(data)
        res.send({
            success: true,
            result
        })
    })

    // app.get('/foods/:id', async(req,res) =>{
    //     const {id} = req.params
    //     // console.log(id)
    //     const objectId = new ObjectId (id)
    //     const result = await foodCollection.findOne({_id: id})
    //     res.send({
    //         success:true,
    //         result
    //     })
    // })


   




app.get("/foods/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // MongoDB ObjectId ধরে query
    const food = await foodCollection.findOne({ _id: new ObjectId(id) });

    res.send({
      success: true,
      result: food , // যদি না পাওয়া যায় null
    });
  } catch (err) {
    // কোনো invalid id বা error হলে
    res.send({ success: false, message: "Invalid ID or server error" });
  }
});


    app.get('/my-foods', async (req,res)=>{
        const email = req.query.email
        const result = await foodCollection.find({
reviewer_email: email
}).toArray()
res.send(result)
    })
    




  
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})