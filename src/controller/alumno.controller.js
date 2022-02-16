const Usuarios = require('../models/usuario.model');
const Cursos = require('../models/curso.model');
const Asigs = require('../models/asignacion.model')

const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');


function Registrarse(req, res) {
    var parametros = req.body;
    var alumnoModelo = new Usuarios();

    if (parametros.nombre && parametros.usuario && parametros.password) {

        alumnoModelo.nombre = parametros.nombre;
        alumnoModelo.usuario = parametros.usuario;
        alumnoModelo.rol = "Estudiante";

        Usuarios.find({ usuario: parametros.usuario }, (error, alumnoEncontrado) => {
            if (alumnoEncontrado.length == 0) {

                bcrypt.hash(parametros.password, null, null, (error, passwordEncriptada) => {
                    alumnoModelo.password = passwordEncriptada;

                    alumnoModelo.save((error, alumnoGuardado) => {
                        if (error) return res.status(500).send({ mensaje: "Error de la petición" });
                        if (!alumnoGuardado) return res.status(500).send({ mensaje: "Error, no se agrego ningun alumno" });

                        return res.status(200).send({ usuario: alumnoGuardado, nota: "Alumno agregado exitosamente" });
                    });
                });

            } else {
                return res.status(500).send({ mensaje: "Este Usuario ya se encuentra utilizado" });
            }
        });
    }
}

function Login(req, res) {
    var parametros = req.body;

    Usuarios.findOne({ usuario: parametros.usuario }, (error, alumnoEncontrado) => {
        if (error) return res.status(500).send({ mensaje: "Error en la petición" });
        if (alumnoEncontrado) {

            bcrypt.compare(parametros.password, alumnoEncontrado.password, (error, verificacionPassword) => {// V/F
                //VERIFICO SI EL PASSWORD COINCIDE EN LA BASE DE DATOS
                if (verificacionPassword) {

                    //VERIFICO SI EL PARAMETRO obtenerToken ES TRUE, CREA EL TOKEN
                    if (parametros.obtenerToken === "true") {
                        return res.status(200).send({ token: jwt.crearToken(alumnoEncontrado) })
                    }
                } else {

                    alumnoEncontrado.password = undefined;
                    return res.status(200).send({ usuario: alumnoEncontrado })
                }
            })
        } else {
            return res.status(500).send({ mensaje: "Error, el Usuario no se encuentra registrado" })
        }
    })
}

////////////////////////////////////////////////////////////////
// maestro
////////////////////////////////////////////////////////////////

function crearMaestro(req, res) {
    var alumnoModelo = new Usuarios();

    alumnoModelo.nombre = "MAESTRO";
    alumnoModelo.usuario = "El_Profe";
    alumnoModelo.rol = 'Maestro';

    Usuarios.find({ rol: "Maestro" }, (error, alumnoEncontrado) => {
        if (alumnoEncontrado.length == 0)

            bcrypt.hash("123456", null, null, (error, passwordEncriptada) => {
                alumnoModelo.password = passwordEncriptada;

                alumnoModelo.save((error, alumnoGuardado) => {
                    if (error) return res.status(500).send({ mensaje: "Error de la petición" });
                    if (!alumnoGuardado) return res.status(500).send({ mensaje: "Error, no se agrego ningun alumno" });

                });
            });
    });
}


function ObtenerCursos(req, res) {
    Cursos.find((error, cursosObtenidos) => {

        if (error) return res.send({ mensaje: "error:" + error })

        for (let i = 0; i < cursosObtenidos.length; i++) {
            console.log(cursosObtenidos[i].nombre)
        }

        return res.send({ cursos: cursosObtenidos })

    })
}


//AGREGAR CURSO
function CrearCurso(req, res) {
    var parametros = req.body;
    var cursoModelo = new Cursos();

    if (parametros.nombreCurso) {

        cursoModelo.nombreCurso = parametros.nombreCurso;
        cursoModelo.idMaestro = req.user.sub;

        Cursos.find({ nombreCurso: parametros.nombreCurso }, (error, cursoEncontrado) => {
            if (cursoEncontrado.length == 0) {

                cursoModelo.save((error, cursoGuardado) => {
                    if (error) return res.status(500).send({ mensaje: "Error de la petición" });
                    if (!cursoGuardado) return res.status(500).send({ mensaje: "Error, no se agrego ningun curso nuevo" });

                    return res.status(200).send({ curso: cursoGuardado, nota: "Curso agregado exitosamente" });
                });

            } else {
                return res.status(500).send({ mensaje: "Este curso ya se existe" });
            }

        });
    }
}

