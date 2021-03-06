const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Token = require("../models/Token");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: hashedPass,
    });

    const user = await newUser.save();
    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    //const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
    const url = `http://localhost:3000/users/${user.id}/verify/${token.token}`;
    await sendEmail(user.email, "Verify Email", url);
    res
      .sendStatus(200)
      .send({ message: "An email sent to your mail. Please Verify..." })
      .json(user);
  } catch (err) {
    return res.sendStatus(500).json(err);
  }
});
//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.body.userName });
    !user && res.sendStatus(400).json("Kullanıcı bulunamadı!");

    const validated = await bcrypt.compare(req.body.password, user.password);
    !validated && res.sendStatus(400).json("Kullanıcı adı veya şifre!");

    if (!user.verified) {
      let token = await Token.findOne({ userId: user._id });
      if (!token) {
        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
        const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
        await sendEmail(user.email, "Verify Email", url);
      }
      return res
        .sendStatus(400)
        .send({ message: "An email sent to your mail. Please Verify..." });
    }
    const { password, ...others } = user._doc;
    return res.sendStatus(200).json(others);
  } catch (err) {
    return res.sendStatus(500).json(err);
  }
});

//Token Verification
router.get("/id:/verify/:token", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user)
      return res.sendStatus(400).send({ message: "Kullanıcı bulunamadı!" });

    const token = await token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token)
      return res.sendStatus(400).send({ message: "Token bulunamadı!" });
    await User.updateOne({ _id: user._id }, { verified: true });
    await token.remove();
    return res.sendStatus(200).send({ message: "Email doğrulandı!" });
  } catch (error) {
    return res.sendStatus(500).json(err);
  }
});

module.exports = router;
