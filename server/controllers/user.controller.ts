import bcrypt from 'bcrypt';
import { Request, Response } from "express"
import { supabase } from "../lib/supabase"
import { cookiesOptions, generateToken } from '../middlewares/auth';

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" })
    }

    try {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single()

        if (error || !data) {
            return res.status(401).json({ message: "No user found!" })
        }

        const hashedCheck = await bcrypt.compare(password, data.password)

        if (!hashedCheck) {
            return res.status(401).json({ message: "Wrong password, please try again!" })
        }

        const token = generateToken(data.user_id)

        res.cookie('token', token, cookiesOptions) 

        return res.status(200).json({ message: "Login successfully" })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const logoutUser = (req: Request, res: Response) => {
    res.cookie('token', "", { ...cookiesOptions, maxAge: 1 }) // no need to cast anymore
    return res.status(200).json({ message: "Logged out successfully" })
}

export const me = (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized" })
    }
    return res.status(200).json(req.user)
}