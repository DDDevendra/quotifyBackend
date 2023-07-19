import user from "../model/user.model.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import OTPgenerator from "otp-generator"
import nodemailer  from 'nodemailer';
import multer from 'multer'
import bunch  from "../model/bunch.model.js";




//  signup 

export async function Signup(req, res){

  try {

    const { UserName, email, password } = req.body;

    const user1 = await user.findOne({ UserName:UserName });
    const user2 = await user.findOne({ email:email });

    if (user1) {
    return res.status(400).send({ error: "UserName in Use " });
    }

    if (user2) {
    return res.status(400).send({ error: "Email in Use " });
    }

    const data = new user({UserName,email,password});

    data.save().then(()=>{

      return   res.status(200).send({msg:"User Saved Sucessfully "});

    }).catch((error)=>{
        return     res.status(501).send({error:"Failed to save User "+ error});
    })

  }catch (error) {
   return  res.status(501).send({ error: "Failed To signup  here" + error });
  }
}

//  login 

export async function Login(req,res){

    try{

        const { UserName , password } = req.body;

        const data = await user.findOne({UserName});


        if(!data)
        {
            return res.status(400).send({error:"user Not Found !"});
        }

        bcrypt.compare(password,data.password,(err, isMatch)=>{

            if(err){
                return res.status(501).send({error:"unable to match password "});
            }

            if(isMatch)
            {
                const token = jwt.sign({email:data.email},"secret123");

                return res.status(201).send({user:token});
            }
            else 
            {
                return res.status(400).send({ error:"Password Don't Match "});
            }

        })

         
        

    }catch(error)
    {
        return res.status(501).send({error:'Failed To Login'+error});
    }
}


//  2 Factor Authentication 

export async function GenerateOTP(req,res,next)
{
    req.app.locals.OTP = OTPgenerator.generate(6,{ lowerCaseAlphabets:false , upperCaseAlphabets:false , specialChars:false});
    req.OTP = req.app.locals.OTP;
  
    next();
}

export async function SendMail(req,res)
{
    try{

        const token = req.headers["x-access-token"];
        const decode = jwt.verify(token,"secret123");
        const email = decode.email; 

        const data = await user.findOne({email});

        if(!data)
        {
            return res.status(400).send({error:"user not found !"});
        }

        const subject = "OTP Verification for Passwrod reset !";
        const message = "Network Z your One Time Password To Reset Password is  "
        const  recipientEmail   =  data.email;

        try{

            const transporter = nodemailer.createTransport({
                // Configure your email provider settings
                service: 'gmail',
                auth: {
                  user: 'networkzlmt@gmail.com',
                  pass: 'hfqiinqtfzgbnydw',
                },
              });

              const mailOptions = {
                from: 'networkzlmt@gmail.com',
                to: recipientEmail,
                subject: subject,
                text: message + req.OTP,
              };

              await transporter.sendMail(mailOptions);
              res.status(201).json({ message: 'Email sent successfully!' });
          

        }catch(error)
        {
            return res.status(501).send({ error : " Failed to send Mail "});
        }


        

    }catch(error)
    {
        return res.status(501).send({ error : " Failed to send mail "});
    }
}

export async function VerifyOTP(req, res) {


    try{
      const  code = req.body.code;
       
      if (parseInt(code) === parseInt(req.app.locals.OTP)) {
        req.app.locals.OTP = null;
        req.app.locals.ResetSession = true;
        return res.status(201).send({ msg: "Verified OTP successfully!" });
      } else {
        return res.status(400).send({ error: "Invalid OTP" });
      }
   }catch(e)
   {
    return res.status(500).send({ error: "Failed t orun API" }); 
   }
}

export async function RestPassword(req, res) {


    if(!req.app.locals.ResetSession){ return res.status(440).send({ error:"Session Expired !"});}
 
   try {

    const token = req.headers["x-access-token"];
    const decode = jwt.verify(token,"secret123");
    const email = decode.email; 

    
     const { password } = req.body;
     const data = await user.findOne({ email });
     
     if (data) {
 
       const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(password, salt);
 
       const doit = await user.findOneAndUpdate({ email },{ password:hashedPassword});
 
 
       req.app.locals.ResetSession=false;

       res.status(201).send({ msg: "Password updated successfully!" });

     } else {
       res.status(500).send({ error: "User not found!" });
     }
   } catch (error) {
     res.status(500).send({ error: "Unable to run API!" });
   }
 }


//   Add Quote 

export async function addQuote(req,res)
{
   try{

        const token = req.headers['x-access-token'];
        const decode = jwt.verify(token,"secret123");
        const email = decode.email;

        const data = await user.findOne({email:email});

        if(!data){
            return res.status(400).send({error:"User Not found !"});
        }


      const quote = req.body.quote;
        
      const doit =  await data.quotes.push(quote);

      data.save().then(()=>{

        return res.status(201).send({ msg :"Quote added Sucessfully "});
      }).catch((e)=>{
        return res.status(500).send({ error: "Failed to save Quote "});
      });

   }catch(error)
   {
     return res.status(500).send({ error: "Failed to save Quote "+error});
   }
}


