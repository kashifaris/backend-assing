const { User } = require("../model/User");
const crypto= require('crypto')

exports.signUp = async (req, res) => {
  console.log("inside signup",req.body);
  try {
    const salt = crypto.randomBytes(16);

    const userExist = await User.findOne({ uid: req.body.uid });
    if (userExist) {
      return res.status(404).json({message: "email already exist"});
    }
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
    const user = new User({...req.body,password:hashedPassword,salt});
    const doc = await user.save();
    res.status(200).json(doc);

})
} catch (err) {
    res.status(400).json(err);
  }
};


exports.login = async (req, res) => {
    //console.log("inside auth login",req.user);
  res
  .cookie("jwt", req.user, {
    expires: new Date(Date.now() + 600000),
    httpOnly: true,
  })
  .status(201)
  .json(req.user);
};



