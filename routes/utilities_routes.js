const express = require("express");
const PDFDocument = require("pdfkit-table");
const nodemailer = require("nodemailer"); 
const router4 = express.Router();
const qr = require('qrcode');

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
      text: `Información importante: ${mensaje}`
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

//Ruta para obtener un qr a partir de un link
router4.post('/qr', async (req, res) => {
    const { link } = req.body;
    try {
      // Generar el código QR
      const code = await qr.toDataURL(link);
      // Devolver el código QR en formato de imagen
      res.send(`<img src="${code}" alt="QR code">`);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al generar el código QR');
    }
});


module.exports = router4;