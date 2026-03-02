import { Request, Response } from "express"
import { supabase } from '../lib/supabase';

export const saveIP = async (req: Request, res: Response) => {
    const {ip, user_id} = req.body

    try {
        const {error} = await supabase.from("ip_addresses").insert({user_id: user_id, ip: ip})

        if(error) {
            return res.status(400).json({"message": "Error insertion of data"})
        }

       return res.status(200).json({"message": "Insertion Success!"})
        
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export const getIPdata = async (req: Request, res: Response) => {

    const {user_id} = req.query

    try {
        const {data,error} = await supabase.from("ip_addresses").select("ip,id").eq("user_id",user_id)

        if(error) {
            return res.status(400).json({"message": "Error getting data"})
        }

        return res.status(200).json(data)



    } catch (error) {
         return res.status(500).json({message: "Internal Server Error"})
    }
}

export const deleteIPdata = async (req: Request, res: Response) => {
    const {ips} = req.body

    try {
        const {error} = await supabase.from("ip_addresses").delete().in("id",ips)

         if(error) {
            return res.status(400).json({"message": "Error deleting data"})
        }

        return res.status(200).json({"message": "Deletion Success!"})

    } catch (error) {
         return res.status(500).json({message: "Internal Server Error"})
    }
}