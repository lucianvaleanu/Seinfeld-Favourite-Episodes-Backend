const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const episodesRouter = require("./routes/episodes.route");
const reviewsRouter = require("./routes/reviews.route");
const usersRouter = require("./routes/users.route");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
  }));

  
app.use("/episodes", episodesRouter);
app.use("/reviews", reviewsRouter);
app.use("/auth", usersRouter);

app.get("/ping", (req, res) => {
    res.status(200).json({ message: "Server is up and running" });
});

app.get("/", (req,res)=>{
    res.sendFile(__dirname + "/views/index.html");
})

app.use((req, res, next)=>{
    res.status(404).json({message:"route not found"});
})

app.use((err, req, res, next)=>{
    res.status(500).json({message:"something broke"});
})



module.exports = app;