const express = require("express");
const router = express.Router();
const User = require("../models/userModels");

router.post("/signup", async (req, res) => {
  try {
    const { name, email, img } = req.body;

    // Log incoming request data
    console.log("Signup request received:", req.body);

    // Validate required fields
    if (!name || !email) {
      console.log("Validation error: Missing name or email");
      return res.status(422).json({ error: "Please fill all the fields" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      console.log("User already exists:", existingUser);
      return res.status(201).json(existingUser);
    }

    // Create new user document
    let newUser;
    if (img) {
      newUser = new User({ name, email, img });
    } else {
      newUser = new User({ name, email });
    }

    // Generate token and save user
    const token = await newUser.genationToken();
    res.cookie("jwtToken", token);

    await newUser.save();
    console.log("User registered:", newUser);
    res.status(201).json(newUser);

  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get('/getUser', async (req, res) => {
  const email = req.query.email; // Retrieve the email from query parameters
  if (!email) {
    return res.status(400).json({ error: 'Email parameter is required' });
  }

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch("/addAdmin", async (req, res) => {
  console.log(req.body);
  const { email, Hotel_code } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email parameter is required' });
  }

  try {
    const user = await User.findOne({ email: email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.admin = "admin";
    user.hcode = Hotel_code;
    await user.save();

    return res.status(201).json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: 'Server error' });
  }
});



router.post("/userPost", (req, res) => {
  res.status(201).json({ response: "all cleare" });
});

router.put("/userPut", (req, res) => {
  res.send("it is put pard");
});

router.delete("/userDelete", (req, res) => {
  res.send("it is delete pard");
});

module.exports = router;
