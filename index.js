// Importa o módulo HTTP do Node.js
const http = require('http');

// Importa o módulo 'PessoasController' para lidar com dados de pessoas
const PessoasController = require('./PessoasController');

// Cria o servidor HTTP que responde às requisições
const server = http.createServer((req, res) => {
  // Loga o método e URL da requisição recebida
  console.log(`Recebida requisição: ${req.method} ${req.url}`);
  
  // Divide a URL em partes e extrai a rota e o ID
  const [_, route, id] = req.url.split('/');
  const pessoasId = parseInt(id); // Converte o ID em número inteiro

  // Verifica se a rota é 'pessoas'
  if (route === 'pessoas') {
    // Verifica o método da requisição e chama a função apropriada
    if (req.method === 'GET') {
      PessoasController.getpessoas(res); // Obtém a lista de pessoas
    } else if (req.method === 'POST') {
      PessoasController.addPessoas(req, res); // Adiciona um novo pessoa
    } else if (req.method === 'PUT' && !isNaN(pessoasId)) {
      PessoasController.updatePessoas(req, res, pessoasId); // Atualiza um pessoas específico
    } else if (req.method === 'DELETE' && !isNaN(pessoasId)) {
      PessoasController.deletePessoas(res, pessoasId); // Deleta um pessoas específico
    } else {
      // Responde com erro 404 para métodos ou rotas inválidas
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Método ou rota inválida' }));
    }
  } else {
    // Responde com erro 404 caso a rota não seja 'pessoas'
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Rota não encontrada' }));
  }
});

// Lida com erros do servidor e loga no console
server.on('error', (err) => {
  console.error('Erro no servidor:', err);
});

// Inicia o servidor na porta 3000 e loga que está rodando
server.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
