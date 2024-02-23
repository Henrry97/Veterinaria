const { Router } = require('express');
const { db } = require('../firebase');
const route = Router();
const {auth} = require('../auth/session_auth');

// Ruta para renderizar la página principal
route.get('/anadir', auth, (req, res) => {
    res.render('anadir');
});

// Ruta para manejar el envío de un nuevo usuario
route.post('/new-user', auth, async(req, res) => {
    try {
        const newUser = {
            nombre: req.body.nombre,
            cedula: req.body.cedula,
            gmail: req.body.gmail,
            ubicacion: req.body.ubicacion,
            telefono: req.body.telefono,

            // Datos de la mascota
            mascota: req.body.mascota,
            edad_mascota: req.body.edad_mascota,
            especie: req.body.especie,
            opciones: req.body.opciones,
            fecha: req.body.fecha,

            // Guarda el ID generado automáticamente como un campo más
            userId: '', // Esto se actualizará más adelante
        };

        // Obtén una referencia a la colección 'user' en Firestore
        const userCollection = db.collection('user');

        // Añade un nuevo documento a la colección y obtén el ID generado automáticamente
        const result = await userCollection.add(newUser);

        // Obtén el ID generado automáticamente y guárdalo en el objeto newUser
        const userId = result.id;
        newUser.userId = userId;

        // Actualiza el documento recién agregado con el ID del usuario
        await userCollection.doc(userId).set(newUser);

        console.log('Documento guardado con ID:', userId);

    } catch (error) {
        console.error('Error al guardar documento:', error);
        res.status(500).send('Error al guardar el documento');
    }
});

module.exports = route;