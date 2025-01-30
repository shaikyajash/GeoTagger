const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const dotenv = require("dotenv");
const app = express();
const auth = require("./routes/auth");
const pins = require("./routes/pins");

const bodyParser = require("body-parser");
require("./config/passport")(passport);
const cookieParser = require('cookie-parser');
const path = require("path");
const cors = require("cors");
dotenv.config();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));



// MongoDB connection
mongoose.connect(process.env.MONGOOSEURI).then(()=>console.log("MongoDB connected!😎")).catch((err)=>console.error("MongoDB connection error:", err));



//Middleware
app.use(cookieParser());
app.use(passport.initialize())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/auth", auth);
app.use("/pins",pins);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
