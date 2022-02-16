//IMPORTACION
const express = require('express');
const alumnoController = require('../controller/alumno.controller');
const md_autentificacion = require('../middlewares/autentificacion');
const md_autentificacion_mas = require('../middlewares/autentificacion_maestro');
const md_autentificacion_esu = require('../middlewares/autentificacion_estudiante');

//RUTAS
var api = express.Router();

api.post('/registrarse', alumnoController.Registrarse);
api.post('/login', alumnoController.Login);


api.get('/cursos', [md_autentificacion.Auth, md_autentificacion_mas.Mas], alumnoController.ObtenerCursos);
api.post('/crearCurso', [md_autentificacion.Auth, md_autentificacion_mas.Mas], alumnoController.CrearCurso);
api.put('/editarCurso/:idCurso', [md_autentificacion.Auth, md_autentificacion_mas.Mas], alumnoController.EditarCurso);
api.delete('/eliminarCurso/:idCurso', [md_autentificacion.Auth, md_autentificacion_mas.Mas], alumnoController.EliminarCurso);

api.post('/nuevaAsignacion', [md_autentificacion.Auth, md_autentificacion_esu.Est], alumnoController.AsignarEstudiante);
api.get('/misCursos', [md_autentificacion.Auth, md_autentificacion_esu.Est], alumnoController.MisCursos);
api.put('/editarPerfil', [md_autentificacion.Auth, md_autentificacion_esu.Est], alumnoController.EditarPerfil);
api.delete('/eliminarPerfil', [md_autentificacion.Auth, md_autentificacion_esu.Est], alumnoController.EliminarPerfil
);


module.exports = api;
