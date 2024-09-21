const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const exphbs = require('express-handlebars').create;
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configuración de Handlebars
const hbs = exphbs();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Ruta para la vista principal
app.get('/', (req, res) => {
  res.render('home');
});

// WebSocket: detectar conexiones y enviar productos
const products = require('../data/public/js/products.js');

io.on('connection', (socket) => {
  console.log('Usuario conectado');

  // Enviar productos al cliente
  socket.emit('products', products);

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
