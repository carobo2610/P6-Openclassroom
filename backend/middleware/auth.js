//Importer JsonWebToken
const jwt = require('jsonwebtoken');


//fichier de création d'un middleware de vérification du token
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
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
        res.status(500).json({ error });
    }
 };