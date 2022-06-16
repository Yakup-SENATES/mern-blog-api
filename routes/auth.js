const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
//Register

router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Login

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(404).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    //if (!validPassword) {
    //  return res.status(401).json({ message: "Invalid password" });
    //}  aynı anlama gelen kod !!!

    !validPassword && res.status(401).json({ message: "Invalid password" });

    const { password, ...others } = user._doc;

    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
