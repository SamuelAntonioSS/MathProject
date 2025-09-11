//Importar archivo app.js
import app from "./app.js";
import "./database.js";
import {config} from "./config.js";

//Ejecutar el servidor
async function main() {
    app.listen(config.server.PORT);
    console.log("Server on Port: " + config.server.PORT);
}   

//Ejecutar todo
main();