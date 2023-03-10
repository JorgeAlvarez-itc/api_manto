const express = require("express");
const pool = require("../conecction");
const PDFDocument = require("pdfkit-table");; 
const router3 = express.Router();

//Ruta para obtener todos los usuarios
router3.get('/usuario',async(req,res)=>{
    try {
        const { rows } = await pool.query("SELECT * FROM usuario");
        res.send(rows);
    } catch (error) {
        console.log(error);
    }
});

//Ruta para obtener un usuario
router3.get('/usuario/:id',async(req,res)=>{
    try {
        const { rows } = await pool.query("SELECT * FROM usuario where id_usuario=$1",[parseInt(req.params.id)]);
        res.send(rows);
        res.status(200);
    } catch (error) {
        console.log(error)
        res.status(500);
    }
});

//Ruta para obtener todos los usuarios de un departamento.
router3.get('/usuario/depto/:id',async(req,res)=>{
    try {
        const { rows } = await pool.query("SELECT * FROM usuario where id_departamento=$1",[parseInt(req.params.id)]);
        res.send(rows);
        res.status(200);
    } catch (error) {
        console.log(error);
        res.status(500);
    }
});

//Ruta para obtener un pdf con los usuarios de un departamento
//Ruta para obtener un pdf con los usuarios de un departamento
router3.get('/usuario/report/:id',async (req,res)=>{
    try {
        // Crear un nuevo documento PDF
        const doc = new PDFDocument();
        // Agregar contenido al documento
        doc.fontSize(14).text('Reporte de datos');

        const tableHeaders = ["Correo", "Nombre", "Departamento"];
        const tableRows = [];

        const query='SELECT u.*, d.departameto from usuario u join departamento d using(id_departamento) where u.id_departamento=$1'    
        pool.query(query,[parseInt(req.params.id)],(error,result)=>{
            if (error) {
                console.log(error);
            } else {
                result.rows.forEach((row) => {
                    tableRows.push([row.correo, row.nombre, row.departameto]);
                });

                // Crear una tabla con los datos obtenidos
                doc.moveDown().fontSize(10);
                const table = {
                    headers: tableHeaders,
                    rows: tableRows,
                };
                doc.table(table, {
                    prepareHeader: () => doc.font('Helvetica-Bold'),
                    prepareRow: (row, i) => doc.font('Helvetica').fontSize(10),
                });
            }
            // Terminar el documento y enviarlo como respuesta
            doc.end();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=reporte.pdf');
            doc.pipe(res);
        });

    } catch (error) {
        res.send('Ocurrio un error');
        res.status(500);
    }
});



//Ruta para dar de alta a nuevos usuarios.
router3.post('/usuario',async(req,res)=>{
    try {
        const usuarios=req.body;
        for(const usuario of usuarios){
            const correo=usuario.correo;
            const nombre=usuario.nombre;
            const id_departamento=usuario.id_departamento;
            const query="INSERT INTO usuario(correo,nombre,id_departamento) values($1,$2,$3)"
            await pool.query(query,[correo,nombre,id_departamento]);
            res.send('Registro realizado con exito');
            res.status(200);
        }
    } catch (error) {
        console.log(error);
        res.status(500);
    }
});

//Ruta para modificar un usuario.
router3.put('/usuario/:id',async(req,res)=>{
    try {
        const correo=req.body.correo;
        const nombre=req.body.nombre;
        const id_departamento=req.body.id_departamento;
        const query="Update usuario set correo=$1,nombre=$2,id_departamento=$3";
        await pool.query(query,[correo,nombre,parseInt(id_departamento)]);
        res.send('Modificacion exitosa');
        res.status(200);
    } catch (error) {
        console.log(error);
        res.status(500);
    }
});

//Ruta para eliminar un usuario utilizando transacciones.
router3.delete('/usuario/:id', async (req, res) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const query = 'DELETE FROM usuario WHERE id_usuario = $1';
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

module.exports = router3;