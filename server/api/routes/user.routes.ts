import express from "express";
import { loginUser, logoutUser, me } from "../controllers/user.controller";
import 'dotenv/config'
import { protect } from "../middlewares/auth";

export const userRoute = express.Router()

userRoute.post("/login",loginUser)
userRoute.get('/me',protect,me)
userRoute.post('/logout',logoutUser)
