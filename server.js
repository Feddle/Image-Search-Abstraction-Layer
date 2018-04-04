
const express = require('express');
const mongo = require('mongodb').MongoClient;
var imageSearch = require('node-google-image-search');

const app = express();
const url = 'mongodb://'+process.env.DB_USER+':'+process.env.DB_PASS+'@'+process.env.DB_HOST+':'+process.env.DB_PORT+'/'+process.env.DB_NAME;

app.use(express.static('public'))


app.get("/", (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})


app.get("/search/:term", (req, res) => { 
  res.set('Content-Type', "application/json");
  const search_term = req.params.term;
  console.log(search_term);
  const offset = req.query.offset ? Number.parseInt(req.query.offset) : 0;
  let arr = [];
  
  imageSearch(search_term, results => {    
    results.forEach(e => {
      let obj = {"url": e.link, "snippet": e.snippet, "thumbnail": e.image.thumbnailLink, "context": e.image.contextLink};
      arr.push(obj);
    });  
    res.send(arr);
  }, offset, 10);
  
  mongo.connect(url, (err, client) => {
    if(err) console.log(err);
    const glitch_db = client.db("glitch");
    const coll = glitch_db.collection("isalLatest");         
    let time = new Date()
    coll.insert({"term": search_term, "time": time.toISOString()}, (err, data) => {
      if(err) console.log(err);
      client.close();
    });
  });
})

app.get("/latest", (req, res) => {
  mongo.connect(url, (err, client) => {
    if(err) console.log(err);
    const glitch_db = client.db("glitch");
    const coll = glitch_db.collection("isalLatest");    
    coll.find({}, {"limit": 10, "projection": {"_id": 0}}, (err, result) => {
       if(err) res.send(err);
      else {
        result.toArray((err,docs) => {
            if(err) console.log(err);
            res.send(docs);
            client.close();
        });               
      }
      client.close();
    });
  });
});


app.get("*", (req, res) => {
  res.status(404).end("Page not found");
})


// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})


