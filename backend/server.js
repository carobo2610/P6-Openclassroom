//importer fichier app.js
const app = require('./app'); 
const http = require('http');

//création du server
app.listen(3000, () => console.log('Server run sur le port 3000')); 

//app.set('port', process.env.PORT || 3000);
//const server = http.createServer(app);
//server.listen(process.env.PORT || 3000);