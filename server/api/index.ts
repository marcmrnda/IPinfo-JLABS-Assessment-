import express from 'express'
import 'dotenv/config';
import { userRoute } from '../routes/user.routes';
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import { ipRoute } from '../routes/ip.routes';

const app = express()
const PORT = process.env.PORT || 8000

app.use(express.json())
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}))
app.use(cookieParser())

app.use("/api/auth",userRoute)
app.use("/api/ip",ipRoute)

export default app