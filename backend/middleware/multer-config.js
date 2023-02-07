//Importer Multer
const multer = require('multer');

//Création de constantes dictionnaire de type MIME pour résoudre les extensions de fichiers images
const MIME_TYPES = { //utiliser Mime types pour générer extention du fichier
    'image/jpg': 'jpg', //mime type auquel on a acces depuis le frontend
    'image/jpeg': 'jpg',
    'image/png': 'png'
    };
      
//créer constante à passer à Multer comme config qui contient le logique neceesaire pour indiquer à multer ou enregistrer les fichiers entrants    
const storage = multer.diskStorage({//créer objet de configuration de multer avec fonction de multer diskstorage pour enregiter sur le disque avec 2 param
    destination: (req, file, callback) => { 
        callback(null, 'images');
    },
    filename: (req, file, callback) => { //fonction filename indique à multer d'utiliser le nom d'origine, de remplacer les espace par les _ 
        const name = file.originalname.split(' ').join('_'); //créer son nom avant extenions(nom) avec le nom d'origine du fichier auquel on a acces avec propriété orginalname de file
        const extension = MIME_TYPES[file.mimetype]; //element de notre dico qui corresp au mime type du fichier envoyé par le front end
        callback(null, name + Date.now() + '.' + extension); //appel callback avec null et créer le file name en entier
    }
    });
      
module.exports = multer({storage: storage}).single('image'); 
//appel mutler methode auquel passe objet storage et 
//appeler methode single pour indiquer qu'il s'agit fichier unique de type image