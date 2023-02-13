//Fichier controllers pour gérer la logique de "user" avec les conditions
//Importer le modèle "User"
const User = require('../models/users');
//Importer Bcrypt pour le cryptage des mots de passe
const bcrypt = require('bcrypt');
//Importer jsonwebtoken pour transférer des informations de manière sécurisée
const jwt = require('jsonwebtoken');

//Middleware d'authentification de nouveaux users
exports.signup = async (req, res, next) => {
    try {
        if (req.body.email) {
            let text = req.body.email;
            let pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            let result = pattern.test(text);
            if (!result) {
                return res.status(401).json({message: 'Veuillez renseigner un email valide'})
            }
        }
        if (req.body.password){
            let text = req.body.password;
            let pattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/;
            let result = pattern.test(text);
            if (!result) {
                return res.status(401).json({message: 'Veuillez renseigner le champ password'})
            }
        }
    let checkUser = await User.findOne({
        email: req.body.email
    }); //si l'email ets déja stocké dans la base de données
        if (checkUser){
            return res.status(409).json({ message: "Unauthorized" })
        }
        let salt = await bcrypt.genSalt(10)
        let hash = await bcrypt.hash(req.body.password, salt) 
        let user = await User.create({
            email: req.body.email,
            password: hash,
        })   
            if (user){
                return res.status(201).json({message: 'Utilisateur créé'})
            } else {
                return res.status(400).json({ error })
            }
    } catch (error){
        console.log(error)
        res.status(500).json({ error });    
    }
};

//Middleware login pour que l'utilisateur se connecte
exports.login = async(req, res, next) => {
    try {
        let checkUser = await User.findOne({
        email: req.body.email
    }) 
        if (!checkUser){
            return res.status(401).json({message: 'Paire identifiant / Mot de passe incorrecte'})
        } else {
            let isMatch = await bcrypt.compare(req.body.password, checkUser.password)
            if (isMatch){
            res.status(200).json({
                userId: checkUser._id, 
                token: jwt.sign( 
                {userId: checkUser._id}, 
                process.env.TOKEN_SECRET, //code de cryptage et decryptage 
                {expiresIn: '24h'} 
                )
            });
            } else {
                return res.status(401).json({message: 'Paire identifiant / Mot de passe incorrecte'})
            }
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};