export async function updateUserName(req,res)
{
    try{
          const token = req.headers['x-access-token'];
          const decode = jwt.verify(token,"secret123");
          const email = decode.email;

          const data = await user.findOne({email:email});

          if(!data)
          {
              return res.status(400).send({error:"Failed to update "});
          }

          const find = await user.findOne({UserName:req.body.UserName});

          if(find)
          {
              return res.status(400).send({error:"UserName In use !"});
          }
    
          data.UserName = req.body.UserName;

          data.save().then(()=>{
            return res.status(201).send({ msg : "UserName updated Successfully"});
          }).catch((e)=>{

            return res.status(500).send({error:"Faild To update "+e});
          })


    }catch(error)
    {
        return res.status(500).send({error:"Faild To update "+error});
    }
}

//  Give UserName to front end 
export async function givedata(req,res)
{
    try{

       const token = req.headers['x-access-token'];
       const decode = await jwt.verify(token,'secret123');
       const email = decode.email;

       const data = await user.findOne({email:email});

       if(!data)
       {
         return res.status(400).send({error:"User Not found !"});
       }

       return res.status(201).send({UserName:data.UserName});

    }catch(error)
    {
      return res.status(500).send({error:"Faild to Load UserName "});
    }
}

export async function givequote(req,res){

    try{

      const token = req.headers['x-access-token'];
      const decode = await jwt.verify(token,'secret123');
      const email = decode.email;

      const data = await user.findOne({email:email});

      if(!data)
      {
        return res.status(400).send({error:"User not found !"});
      }

      if(data.quotes.length!=0)
      {
        return res.status(201).send({quotes:data.quotes});
      }
      else{
        return res.status(200).send({msg:"No Quotes Available"});
      }

    }catch(error)
    {
      return res.status(500).send({ error:"failed to load Quote "+error});
    }
}

// adding bunches to given user 

export async function addbunch(req,res){

    try{

      const token =   req.headers['x-access-token'];
      const decode = await jwt.verify(token,"secret123");
      const email = decode.email;

      const data = await user.findOne({email:email});

      if(!data)
      {
        return res.status(400).send({error:"User not found !"});
      }

      

      const b1 = req.body.bunch;
      const d = new bunch(b1);
      d.save();
     
     
      data.bunches.push(d);
      data.save();

      return res.status(201).send({ msg :"Bunch is saved "});

    }catch(e){
 
      return res.status(500).send({error:"Failed to add bunch "});
    }
}




//  Radome quote selector 

export async function selectuser(req,res,next){


        try{

          const users = await user.aggregate([
            {
              $sample: {
                size: 1,
              },
            },
          ]);
          
        const randomUsers = users.map((user) => user.email);

        req.randome = randomUsers;
        next();
            
        }catch(error){

          return res.status(500).send({msg:"Failed to load users "+error});
        }
}


export async function selectQuotes(req,res){

  try{


    // const quotes_data = [];  
    // const selected_quotes = req.randome.map(async (u)=>{

    //         const data = await user.findOne({email:u});

    //         if (data && data.quotes && data.quotes.length > 0) {
    //           quotes_data.push(data.quotes);
    //         }

    //       })

    const selected_quotes = await Promise.all(req.randome.map(async (u)=>{
      
      const data = await user.findOne({email:u});
            if (data && data.quotes && data.quotes.length > 0) {  
              
              const b = Math.floor((Math.random())*(data.quotes.length-0)-0);
              
              return data.quotes[b];
            }

            

    }))
    const quotes_data = selected_quotes.filter(Boolean);
   
          return res.status(201).send({data:quotes_data});
      
  }catch(error){
      
      return res.status(500).send({error:"Faild to load Quotes "+error});
  }

}

export async function giveToHome(req,res){

    try{

      const users = await user.aggregate([
        {
          $sample: {
            size: 1,
          },
        },
      ]);
      
    const randomUsers = users.map((user) => user.email);   

    const em = randomUsers[0];
 
       try{  
        const data = await user.findOne({email:em});
        const UserName = data.UserName;
        const quote = data.quotes[0];


    res.status(201).send({UserName:UserName,quote:quote});
       }catch(error)
       {
        return res.status(500).send({msg:"Failed "+error});
       }
        
    }catch(error){

      return res.status(500).send({msg:"Failed to load users "+error});
    }
}

export async function sendUserData(req,res){

  try{


    const token =   req.headers['x-access-token'];
    const decode = await jwt.verify(token,"secret123");
    const email = decode.email;

    const data = await user.findOne({email:email});

    if(!data)
    {
      return res.status(400).send({error:"User not found !"});
    }

    return res.status(201).send({UserName:data.UserName,quotes:data.quotes});


  }catch(error)
  {
    return res.status(500).send({error:"User not found !2"});
  }
}