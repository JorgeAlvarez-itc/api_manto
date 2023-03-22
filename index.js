const express = require('express')
const connection = require('./conecction');
const routes = require('./routes/departamento_routes');
const routes1 = require('./routes/maquina_routes');
const routes2 = require('./routes/usuario_routes');
const routes3 = require('./routes/manto_routes');
const routes4= require('./routes/utilities_routes');


const cors = require('cors');

const app = express()

const port = 8001

app.use(express.json());
app.use(cors());

//En esta seccion se agregan las rutas para cada modelo
app.use('/api/v1', routes);
app.use('/api/v1', routes1);
app.use('/api/v1', routes2);
app.use('/api/v1', routes3);
app.use('/api/v1', routes4);


app.get('/', (req, res) => res.send('Starting API MANTENIMIENTO ITCELAYA'))
app.listen(port, () => console.log(`START API ON PORT:${port}!`))