import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import Connect from "./connection.js";
import user from './model/user.model.js'
import bunch from "./model/bunch.model.js"
import { Router } from "express";
import router from "./Router/Routes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));


const PORT = process.env.PORT || 9002;



app.get("/", (req, res) => {
  res.status(201).send({ msg: "Servre Connected !" });
}); 


app.use('/api',router);


Connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log("server is connected !");
    });
  })
  .catch((error) => {
    console.log("Failed to connect server !");
    console.log(error);
  });

