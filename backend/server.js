import dns from "node:dns"

dns.setServers(['8.8.8.8', '4.4.4.4'])
import express from "express";
import cors from 'cors';
import http from "http";
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDb from "./utils/dbConnect.js";
import mainRoute from "./routes/index.routes.js"
import passport from "passport";
import './utils/passport.js'
import { Server } from "socket.io";
import client from "prom-client"

dotenv.config()

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [process.env.FRONTEND_URL],
        methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
        credentials: true,
        allowedHeaders: ["*"]
    }
})
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register })

app.set("io", io);

const PORT = process.env.PORT || 3000


const corsOptions = {
    origin: [`${process.env.FRONTEND_URL}`, `${process.env.BACKEND_URL}`],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
}


app.use(cors(corsOptions))


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());


// Socket configuration
io.on('connection', (socket) => {
    socket.join("notifications");
})

io.on('close', () => {
    console.log("Socket closed ...");
})

// Main Versioned Route
app.use("/api/v1", mainRoute);

connectDb()

// Passport Initialisation
app.use(passport.initialize())


app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Backend is running properly ..."
    })
})

app.get("/metrics", async (req, res) => {
    res.setHeader("Content-Type", client.register.contentType);
    const metrics = await client.register.getMetricsAsJSON();
    res.send(metrics)
})


server.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
})


process.on('SIGINT', () => {
    console.log(`Closing all tasks gracefully and closing the server at PORT : ${PORT}`)
});