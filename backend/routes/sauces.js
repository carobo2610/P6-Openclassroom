//fichier ROUTES pour lister les routes de l'API
const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const router = express.Router()

//controllers pour associer les fonctions aux différentes routes
const saucesControllers = require('../controllers/sauces');

//pour voir la liste des sauces
router.get('/getAllSauces', auth, saucesControllers.getAllSauces); //On n'appelle pas la fonction, on l'applique à la route

//pour voir une seule sauce
router.get('/:id', auth, saucesControllers.getOneSauce);

//pour créer une sauce
router.post('/createSauce', multer, saucesControllers.createSauce);

//pour modifier une sauce
router.put('/modifySauce/:id', auth, multer, saucesControllers.modifySauce);

//pour supprimer la sauce
router.delete('/:id', auth, saucesControllers.deleteSauce);

//pour les likes et dislikes
router.post('/:id', auth, saucesControllers.likeDislikeSauce);



module.exports = router;