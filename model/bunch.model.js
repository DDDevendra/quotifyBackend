
import mongoose from "mongoose";

export const bunch = new mongoose.Schema({

  
  
        bunch_name:{
            type:"string",
        } ,

        bunch_dis:{
            type:"string"
        },

        bunch_number:{
            type:'string'
        },

    }
)

export default mongoose.model('bunch',bunch);