const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createUser = async (req, res) => {
    const user = new User(req.body);
    try {
        const existingUser = await User.findOne({ email: user.email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPass = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPass;
        let result = await user.save();
            result.password = undefined;
            
            const token = jwt.sign({ id: result._id }, "MoReda", { expiresIn: '10d' });
            result = {
                ...result._doc,
                token: token
            };

            res.send(result);


    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}   


const userLogIn = async (req, res) => {
    if (req.body.email && req.body.password) {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            const validated = await bcrypt.compare(req.body.password, user.password);
            if (validated) {
                user.password = undefined;

                const token = jwt.sign({ id: user._id }, "MoReda", { expiresIn: '10d' });
                user = {
                    ...user._doc,
                    id: user._id,
                    token: token
                };
                res.send(user);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "User not found" });
        }
    } else {
        res.send({ message: "Email and password are required" });
    }
};

module.exports = {
    createUser,
    userLogIn
}