const express = require("express");
const app = express();
const { Pool } = require("pg");

const cors = require("cors");

const pool = new Pool({
  user: "tenny",
  host: "localhost",
  database: "cyf_youtube",
  password: "",
  port: 5432,
});

app.use(cors());

app.use(express.json());

function matchYoutubeUrl(url) {
  const regex =
    /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  if (url.match(regex)) {
    return true;
  }
  return false;
}

//get all videos
app.get("/", (req, res) => {
  return pool
    .query("select * from videos")
    .then((result) => res.send(result.rows))
    .catch((error) => {
      console.log("an error just occurred");
      res.status(500).send("a problem occurred");
    });
});

// to create new video
app.post("/", (req, res) => {
  const { title, url, rating } = req.body;
  if (title && matchYoutubeUrl(url))
    return pool
      .query("INSERT INTO videos (title, url, rating) VALUES($1, $2, $3)", [
        title,
        url,
        rating,
      ])
      .then(() => res.send("New video added"))
      .catch((error) => {
        console.error(error);
        res.status(500).json(error);
      });
});

// select a video
app.get("/:id", (req, res) => {
  const videoId = req.params.id;

  return pool
    .query("SELECT * FROM videos WHERE id = $1", [videoId])
    .then((result) => res.send(result.rows))
    .catch((error) => {
      console.log("an error just occurred");
      res.status(500).send("a problem occurred");
    });
});

// delete a video
app.delete("/:id", (req, res) => {
  const videoId = req.params.id;

  return pool
    .query("DELETE FROM videos WHERE id=$1", [videoId])
    .then(() => res.send(`Order ${videoId} deleted`))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});

app.listen(process.env.PORT || 4000, () =>
  console.log(`Listening on port 4000`)
);
