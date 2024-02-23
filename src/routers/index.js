const { Router } = require('express');
const { db } = require('../firebase');
const route = Router();
const {auth} = require('../auth/session_auth');

// Ruta para renderizar la página principal
route.get('/', auth, (req, res) => {
    res.redirect('home');
});

// Ruta para manejar el envío de un nuevo contacto
route.post('/new-contact', auth, async(req, res) => {
    try {
        console.log(req.body);
        const newContact = {
            correo: req.body.correo,
            contraseña: req.body.contraseña
        };

        // Obtén una referencia a la colección 'contactos' en Firestore
        const contactosCollection = db.collection('contacts');

        // Añade un nuevo documento a la colección
        const result = await contactosCollection.add(newContact);

        console.log('Documento guardado con ID:', result.id);
        res.send('Guardado exitosamente');
    } catch (error) {
        console.error('Error al guardar documento:', error);
        res.status(500).send('Error al guardar el documento');
    }
});

module.exports = route;