//Importar ORM Mongoose
import mongoose from "mongoose";

import {config} from "./config.js";

//Conectar a MongoDB
mongoose.connect(config.db.URI);

//Validación DB
const connection = mongoose.connection;

connection.once("open", () => {
    console.log("DB Is Connected");
});

connection.on("disconnected", () => {
    console.log("DB Is Disconnected");
});

connection.on("error", (error) => {
    console.log("Error Found: " + error);
}); 