const express = require("express");
const PDFDocument = require("pdfkit-table");
const nodemailer = require("nodemailer"); 
const router4 = express.Router();


//Ruta para enviar un email
router4.post('/email', async (req, res) => {
    // obtener los datos del formulario
    const { nombre, correo, asunto, mensaje } = req.body;
  
    // configurar el servicio de correo electrónico
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  
    // configurar el contenido del correo electrónico
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: correo,
      subject: asunto,
      text: `Nombre: ${nombre}\nCorreo: ${correo}\nMensaje: ${mensaje}`
    };
  
    try {
      // enviar el correo electrónico
      await transporter.sendMail(mailOptions);
      res.status(200).send('Correo enviado correctamente');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al enviar el correo electrónico');
    }
});

module.exports = router4;