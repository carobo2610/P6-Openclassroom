//Importer Multer
const multer = require('multer');

//Création de constantes dictionnaire de type MIME pour résoudre les extensions de fichiers images
//utiliser Mime types pour générer extention du fichier
const MIME_TYPES = { 
    'image/jpg': 'jpg', 
    'image/jpeg': 'jpg',
    'image/png': 'png'
    };
      
//Créer constante à passer à Multer comme config qui contient le logique neceesaire pour indiquer à multer ou enregistrer les fichiers entrants
//créer objet de configuration de multer avec fonction de multer diskstorage pour enregiter sur le disque avec 2 param    
const storage = multer.diskStorage({
    destination: (req, file, callback) => { 
        callback(null, 'images');
    },
    filename: (req, file, callback) => { 
        const name = file.originalname.split(' ').join('_'); 
        const extension = MIME_TYPES[file.mimetype]; 
        callback(null, name + Date.now() + '.' + extension); 
    }
    });
      
module.exports = multer({storage: storage}).single('image'); 
