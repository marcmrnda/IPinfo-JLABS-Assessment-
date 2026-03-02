import express from 'express'
import { deleteIPdata, getIPdata, saveIP } from '../controllers/ip.controller'

export const ipRoute = express.Router()

ipRoute.post("/saveIP",saveIP)
ipRoute.get("/getIP",getIPdata)
ipRoute.delete("/deleteIP",deleteIPdata)