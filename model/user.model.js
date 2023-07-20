import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import  bunch  from "./bunch.model.js";
 

// Define the User schema
const UserSchema = new mongoose.Schema({
  UserName: {
    type: "String",
    required: [true, "please Enter UserName"],
    unique: [true, "UserName in Use"],
  },
  email: {
    type: "String",
    required: [true, "please Enter Email"],
    unique: [true, "Email in Use"],
  },
  password: {
    type: "String",
    required: [true, "please Enter Password"],
  },
  quotes: {
    type: [String],
  },
  bunches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bunch",
  }],
  followers:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:"UserSchema"  
    }
  ],
  following:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:"UserSchema"  
  }]
  
});

 










// Define a pre-save hook to hash the password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(this.password, salt);
    this.password = hashPassword;
    next();
  } catch (e) {
    console.log("Failed to hash!");
  }
});

// Export the User model
export default mongoose.model("user", UserSchema);
