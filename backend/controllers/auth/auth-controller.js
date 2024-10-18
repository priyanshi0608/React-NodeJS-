const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");

//register

const registerUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    //validate inputs
    if (!userName || !email || !password) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }
    //check for existing user
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    //create new user
    const newUser = new User({ userName, email, password });
    //encrypt password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);
    await newUser.save();

    res.status(200).json({
      success: true,
      message: "User registered successfully",
    });

    //return jsonwebtoken
    // const payload = {
    //   user: {
    //     id: newUser.id,
    //     userName: newUser.userName,
    //     email: newUser.email,
    //   },
    // };
    // jwt.sign(
    //   payload,
    //   process.env.SECRET_KEY,
    //   { expiresIn: 3600000 },
    //   (err, token) => {
    //     if (err) throw err;
    //     res.json({ token });
    //   }
    // );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

//login

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validate inputs
    if (!email || !password) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }
    //check for existing user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    //validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    //return jsonwebtoken
    const payload = {
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
      },
    };
    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      {
        expiresIn: 36,
        // 1 hour
      },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};
//logout

//auth middleware

module.exports = { registerUser };
