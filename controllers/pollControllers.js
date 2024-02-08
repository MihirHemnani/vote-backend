import Poll from '../models/Poll.js'
import jwt from "jsonwebtoken";

export const createPoll = async (req, res) => {
    const { question, options } = req.body;

    const { authorization } = req.headers;
    if (!authorization) res.status(401).json({ err: "authorization required..." });
    const token = authorization.split(' ')[1];
    try {
        const { _id } = jwt.verify(token, process.env.JWT_SECRET);
        
        const newPoll = new Poll({
            question,
            options,
            votes: [],
            comments: [],
            createdby: _id
        });
        if(question != "") {
            const savedPoll = await newPoll.save();
            res.status(201).json({msg: "Poll created"});
        } else {
            res.status(404).json({msg: "All fields required"});
        }
    } catch (error) {
        console.error('Error creating poll:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const getPolls = async (req, res) => {

    try {
        const polls = await Poll.find({});
        // console.log(polls)
        res.status(201).json(polls);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const getSinglePoll = async (req, res) => {

    const { id } = req.params;

    try {
        const poll = await Poll.find({_id: id});
        res.status(201).json(poll);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const votePoll = async (req, res) => {

    const { id } = req.params;
    const { authorization } = req.headers;
    if (!authorization) res.status(401).json({ err: "authorization required..." });
    const token = authorization.split(' ')[1];
    const { selectedOption } = req.body;
    console.log(selectedOption)

    try {
        // _id is user voting a poll
        const { _id } = jwt.verify(token, process.env.JWT_SECRET);
        
        // id is poll id
        const updatedPoll = await Poll.updateOne(
            { "_id": id },
            { $push: { "votes": {option: selectedOption, userId:_id} } } 
        );

        // console.log(updatedPoll)
        if (updatedPoll) {
            res.status(201).json({msg: "Vote Successful"});
        } else {
            res.status(404).json({msg: "Vote Unsuccessful"});
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const userPoll = async (req, res) => {

    const { id } = req.params;

    try {
        // _id is user voting a poll        
        // id is poll id
        const polls = await Poll.find({createdby: id});

        if (polls) {
            res.status(201).json(polls);
        } else {
            res.status(404).json({msg: "Failed To Fetch"});
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
}