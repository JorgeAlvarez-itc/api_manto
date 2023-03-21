const express = require("express");
const cors = require("cors");
const pool = require("../conecction");

const router1 = express.Router();

//Ruta para obtener un listado de todas las maquinas.
router1.get("/maquina", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT maquina.*,nombre,departamento.departameto as depto 
      FROM maquina 
        left join usuario using (id_usuario) 
        join departamento on maquina.id_departamento = departamento.id_departamento
      `);
    res.send(rows);
  } catch (error) {
    console.log(error);
  }
});

//Ruta para obtener la informacion de una sola maquina.
router1.get("/maquina/:id", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT maquina.*, usuario.nombre, usuario.correo 
      FROM maquina 
      LEFT JOIN usuario ON maquina.id_usuario = usuario.id_usuario
      WHERE id_maquina=$1
      `,
      [parseInt(req.params.id)]
    );
    res.send(rows);
  } catch (error) {
    console.log(error);
  }
});

//Ruta para obtener la informacion de una maquina asignada a un usuario
router1.get("/maquina/user/:id", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM maquina join departamento using(id_departamento)
      WHERE id_usuario=$1
      `,
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
    var no_serie, modelo, marca, id_usuario, id_departamento, fecha_anual;
    if (Array.isArray(maquinas)) {
      for (const maquina of maquinas) {
        no_serie = maquina.no_serie;
        modelo = maquina.modelo;
        marca = maquina.marca;
        id_usuario = maquina.id_usuario;
        id_departamento = maquina.id_departamento;
        fecha_anual = maquina.fecha_anual;
      }
    } else {
      no_serie = req.body.no_serie;
      modelo = req.body.modelo;
      marca = req.body.marca;
      id_usuario = req.body.id_usuario;
      id_departamento = req.body.id_departamento;
      fecha_anual = req.body.fecha_anual;
    }
    const queryText =
      "INSERT INTO maquina (no_serie, modelo, marca, id_usuario, id_departamento, fecha_anual) VALUES ($1, $2, $3, $4, $5, $6)";
    const values = [no_serie, modelo, marca, id_usuario, id_departamento, fecha_anual];
    await pool.query(queryText, values);
    res.send("Inserción exitosa");
    res.status(200);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al insertar las máquinas");
  }
});

//Ruta para modificar una maquina
router1.put('/maquina/:id', async (req, res) => {
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
    res.status(200);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al modificar las máquinas");
  }

});

//Ruta para eliminar una maquina
router1.delete('/maquina/:id', async (req, res) => {
  const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const query = 'DELETE FROM maquina WHERE id_maquina = $1';
        await client.query(query, [parseInt(req.params.id)]);
        await client.query('COMMIT');
        res.send('Eliminado con éxito');
        res.status(200);
    } catch (error) {
        await client.query('ROLLBACK');
        console.log(error);
        res.status(500);
    } finally {
        client.release();
    }
});

module.exports = router1;
