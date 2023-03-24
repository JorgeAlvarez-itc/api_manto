const express = require("express");
const pool = require("../conecction");

const router2 = express.Router();

//Ruta para obtener todos los registros de mantenimiento
router2.get("/manto", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM mantenimiento");
    res.send(rows);
  } catch (error) {
    console.log(error);
  }
});

router2.get("/manto_view", async (req, res) => {
  try {
    const query = `
    SELECT mantenimiento.*,no_serie,status,tipo,nombre AS responsable
    FROM mantenimiento
        JOIN status_manto USING (id_status)
        JOIN maquina USING (id_maquina)
        JOIN tipo_mant USING (id_tipo)
        JOIN usuario ON id_responsable = usuario.id_usuario
    ORDER BY fecha_mant DESC;
      `;
    const { rows } = await pool.query(query);
    res.send(rows);
  } catch (error) {
    console.log(error);
  }
});

router2.patch("/manto_status", async (req, res) => {
  try {
    pool.query("BEGIN");
    query =
      "UPDATE mantenimiento SET id_status = 2 where id_mantenimiento = $1;";
    result = await pool.query(query, [parseInt(req.body.id)]);
    query =
      "UPDATE maquina SET fecha_anual = now() + interval '1 year' WHERE id_maquina = $1;";
    result = await pool.query(query, [parseInt(req.body.maquina)]);
    pool.query("COMMIT");
    query = `
    SELECT mantenimiento.*,no_serie,status,tipo,nombre AS responsable
    FROM mantenimiento
        JOIN status_manto USING (id_status)
        JOIN maquina USING (id_maquina)
        JOIN tipo_mant USING (id_tipo)
        JOIN usuario ON id_responsable = usuario.id_usuario
    ORDER BY fecha_mant DESC;
      `;
    const { rows } = await pool.query(query);
    res.send(rows);
  } catch (error) {
    pool.query("ROLLBACK");
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error en la actualización del status",
      error: err,
    });
  }
});

router2.patch("/manto_content/", async (req, res) => {
  try {
    if (req.body.type == 'admin') {
      let descripcion = req.body.descripcion ? req.body.descripcion : null;
      let id_responsable = req.body.id_responsable ? req.body.id_responsable : 49;
      let id = req.body.id;
      query =
        "UPDATE mantenimiento SET descripcion = $1, id_responsable =$2 where id_mantenimiento = $3;";
      result = await pool.query(query, [descripcion, id_responsable, parseInt(id)]);
    } else {
      if (req.body.observaciones != "") {
        query =
          "UPDATE mantenimiento SET piezas = $1, materiales =$2, observaciones = $3 where id_mantenimiento = $4;";
        result = await pool.query(query, [req.body.piezas, req.body.materiales, req.body.observaciones, parseInt(req.body.id)]);
      }
      else {
        query =
          "UPDATE mantenimiento SET piezas = $1, materiales =$2 where id_mantenimiento = $3;";
        result = await pool.query(query, [req.body.piezas, req.body.materiales, parseInt(req.body.id)]);
      }
    }

    res.send("Actualización exitosa");
    res.status(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error en la actualización",
      error: err,
    });
  }
});

//Ruta para obtener la informacion de un mantenimiento en especifico
router2.get("/manto/:id", async (req, res) => {
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

//Ruta para obtener los tipos de mantenimiento:
router2.get("/aux/tipo", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM tipo_mant");
    res.send(rows);
  } catch (error) {
    console.log(error);
  }
});

//Ruta para obtener los mantenimientos asignados a un usuario(encargado)
router2.get("/manto/responsable/:id_responsable", async (req, res) => {
  try {
    const query = `
    SELECT mantenimiento.*,no_serie,status,tipo,nombre AS responsable
    FROM mantenimiento
        JOIN status_manto USING (id_status)
        JOIN maquina USING (id_maquina)
        JOIN tipo_mant USING (id_tipo)
        JOIN usuario ON id_responsable = usuario.id_usuario
    where id_responsable=$1
    ORDER BY fecha_mant DESC;;
      `;
    const { rows } = await pool.query(query, [parseInt(req.params.id_responsable)]);
    res.send(rows);
  } catch (error) {
    console.log(error);
  }
});

//Ruta para levantar una orden de mantenimiento :c
router2.post("/manto/orden", async (req, res) => {
  const client = pool;
  try {
    await client.query("BEGIN");

    // Obtener la máquina sin asignar y asignarle el id_usuario del req
    const query1 =
      "UPDATE maquina SET id_usuario = $1 WHERE id_maquina = (SELECT id_maquina FROM maquina WHERE id_usuario IS NULL LIMIT 1) RETURNING id_maquina";
    const values1 = [req.body.id_usuario];
    const result1 = await client.query(query1, values1);
    const id_maquina = result1.rows[0].id_maquina;

    // Hacer un update a la maquina que actualmente permite al usuario y asignarle el id_maquina de la máquina sin asignar
    const query2 =
      "UPDATE maquina SET id_usuario = NULL WHERE id_usuario = $1 RETURNING id_usuario";
    const values2 = [req.body.id_usuario];
    const result2 = await client.query(query2, values2);

    // Hacer una insersión en la tabla mantenimiento
    const query3 =
      "INSERT INTO mantenimiento (descripcion, id_tipo, id_maquina, fecha_mant, id_responsable, id_status) VALUES ($1, $2, $3, $4, $5, 1) RETURNING id_mantenimiento";
    const values3 = [
      req.body.descripcion,
      req.body.id_tipo,
      req.body.id_maquina,
      req.body.fecha_mant,
      req.body.id_responsable,
    ];
    const result3 = await client.query(query3, values3);
    const id_mantenimiento = result3.rows[0].id_mantenimiento;

    await client.query("COMMIT");

    res.status(200).json({
      success: true,
      message: "Orden de mantenimiento levantada correctamente.",
      id_mantenimiento: id_mantenimiento,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error al levantar la orden de mantenimiento.",
      error: err,
    });
  }
});

module.exports = router2;
