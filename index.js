const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
app.use(cors())
app.use(express.json());
const port = 5000 || process.env.PORT



const uri = `mongodb+srv://todolist:N1hff3d0A0Szo9Fz@cluster0.q4ve3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
  try {
    client.connect();

    const todolist = client.db('Tododatabase').collection('Todolist')
    app.get('/watchtodo', async (req, res) => {
      const querry = {}
      const coursor = todolist.find(querry)
      const todo = await coursor.toArray();
      res.send(todo)
    })


    app.post('/postTodo', async (req, res) => {
      let data = req.body
      const result = await todolist.insertOne(data)
      console.log(result)
    })
    
    app.put('/updateColor', async (req, res) => {
      let colors = req.body;
      console.log(colors.color)
      let querry = { id: colors.id }
      const cursor = todolist.findOne(querry)
      // const result = cursor.toArray();
      // console.log(result)
      const option = { upsert: true }
      const updateDoc = {
        $set: {

          color: colors.color,

        }
      }
      const result2 = await todolist.updateOne(querry, updateDoc, option)
      res.send(result2)


    })


    app.put('/updateStatus', async (req, res) => {
      let statusId = req.body.id;
      let value = req.body.value;
      console.log("statusId = ", statusId)
      let querry = { id: statusId }
      const cursor = todolist.find(querry)
      const result = await cursor.toArray();
      console.log(value)
      const option = { upsert: true }
      const updateDoc = {
        $set: { status: value, }
      }
      const result2 = await todolist.updateOne(querry, updateDoc, option)
      res.send(result2)

    })

    app.patch('/allupdatestatus', async (req, res) => {
      const qurry = { status: false };
      const option = { upsert: true }
      const updateDoc = { $set: { status: true } }
      const result = await todolist.updateMany(qurry, updateDoc, option)
      console.log("patch is catch")
      // res.send(result)
    })
    app.delete('/deleteTodo', async (req, res) => {
      const id = req.body.id
      console.log("delete is hited", id)
      const querry = { id: id }
      const result = await todolist.deleteOne(querry)
      console.log(result)
      res.send(result)

    })



  }
  finally { }
}
run().catch(console.dir)
app.get('/', (req, res) => {
  res.send("hello world")
})

app.listen(port, () => {
  console.log('listening port ', port)
})