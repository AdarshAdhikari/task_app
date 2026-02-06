const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');     

const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
    const{name, email, password} = req.body;

    const hashedpassword = await bcrypt.hash(password, 10);

    const user = new User({
        name,
        email,
        password: hashedpassword
    });

    await user.save();
    res.send("user registered successfully");
});

// Login user
router.post("/login", async (req, res) => {
    const{email, password} = req.body;

    const user = await User.findOne({email});
    if(!user) {
        return res.status(400).send("Invalid credentials");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("inavalid credentials");

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
    res.json({token});
});

//forgot password

router.post("/forgot-password", async (req, res) => {
    const {email, newPassword} = req.body;

    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).send("User not found");
        }

//hash the new password
   
   const hashed = await bcrypt.hash(newPassword, 10);

   user.password = hashed;
   await user.save();

   res.send("Password reset successfully");
} catch (error) {
    res.status(500).send("Error resetting password");
}});

module.exports = router;    

