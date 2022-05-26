const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

const videosData = require('./data/exampleresponse.json')

app.listen(port, () => console.log(`Listening on port ${port}`));

// Store and retrieve your videos from here
// If you want, you can copy "exampleresponse.json" into here to have some data to work with
let videos = [...videosData];

// GET "/"
app.get("/", (req, res) => {
  res.json(videos)
});
