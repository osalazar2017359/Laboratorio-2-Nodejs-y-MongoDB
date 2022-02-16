const mongoose = require('mongoose');
const app = require('./app');
const alumnoController = require('./src/controller/alumno.controller');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/IN6BM2', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Se encuentra conectado a la base de datos");

    app.listen(4000, function () {

        alumnoController.crearMaestro("", "");
        console.log("MASTER: Nom:MAESTRO Usu:El_Profe Rol:Maestro Pass:******");
        console.log("Hola a todos, esta corriendo en el puerto 4000");
        console.log("---------------------------------------------------")

    })

}).catch(error => console.log(error));