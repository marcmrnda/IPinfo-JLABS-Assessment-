import { createClient } from "@supabase/supabase-js";
import "dotenv/config"

const URL= process.env.SUPABASE_URL
const KEY = process.env.SUPABASE_KEY


if(!URL || !KEY)  {
    throw new Error("Invalid Environmental Variables")
}

export const supabase = createClient(
        URL,KEY
)


