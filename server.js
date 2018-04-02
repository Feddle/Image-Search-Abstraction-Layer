
const express = require('express');
const mongo = require('mongodb').MongoClient;
const crypto = require('crypto');

const app = express();
const url = 'mongodb://'+process.env.DB_USER+':'+process.env.DB_PASS+'@'+process.env.DB_HOST+':'+process.env.DB_PORT+'/'+process.env.DB_NAME;
const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

app.use(express.static('public'))


app.get("/", (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})



app.get("*", (req, res) => {
  res.status(404).end("Page not found");
})


// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})


