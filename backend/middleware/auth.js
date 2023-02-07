const jwt = require('jsonwebtoken');

//fichier de création d'un middleware de vérification du token
module.exports = (req, res, next) => {
    try {
        //verif que header avec authorisation et 2 elements avec premier element chaine caractere = bearer et 2eme token
        
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'PIIQUANTE_RANDOM_TOKEN_SECRET');
        if(!decodedToken){
         return res.status(403).json({ message : "Veuillez vous identifiez" })
        }
        const userId = decodedToken.userId;
        req.auth = { 
            userId: userId
        };
     next();
    } catch(error) {
        console.log(error)
        res.status(500).json({ message: 'Internal error fichier auth' });
    }
 };