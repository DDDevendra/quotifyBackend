import mongoose, { connect } from "mongoose";

async function Connect()
{
    
        const db_url = 'mongodb://127.0.0.1:27017/A02'
    mongoose.connect(db_url).then(()=>{
            console.log("DataBase is connected !");     
           
    }).catch((error)=>{
         console.log(error);
    })
}

export default Connect;