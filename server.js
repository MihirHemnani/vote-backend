import express, { json } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors';
import UserRoutes from "./routes/users.js";
import PollRoutes from "./routes/polls.js";

const app = express();

dotenv.config();

// middleware => so that data in json from body can be accessed
app.use(express.json())
app.use(cors())

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
})

// connecting to mongoose database
const connectDatabase = async () => {
    try {
        mongoose.set("strictQuery", true)

        mongoose.connect(process.env.MONGO_URI_LOCAL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

    } catch (err) {
        console.error(err);
    }
}

// creating the routes
app.use('/api/user', UserRoutes)
app.use('/api/polls', PollRoutes)

connectDatabase().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`HI I am Server...`);
    });
}).catch((err) => {
    console.error(err);
});

