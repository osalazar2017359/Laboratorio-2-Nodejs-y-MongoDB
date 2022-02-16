// IMPORTAR
const express = require('express');
const cors = require('cors');
var app = express();


const AlumnosRutas = require('./src/routes/alumno.routes')

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(cors());

app.use('/api', AlumnosRutas);


module.exports = app;
