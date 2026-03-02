import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import 'dotenv/config'
import { supabase } from '../lib/supabase'

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            user?: any
        }
    }
}

// JWT secret from environment
const secretKey = process.env.JWT_SECRET || ''

// Protect middleware
export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get token from cookies
        const token = req.cookies?.token

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" })
        }

        // Verify JWT
        const decoded = jwt.verify(token, secretKey) as jwt.JwtPayload

        // Fetch user from Supabase
        const { data, error } = await supabase
            .from("users")
            .select("user_id,email")
            .eq("user_id", decoded.id)
            .single()

        if (error || !data) {
            return res.status(401).json({ message: "Not authorized, user not found" })
        }

        // Capture user IP
        const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress

        // Attach user info to request
        req.user = [{
            ...data,
            userIP: userIp
        }]

        next()
    } catch (err) {
        console.error(err)
        res.status(401).json({ message: "Not authorized, token invalid or expired" })
    }
}

// Cookie options for JWT
export const cookiesOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Must be true for sameSite: 'none'
    sameSite: 'none' as const,                      // Allow cross-site cookies
    maxAge: 30 * 24 * 60 * 60 * 1000               // 30 days
}

// Function to generate JWT token
export const generateToken = (id: string) => {
    return jwt.sign({ id }, secretKey, {
        expiresIn: '30d'
    })
}