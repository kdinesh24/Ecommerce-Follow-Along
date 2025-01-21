const User = require("../models/user.model")

const signup = async (req, res) => {
    try {
        const { name, email, password, dob } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).send("User already exists");
        }
        const newUser = new User({
            email,
            password,
            name,
            dob
        });
        await newUser.save();
        res.send({data:newUser})
        res.status(201).send("User created successfully");
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = { signup };  // Export as an object