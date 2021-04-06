const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mnfgc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const foodCollection = client.db("redOnion").collection("foods");
    app.post('/addFood', (req, res) => {
        console.log(req.body)
        foodCollection.insertOne(req.body)
            .then(result => {
                console.log(result)
            })
    });

    app.get('/foods', (req, res) => {
        foodCollection.find()
            .toArray((err, documents) => {
                res.send(documents)
        })
    })
    app.get('/foodDetails/:foodId', (req, res) => {
        console.log(req.params.foodId)
        foodCollection
            .find({ _id: ObjectId(req.params.foodId) })
            .toArray((err, documents) => {
                console.log(documents);
                res.send(documents[0]);
            });
    });

    app.post('/order', (req, res) => {
        console.log(req.body)
    })
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
