//fichier pour mettre la logique des fonctions relatives aux users

//importer Bcrypt pour le cryptage des mots de passe
const bcrypt = require('bcrypt');
//importer jsonwebtoken
const jwt = require('jsonwebtoken');
//importer les users depuis le models des users
const User = require('../models/users');

//Création des middleware d'authentification de nouveaux users
//fonction signup pour la création d'utiliseurs
exports.signup = async (req, res, next) => {
    let checkUser = await User.findOne({
        email: req.body.email
    }) 
    if (checkUser){
        return res.status(400).json({message: 'email existe déja'})
    }
    let salt = await bcrypt.genSalt(10)
    let hash = await bcrypt.hash(req.body.password, salt)
    let user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        date: req.body.date
    }) 
    if (user){
    return res.status(201).json({message: 'Utilisateur créé'})
} else {
    return res.json({message: 'Utilisateur NON créé'})
}   

};

//fonction login pour que l'utilisateur se connecte
exports.login = async(req, res, next) => {
    let checkUser = await User.findOne({
        email: req.body.email
    }) 
    if (!checkUser){
        return res.status(401).json({message: 'Utilisateur inexistant'})
    } else {
        let isMatch = await bcrypt.compare(req.body.password, checkUser.password)
        if (isMatch){
        //return res.status(200).json({message:'bienvenu'})
        res.status(200).json({
            token: jwt.sign( 
               {Id: checkUser._id}, 
               'PIIQUANTE_RANDOM_TOKEN_SECRET', //code de cryptage et decryptage 
               {expiresIn: '24h'} 
            )
        });
        } else {
            return res.status(401).json({message: 'mauvais mot de passe'})
        }
    }
};

exports.getUser = (req, res) => {
 res.send('getUser')
};
//cette route donner id et parcourir dans la bd tous les user pour verif si on trouve user avec meme id que celui la
//si on le trouve pas = message erreur et si on trouve = on l'affiche res.json 
//on travaille avec id parce que envoi id dans le token


