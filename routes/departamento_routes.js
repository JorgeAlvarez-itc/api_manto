const express = require('express');
const cors = require('cors');
const pool= require('../conecction')

const router = express.Router();

router.get('/departamento', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM departamento');
        res.send(rows);
    }
    catch (error) {
        console.log(error);
    }
});

router.get('/departamento/:id', async(req,res)=>{
    try{
        const {rows} = await pool.query('SELECT * FROM departamento where id_departamento=$1', [parseInt(req.params.id)]);
        res.send(rows);
    }catch(error){
        console.log(error);
    }
});


/*
router.post('/departamento/:id', async(req,res)=>{
    try{
        const {rows} = await pool.query('DELETE * FROM departamento where id_departamento='+ObjectId(req.params));
    }
});
*/

module.exports = router;