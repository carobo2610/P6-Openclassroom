const jwt = require('jsonwebtoken');

//fichier de création d'un middleware de vérification du token
module.exports = (req, res, next) => {
    //try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'PIIQUANTE_RANDOM_TOKEN_SECRET');
        if(!decodedToken){
         return res.status(403).json({ message : "Veuillez vous identifiez" })
        }
        const userId = decodedToken.userId;
        req.auth = { //object auth dans le request transmise aux routes appelées par la suite
            userId: userId
        };
     next();
    // //} catch(error) {
    //     res.status(500).json({ message: 'Internal error' });
    // }
 };