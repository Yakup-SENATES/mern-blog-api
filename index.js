const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoot = require("./routes/users");
const postRoot = require("./routes/posts");
const categoryRoot = require("./routes/categories");
const multer = require("multer");

dotenv.config();

app.use(express.json());
mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log("connected to mongoDB"))
  .catch((err) => console.log(err));

//images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({
  storage: storage,
});

app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json({ message: "Image uploaded successfully" });
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoot);
app.use("/api/posts", postRoot);
app.use("/api/categories", categoryRoot);

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
