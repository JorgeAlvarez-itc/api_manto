const express = require('express')
const connection = require('./conecction');
const routes = require('./routes/departamento_routes');
/*
const routes = require('./routes/products_routes');
const user_routes = require('./routes/user_routes');
const routes2 = require('./routes/categories_routes');
const order_routes = require('./routes/order_routes');
*/
const cors = require('cors');

const app = express()

const port = 8000
//const port = process.env.port;
//const api_route = process.env.api_route;

app.use(express.json());
app.use(cors());


app.use('/api/v1', routes);

//auth
//app.use(auth_jwt());
/*

app.use('/api/v1', routes2);
app.use('/api/v1', user_routes);
app.use('/api/v1', order_routes);
*/


app.get('/', (req, res) => res.send('Starting API STORE TEDW'))
app.listen(port, () => console.log(`START API ON PORT:${port}!`))