//EDITAR CURSO
function EditarCurso(req, res) {
    var idCurs = req.params.idCurso;
    var parametros = req.body;

    Cursos.findByIdAndUpdate(idCurs, parametros, { new: true }, (error, cursoActualizado) => {
        if (error) return res.status(500).send({ mesaje: "Error de la petición" });
        if (!cursoActualizado) return res.status(500).send({ mensaje: "Error al editar el curso " });

        return res.status(200).send({ curso: cursoActualizado, nota: "Curso editado exitosamente" });
    });
}

//ELIMINAR CURSO
function EliminarCurso(req, res) {
    var idCur = req.params.idCurso;

    Cursos.findByIdAndDelete(idCur, (error, cursoEliminado) => {
        if (error) return res.status(500).send({ mensaje: "Error de la petición" });
        if (!cursoEliminado) return res.status(404).send({ mensaje: "Error al eliminar el curso" });

        return res.status(200).send({ curso: cursoEliminado, nota: "Eliminado con exito" });
    })

}


////////////////////////////////////////////////////////////////
// Estudiante
////////////////////////////////////////////////////////////////

function AsignarEstudiante(req, res) {
    var parametros = req.body;
    var asigModelo = new Asigs();

    if (parametros.idCurso) {

        asigModelo.idAlumno = req.user.sub;
        asigModelo.idCurso = parametros.idCurso;

        Asigs.find({ idCurso: asigModelo.idCurso }, (error, asigEncontrado) => {
            if (asigEncontrado.length == 0) {

                Asigs.find({ idAlumno: req.user.sub }, (error, asignacionesEncontradas) => {
                    if (error) return res.send({ mensaje: "error:" + error })

                    console.log(asignacionesEncontradas.length)

                    if (asignacionesEncontradas.length < 3) {
                        asigModelo.save((error, asigGuardado) => {
                            if (error) return res.status(500).send({ mensaje: "Error de la petición" });
                            if (!asigGuardado) return res.status(500).send({ mensaje: "Error, no se asigno a ningun Estudiante" });

                            return res.status(200).send({ asignacion: asigGuardado, nota: "Asignacion realizada exitosamente" });
                        });
                    } else {

                        return res.send({ mensaje: "Solo se pueden asignar 3 Cursos por Estudiante" })
                    }
                });

            } else {
                return res.status(500).send({ mensaje: "Este curso ya esta asignado" });
            }
        });
    }
}

function MisCursos(req, res) {
    var idAlumno = req.user.sub;

    Asigs.find({ idAlumno: idAlumno }, (error, asigObtenidos) => {

        if (error) return res.status(500).send({ mensaje: "Error de la petición" });
        if (!asigObtenidos) return res.status(500).send({ mensaje: "Error, no se encontro ningun curso asignado" });

        return res.send({ "cursos personales asignados": asigObtenidos })
    })
}

function EditarPerfil(req, res) {
    var idPer = req.user.sub;
    var parametros = req.body;

    bcrypt.hash(parametros.password, null, null, (error, passwordEncriptada) => {
        parametros.password = passwordEncriptada;

        Usuarios.findByIdAndUpdate(idPer, parametros, { new: true }, (error, perfilActualizado) => {
            if (error) return res.status(500).send({ mesaje: "Error de la petición" });
            if (!perfilActualizado) return res.status(500).send({ mensaje: "Error al editar el Usuario " });

            return res.status(200).send({ perfil: perfilActualizado, nota: "Usuario editado exitosamente" });
        });
    })
}

function EliminarPerfil(req, res) {
    var idPer = req.user.sub;

    Usuarios.findByIdAndDelete(idPer, (error, usuarioEliminado) => {
        if (error) return res.status(500).send({ mensaje: "Error de la petición" });
        if (!usuarioEliminado) return res.status(404).send({ mensaje: "Error al eliminar el Usuario" });

        return res.status(200).send({ Usuario: usuarioEliminado, nota: "Eliminado con exito" });
    })
}



module.exports = {
    Login,
    Registrarse,

    crearMaestro,
    ObtenerCursos,
    CrearCurso,
    EditarCurso,
    EliminarCurso,

    AsignarEstudiante,
    MisCursos,
    EditarPerfil,
    EliminarPerfil
}
