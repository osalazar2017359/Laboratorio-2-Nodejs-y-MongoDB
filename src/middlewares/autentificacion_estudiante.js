
exports.Est = function (req, res, next) {
    if (req.user.rol !== "Estudiante") {
        return res.status(500).send({ message: "Solo para usuarios rol: Estudiante"})
    }
    next()
}
