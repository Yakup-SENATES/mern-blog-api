const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");
const cors = require("cors");

<<<<<<< HEAD
const cors = require("cors");

app.use(cors());

=======
app.use(cors());
>>>>>>> d1b36782a8f41620abc8ff33bea643d47fd1b679
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
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

app.listen(5000, () => {
  console.log("Backend is running");
});
