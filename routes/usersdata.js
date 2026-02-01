const express = require('express');
const User = require('../models/user');

const router = express.Router();

// Get all users

router.get("/", async (req,res)=>{
    try{

        const users = await User.find().select("-password");
        res.json(users);
    }
    catch(err){
        res.status(500).send("Server error");
    }
});

module.exports = router;