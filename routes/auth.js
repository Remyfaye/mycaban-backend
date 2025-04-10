const router = require("express").Router();
const bcrypt = require("bcrypt");

const User = require("../models/User");

// Create a new user
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully!", data: newUser });
  } catch (error) {
    console.error("Insert Error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

//login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    !user && res.status(404).json({ message: "user not found" });

    const validPaswword = await bcrypt.compare(password, user.password);
    !validPaswword && res.status(404).json({ message: "invalid password " });

    res.status(200).json({ message: "login successfull", data: user });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
