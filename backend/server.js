//importer fichier app.js
const app = require('./app'); 
const PORT = process.env.PORT || 3000;

//création du server
app.listen(PORT, () => console.log(`Server run sur le port ${PORT}`)); 
