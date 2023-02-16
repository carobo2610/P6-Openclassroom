//fichier ROUTES pour indiquer les routes des users
//importer Express
const express = require('express');

//créer un router avec l'objet "Router" de express
const router = express.Router(); 

//controllers pour associer les fonctions aux différentes routes
const usersControllers = require('../controllers/users')

//création de la route pour signup
router.post('/signup', usersControllers.signup);

//création de la route pour signup
router.post('/login', usersControllers.login);

//exporter la route pour être importer depuis app.js
module.exports = router;