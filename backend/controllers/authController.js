const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


/* REGISTER USER */
exports.registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {

            return res.status(400).json({
                message: "All fields required"
            });

        }

        const userExists =
            await User.findOne({ email });

        if (userExists) {

            return res.status(400).json({
                message: "User already exists"
            });

        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user = await User.create({

            name,
            email,
            password: hashedPassword

        });


        const token = jwt.sign(

            { id: user._id },

            process.env.JWT_SECRET,

            { expiresIn: "7d" }

        );


        res.status(201).json({

            message: "Registration Successful",

            token,

            user

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};




/* LOGIN USER */
exports.loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;


        /* Check user exists */
        const user =
            await User.findOne({ email });

        if (!user) {

            return res.status(400).json({
                message: "Invalid Credentials"
            });

        }


        /* Compare password */
        const match =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!match) {

            return res.status(400).json({
                message: "Invalid Credentials"
            });

        }


        /* Generate token */
        const token = jwt.sign(

            { id: user._id },

            process.env.JWT_SECRET,

            { expiresIn: "7d" }

        );


        /* Response */
        res.status(200).json({

            message: "Login Successful",

            token,

            user

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};