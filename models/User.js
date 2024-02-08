import { Schema, model } from "mongoose";
import validator from 'validator'

const UserModel = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    }
}, {
    collection: "users",
})



// User signUp
UserModel.statics.signup = async function (name, email, photo) {
    if (!name || !email || !photo) throw Error("all fields required")
    if (!validator.isEmail(email)) throw Error("invalid email id")

    // checking if email already exist or not
    const user_exist = await this.findOne({ username: name });
    if (user_exist) throw Error("username already used")

    const user = await this.create({ username: name, email, photo: photo })

    return user;
}

// User login 
UserModel.statics.login = async function (name) {
    if (!name) throw Error("Enter username")

    // checking if email exist or not
    const user = await this.findOne({ username: name });
    if (!user) throw Error("User not Registered")

    return user;
}

export default model("Users", UserModel);