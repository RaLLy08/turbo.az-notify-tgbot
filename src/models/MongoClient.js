import { MongoClient } from 'mongodb';
// const MongoClient = require('mongodb').MongoClient;

class ConnectClient {
  constructor(dbHost) {
    const client = new MongoClient(process.env.DATABASE_HOST, { useNewUrlParser: true, useUnifiedTopology: true });
    // client.db("userChatsLinks").collection("userSteps").updateOne()
    

    return new Promise((resolve, reject) => {
      client.connect(err => {
        // this.collection = client.db("userChatsLinks").collection("userLinks");
        
        if (err) reject(err);
        else resolve(client);
        // perform actions on the collection object
      
        // collection.insertOne(a).then(e => console.log(e))
        // console.log(  collection.find({}).toArray().then(e => console.log(e)))
  
        // client.close();
        // this.collection.find({ chatId:568563495 }).toArray().then(e => console.log(e))
      });
    })
  };

};

export default ConnectClient;
// module.exports = MongoDb;