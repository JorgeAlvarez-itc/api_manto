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

//Ruta para levantar una orden de mantenimiento :c
router2.post('/manto/orden', async (req, res) => {
  const client = pool;
  try {
    await client.query('BEGIN');

    // Obtener la máquina sin asignar y asignarle el id_usuario del req
    const query1 = 'UPDATE maquina SET id_usuario = $1 WHERE id_maquina = (SELECT id_maquina FROM maquina WHERE id_usuario IS NULL LIMIT 1) RETURNING id_maquina';
    const values1 = [req.body.id_usuario];
    const result1 = await client.query(query1, values1);
    const id_maquina = result1.rows[0].id_maquina;

    // Hacer un update a la maquina que actualmente permite al usuario y asignarle el id_maquina de la máquina sin asignar
    const query2 = 'UPDATE maquina SET id_usuario = NULL WHERE id_usuario = $1 RETURNING id_usuario';
    const values2 = [req.body.id_usuario];
    const result2 = await client.query(query2, values2);
    const id_usuario = result2.rows[0].id_usuario;

    // Hacer una insersión en la tabla mantenimiento
    const query3 = 'INSERT INTO mantenimiento (descripcion, id_tipo, id_maquina, piezas, materiales, fecha_mant, id_responsable) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id_mantenimiento';
    const values3 = [req.body.descripcion, req.body.id_tipo, req.body.id_maquina, req.body.piezas, req.body.materiales, req.body.fecha_mant, req.body.id_responsable];
    const result3 = await client.query(query3, values3);
    const id_mantenimiento = result3.rows[0].id_mantenimiento;

    await client.query('COMMIT');

    res.status(200).json({
      success: true,
      message: 'Orden de mantenimiento levantada correctamente.',
      id_mantenimiento: id_mantenimiento
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error al levantar la orden de mantenimiento.',
      error: err
    });
  } finally {
    client.release();
  }
});

module.exports = router2;