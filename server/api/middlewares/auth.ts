import jwt from 'jsonwebtoken'
import {Request,Response,NextFunction} from 'express'
import 'dotenv/config'
import { supabase } from '../lib/supabase'

declare global {
    namespace Express {
        interface Request {
            user?: any
        }
    }
}

const secretKey = process.env.JWT_SECRET || ''

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" })
        }

        const decoded = jwt.verify(token, secretKey) as jwt.JwtPayload

        const { data, error } = await supabase
            .from("users")
            .select("user_id,email")
            .eq("user_id", decoded.id)
            .single()

        if (error || !data) {
            return res.status(400).json({ message: "Not authorized, no user found!" })
        }

        const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        const userData = [{
            ...data,
            userIP: userIp
           
        }]

        req.user = userData
        
        next()

    } catch (error) {
        console.error(error)
        res.status(402).json({ message: "Not authorized, token failed" })
    }
}

export const cookiesOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 30 * 24 * 60 * 60 * 1000
}

export const generateToken = (id: string) => {
    return jwt.sign({ id }, secretKey, {
        expiresIn: '30d'
    })
}