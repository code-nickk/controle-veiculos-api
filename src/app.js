const express = require('express');
const veiculoRoutes = require('./routes/veiculoRoutes');
const motoristaRoutes = require('./routes/motoristaRoutes');
const utilizacaoRoutes = require('./routes/utilizacaoRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor funcionando!');
});

app.use('/veiculos', veiculoRoutes);
app.use('/motoristas', motoristaRoutes);
app.use('/utilizacoes', utilizacaoRoutes);
app.use(errorHandler);

module.exports = app;