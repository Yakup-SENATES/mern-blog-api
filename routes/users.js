const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Post = require("../models/Post");

//Update
router.put("/:id", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    return res.sendStatus(401).json({ message: "Not Authorized" });
  } else {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashedPassword;
    }
    try {
      const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      return res.sendStatus(200).json(updateUser);
    } catch (error) {
      return res.sendStatus(500).json(error);
    }
  }
});

//DELETE

router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      try {
        await Post.deleteMany({ userName: user.userName });
        await User.findByIdAndDelete(req.params.id);
        return res.sendStatus(200).json("User has been deleted...");
      } catch (err) {
        return res.sendStatus(500).json(err);
      }
    } catch (err) {
      return res.sendStatus(404).json("User not found!");
    }
  } else {
    return res.sendStatus(401).json("You can delete only your account!");
  }
});

//Get User
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    return res.sendStatus(200).json(others);
  } catch (error) {
    return res.sendStatus(500).json(error);
  }
});

module.exports = router;
