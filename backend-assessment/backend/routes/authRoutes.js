const User = require("../models/user");
const express = require("express");
const jwt = require("jsonwebtoken");
const Bcrypt = require("bcryptjs");

const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
        const [ name, email, password ] = req.body;

        if (!name || !email || !password){
            return res.status(400).json({ 
                message: "name, email and password are required!"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "password must be at least 8 characters." });
        }

        const Email = email.trim().toLowerCase();
        const registeredEmail = await User.findOne({ email: Email });

        if (registeredEmail) {
            return res.status(400).json({ 
                message: "Email is already registered!"
            });
        }

        const hashedPassword = await Bcrypt.hash(password, 10);

        const user = await User.create({
            name: name.trim(),
            email: Email,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "email and password are required!"});
        }

        const Email = await email.trim().toLowerCase();
        const user = await User.findOne({ email: Email });
        if (!user) {
            return res.status(404).json({message: "User not found!"});
        }

        const isPasswordCorrect = await Bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({message: "password is incorrect!"});
        }

        const token = jwt.sign({
            id: user._id,
            name: user.name
        }, process.env.JWT_SECRET,
            { expiresIn: "1d" })

        return res.status(200).json({ message: "user logged in successfully.", token });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

module.exports = router;