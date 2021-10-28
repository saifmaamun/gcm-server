const express = require('express');
require('dotenv').config()
const { MongoClient } = require('mongodb');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

//cors middleware
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ogqtm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        
        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");
        
// get API
        app.get('/services', async(req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })

        // get single data
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service)
        })

        // post API 
        app.post('/services', async (req, res) => {
            const service=req.body
            console.log('hitting the g-spot',service)
            
            const result = await servicesCollection.insertOne(service);
            console.log(result)
            res.send(result)
        })

        // delete API
        app.delete('/services/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result)
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('my server')
})


app.listen(port, () => {
    console.log(`listening to ${process.env.DB_USER} at  port:`, port)
})































// const express = require('express');
// const app = express();
// const port = 5000;
// const { MongoClient } = require('mongodb');
// require('dotenv').config();




// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ogqtm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


// async function run() {
//     try {
//         await client.connect();
//         const database = client.db("carMechanic");
// const servicesCollection = database.collection("services");

// // post API
// app.post('/services', async (req, res) => {
//     const service = {
//         "name": "WHEEL ALIGNMENT",
//         "price": "100",
//         "description": "Lorem ipsum dolor sit amet, consectetu radipisi cing elitBeatae autem aperiam nequ quaera molestias voluptatibus harum ametipsa.",
//         "img": "https://i.ibb.co/tY8dmnP/2.jpg"
//     }
//     const result = await servicesCollection.insertOne(service);
//     console.log(result)
// })
        
//     } 
//     finally {
//         // await client.close();
//     }
// }
// run().catch(console.dir);


// app.get('/', (req, res) => {
//     res.send('running')
// })

// app.listen(port, () => {
//     console.log(`running ${process.env.DB_USER} on port `,port)
// })