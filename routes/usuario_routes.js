const express = require("express");
const pool = require("../conecction");
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
        
    } catch (error) {
        
    }
});

//Ruta para eliminar un usuario.
router3.delete('/usuario/:id',async(req,res)=>{
    try {
        
    } catch (error) {
        
    }
});

module.exports = router3;