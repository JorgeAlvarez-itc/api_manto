const express = require('express');
const cors = require('cors');
const pool= require('../conecction')

const router = express.Router();

//Ruta para obtener todos los departamentos
router.get('/departamento', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM departamento');
        res.send(rows);
    }
    catch (error) {
        console.log(error);
    }
});

//Ruta para obtener un departamento
router.get('/departamento/:id', async(req,res)=>{
    try{
        const {rows} = await pool.query('SELECT * FROM departamento where id_departamento=$1', [parseInt(req.params.id)]);
        res.send(rows);
    }catch(error){
        console.log(error);
    }
});

module.exports = router;