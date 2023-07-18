import mongoose, { connect } from "mongoose";

import dotenv from "dotenv";
dotenv.config();
async function Connect()
{
        
    mongoose.connect(process.env.DB_URL).then(()=>{
            console.log("DataBase is connected !");  
           
           
    }).catch((error)=>{
         console.log(error);
    })
}

export default Connect;