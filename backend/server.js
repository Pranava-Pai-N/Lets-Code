import express from "express";
import cors from 'cors';
import http from "http";
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDb from "./utils/dbConnect.js";
import userRoutes from "./routes/user.routes.js";
import questionRoutes from "./routes/questions.routes.js";
import pathRoutes from "./routes/paths.routes.js";
import discussionRoutes from "./routes/discussion.routes.js";
import commentRoutes from "./routes/comments.routes.js";
import passport from "passport";
import './utils/passport.js'
import { Server } from "socket.io";

dotenv.config()

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors :{
        origin : process.env.FRONTEND_URL,
        methods : ["POST","GET","PUT","PATCH","DELETE"]
    }
})
app.set("io",io);

const PORT = process.env.PORT || 3000


const corsOptions = {
    origin : [`${process.env.FRONTEND_URL}`,`${process.env.BACKEND_URL}`],
    credentials : true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    methods : ["GET","POST","PUT","PATCH","DELETE","OPTIONS"]
}


app.use(cors(corsOptions))


app.use(express.json())
app.use(express.urlencoded({ extended : true }))
app.use(cookieParser());


// Socket configuration
io.on('connection' ,(socket) => {
    socket.join("notifications");
})

io.on('close' ,() =>{
    console.log("Socket closed ...");
})



app.use("/api/users",userRoutes);

app.use("/api/questions",questionRoutes);

app.use("/api/paths",pathRoutes);

app.use("/api/discussions",discussionRoutes);

app.use("/api/comments",commentRoutes);

connectDb()

// Passport Initialisation
app.use(passport.initialize())


app.get("/",(req,res) => {
    res.status(200).json({
        success : true,
        message : "Backend is running properly ..."
    })
})


server.listen(PORT,() => {
    console.log(`Server is running at PORT ${PORT}`);
})


process.on('SIGINT', () =>{
    console.log(`Closing all tasks gracefully and closing the server at PORT : ${PORT}`)
});