const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CursosSchema = Schema({
    nombreCurso: String,
    idMaestro: String
});

module.exports = mongoose.model('cursos', CursosSchema);


