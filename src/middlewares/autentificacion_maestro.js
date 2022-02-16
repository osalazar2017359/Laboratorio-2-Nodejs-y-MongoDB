
exports.Mas = function (req, res, next) {
    if (req.user.rol !== "Maestro") {
        return res.status(500).send({ message: "Solo para usuarios rol: Maestro"})
    }
    next()
}
