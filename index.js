const express = require('express')
const connection = require('./conecction');
const routes = require('./routes/departamento_routes');
const routes2 = require('./routes/maquina_routes');
const routes3 = require('./routes/usuario_routes');
/*
const routes = require('./routes/products_routes');
const user_routes = require('./routes/user_routes');
const routes2 = require('./routes/categories_routes');
const order_routes = require('./routes/order_routes');
*/
const cors = require('cors');

const app = express()

const port = 8000

app.use(express.json());
app.use(cors());

//En esta seccion se agregan las rutas para cada modelo
app.use('/api/v1', routes);
app.use('/api/v1', routes2);
app.use('/api/v1', routes3);

app.get('/', (req, res) => res.send('Starting API MANTENIMIENTO ITCELAYA'))
app.listen(port, () => console.log(`START API ON PORT:${port}!`))