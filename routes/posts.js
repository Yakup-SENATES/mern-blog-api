const router = require("express").Router();
const Post = require("../models/Post");

//Create
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    return res.sendStatus(200).json(savedPost);
  } catch (error) {
    return res.sendStatus(500).json(error);
  }
});

//UPDATE

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        return res.sendStatus(200).json(updatedPost);
      } catch (err) {
        return res.sendStatus(500).json(err);
      }
    } else {
      return res.sendStatus(401).json("You can update only your post!");
    }
  } catch (err) {
    return res.sendStatus(500).json(err);
  }
});

//DELETE

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userName === req.body.userName) {
      try {
        await post.delete();
        return res.sendStatus(200).json("Post has been deleted...");
      } catch (err) {
        return res.sendStatus(500).json(err);
      }
    } else {
      return res.sendStatus(401).json("You can delete only your post!");
    }
  } catch (err) {
    return res.sendStatus(500).json(err);
  }
});
//Get Posts
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.sendStatus(200).json(post);
  } catch (error) {
    return res.sendStatus(500).json(error);
  }
});

//GET ALL POSTS

router.get("/", async (req, res) => {
  const userName = req.query.user;
  const catName = req.query.cat;
  try {
    let posts;
    if (userName) {
      posts = await Post.find({ userName });
    } else if (catName) {
      posts = await Post.find({ categories });
    } else {
      posts = await Post.find();
    }
    return res.sendStatus(200).json(posts);
  } catch (error) {
    return res.sendStatus(500).json(error);
  }
});

module.exports = router;
