import { Schema, model } from "mongoose";

const pollSchema = new Schema({
    question: String,
    options: [String],
    votes: [{ option: String, userId: String }],
    comments: [{ text: String, userId: String, replies: [{ text: String, userId: String }] }],
    createdby: String
},{
    collection: "polls"
});

export default model('Poll', pollSchema);
