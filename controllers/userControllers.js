import jwt from "jsonwebtoken";
import User from "../models/User.js";

const createToken = (_id) => {
    return jwt.sign(
        { _id },
        process.env.JWT_SECRET,
        { expiresIn: '3d' }
    )
}


// sign Up
export const signupUser = async (req, res) => {
    const { username, email, photo } = req.body;
    // console.log(req.body);

    try {

        const user = await User.signup(username, email, photo);
        // why token is required in signUp
        const token = createToken(user._id);
        res.status(200).json({token: token, id: user._id, username: user.username})


    } catch (err) {
        res.status(400).json({ error: err.message })
        console.log(err);
    }
}

// login 
export const loginUser = async (req, res) => {
    const { username } = req.body;
    console.log(username);

    try {

        const login_user = await User.login(username);
        console.log(login_user._id);
        const token = createToken(login_user._id);
        res.status(200).json({token: token, id: login_user._id, username: login_user.username})

    } catch (err) {
        res.status(400).json({ error: err.message })
        console.log(err);
    }
}

export const getUserProfile = async (req, res) => {
    
    const { authorization } = req.headers;
    if (!authorization) res.status(401).json({ err: "authorization required..." });

    // console.log(authorization);
    const token = authorization.split(' ')[1];

    try {
        const { _id } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id })
        res.status(200).json(user)
    } catch (err) {
        res.status(400).json({ error: err.message })
        console.log(err);
    }
}
