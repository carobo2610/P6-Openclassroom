//fichier controllers pour gérer les routes qui modifies les sauces
const Sauces = require('../models/sauces');

//Liste des actions possibles sur les sauces
//Voir la liste des sauces    GET /api/sauces
exports.getAllSauces = async (req, res) => {
    try {
        let sauces = await Sauces.find()
        return res.status(200).json(sauces);
    } catch (e) {
        return res.status(500).json({message: "Internal Server Error"})
    }
};

//Voir une seule sauce   GET/api/sauces/:id
exports.getOneSauce = (req, res) => {
    // try {
    //     let sauce = await Sauces.findOne({
    //         _id: req.params.id
    //     })
    // }
};

//Créer une sauce et importer l'image d'une sauce   POST /api/sauces
    //utilisation de Multer pour importer images et les stocker dans dossier 
exports.createSauce = async (req, res,) => {
    let checkSauce = await Sauces.findOne({
        name: req.body.name
    })
    if (checkSauce){
        return res.status(400).json({ message: 'Ce nom de sauce existe déja'})
    }
    let sauce = await Sauces.create({
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        mainPepper: req.body.mainPepper,
        imageURL:req.body.imageUrl,
        heat: req.body.heat,
        likes: req.body.likes,
        dislikes: req.body.dislikes
    })
    if (sauce){
        return res.status(201).json({message: 'Sauce créée'})
    } else {
        return res.status(400).json({message: 'Erreur: Sauce non créée'})
    }
    };

//Modifier la sauce avec ID spécifique par l'utilisateur qui l'a créé  PUT /api/sauces/:id
exports.modifySauce = (req, res) => {
   
};

//Supprimer la sauce par l'utilisateur qui l'a créé  DELETE api/sauces/:id
exports.deleteSauce = (req, res) => {

};

//Likes / Dislikes ajout ou suppression du user  POST /api/sauces/:id/like
exports.likeDislikeSauce = (req, res) => {

};