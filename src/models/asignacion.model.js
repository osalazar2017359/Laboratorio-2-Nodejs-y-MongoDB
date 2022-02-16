const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AsignacionesSchema = Schema({
    idCurso: String,
    idAlumno: String
});

module.exports = mongoose.model('asignaciones', AsignacionesSchema);


