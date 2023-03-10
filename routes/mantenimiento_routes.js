const express = require("express");
const pool = require("../conecction");
const router2 = express.Router();

//Ruta para obtener todos los registros de mantenimiento
router2.get('/manto',async(req,res)=>{
    try {
        const { rows } = await pool.query("SELECT * FROM mantenimiento");
        res.send(rows);
      } catch (error) {
        console.log(error);
    }
});

//Ruta para obtener la informacion de un mantenimiento en especifico
router2.get('/manto/:id',async(req,res)=>{
    try {
        const { rows } = await pool.query(
          "SELECT * FROM mantenimiento where id_mantenimiento=$1",
          [parseInt(req.params.id)]
        );
        res.send(rows);
      } catch (error) {
        console.log(error);
    }
});

module.exports = router2;