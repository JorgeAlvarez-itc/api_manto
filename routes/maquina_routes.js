const express = require("express");
const cors = require("cors");
const pool = require("../conecction");

const router1 = express.Router();

//Ruta para obtener un listado de todas las maquinas.
router1.get("/maquina", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM maquina");
    res.send(rows);
  } catch (error) {
    console.log(error);
  }
});

//Ruta para obtener la informacion de una sola maquina.
router1.get("/maquina/:id", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM maquina where id_maquina=$1",
      [parseInt(req.params.id)]
    );
    res.send(rows);
  } catch (error) {
    console.log(error);
  }
});

//Ruta para obtener las maquinas de cierto departamento
router1.get("/maquina/depto/:id", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM maquina where id_departamento=$1",
      [parseInt(req.params.id)]
    );
    res.send(rows);
  } catch (error) {
    console.log(error);
  }
});

//Ruta para crear una maquina
router1.post("/maquina", async (req, res) => {
  try {
    const maquinas = req.body;
    // Iterar sobre el arreglo de objetos que contiene las máquinas
    for (const maquina of maquinas) {
      const no_serie = maquina.no_serie;
      const modelo = maquina.modelo;
      const marca = maquina.marca;
      const id_usuario = maquina.id_usuario;
      const id_departamento = maquina.id_departamento;
      const fecha_anual = maquina.fecha_anual;
      // Hacer una inserción en la tabla 'maquina'
      const queryText =
        "INSERT INTO maquina (no_serie, modelo, marca, id_usuario, id_departamento, fecha_anual) VALUES ($1, $2, $3, $4, $5, $6)";
      const values = [no_serie,modelo,marca,id_usuario,id_departamento,fecha_anual];
      await pool.query(queryText, values);
    }
    res.send("Inserción exitosa");
    res.status(200).send('Se ha completado con exito');
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al insertar las máquinas");
  }
});

//Ruta para modificar una maquina
router1.put('/maquina/:id',async(req,res)=>{
    try {
        const id_maquina = req.params.id;
        const no_serie = req.body.no_serie;
        const modelo = req.body.modelo;
        const marca = req.body.marca;
        const id_usuario = req.body.id_usuario;
        const id_departamento = req.body.id_departamento;
        const fecha_anual = req.body.fecha_anual;
    
        // Actualizar la fila correspondiente en la tabla 'maquina'
        const queryText = 'UPDATE maquina SET no_serie = $1, modelo = $2, marca = $3, id_usuario = $4, id_departamento = $5, fecha_anual = $6 WHERE id_maquina = $7';
        const values = [no_serie, modelo, marca, id_usuario, id_departamento, fecha_anual, id_maquina];
        await pool.query(queryText, values);
    
        // Imprimir el resultado de la actualización
        res.send("Modificacion exitosa");
        res.status(200).send('Se ha completado con exito');
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al modificar las máquinas");
    }
    
});

//Ruta para eliminar una maquina
router1.delete('/maquina/:id',async(req,res)=>{
    try {
        const query='DELETE FROM maquina where id_maquina=$1';
        await pool.query(query,req.params.id);
        res.send('Eliminado con exito');
        res.status(200);
    } catch (error) {
        res.status(500);
    }
});

module.exports = router1;
