import { userData } from "./dummyData/data"
import { supabase } from "./lib/supabase"
import bcrypt from "bcrypt"

//setting your saltrounds
const saltRounds = 10

//async function that lets you seed the table
const seedTable = async () => {
    try {
        //Loop to the dummy data to get the datas then bcrypt the password then inserted into database
        for(const {email,password} of userData) {
            try {
                 await bcrypt.hash(password,saltRounds, async (err,hashedPass) => {
            if(err) {
                console.log("Failed to Hashed")
            }
            

           const {error} = await supabase.from("users").insert({email: email,password:hashedPass})

           if(error) {
                console.error(error, "Failed DataBase Insertion")
           }

           console.log("Successfully Inserted")
             
        })
            } catch (error) {
                console.error("Failed to Seed")
            }
        
        
    }
    } catch(err) {
        console.error(err,"System error")
    }
    

}

seedTable()