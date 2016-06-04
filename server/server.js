const connect = require('connect');
const serveStatic = require('serve-static');
const path = require('path');
const port = 8080;

connect().use(serveStatic(path.join(__dirname, '../app'))).listen(port, function(){
  console.log('Servidor rodando na porta ' + port + '.');
});
