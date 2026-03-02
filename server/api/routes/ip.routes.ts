import express from 'express'
import { deleteIPdata, getGeo, getIPdata, saveIP } from '../controllers/ip.controller'

export const ipRoute = express.Router()

ipRoute.post("/saveIP",saveIP)
ipRoute.get("/getIP",getIPdata)
ipRoute.delete("/deleteIP",deleteIPdata)
ipRoute.get("/:ip",getGeo)