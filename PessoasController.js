// Importa o módulo 'fs' para manipulação de arquivos
const fs = require('fs');
// Importa o módulo 'path' para manipulação de caminhos
const path = require('path');
// Define o caminho do arquivo JSON que contém os dados de pessoas
const dataPath = path.join(__dirname, 'pessoas.json');


/**
 * @swagger
 * /pessoas:
 *   get:
 *     summary: Retorna todas as pessoas
 *     responses:
 *       200:
 *         description: Lista de pessoas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nome:
 *                     type: string
 *                     example: "Natan"
 */
// Função para obter a lista de pessoas
function getpessoas(res) {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      // Responde com erro 500 se houver falha ao ler o arquivo
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Erro ao ler os dados');
      console.error('Erro ao ler o arquivo:', err);
    } else {
      // Responde com sucesso e retorna os dados do arquivo
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    }
  });
}

/**
 * @swagger
 * /pessoas/{id}:
 *   put:
 *     summary: Atualiza os dados de uma pessoa cadastrada
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da pessoa a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Natan atualizado"
 *     responses:
 *       200:
 *         description: Pessoa atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nome:
 *                   type: string
 *                   example: "Natan atualizado"
 *       400:
 *         description: JSON inválido enviado no corpo da requisição
 *       404:
 *         description: Pessoa não encontrada
 *       500:
 *         description: Erro ao salvar as mudanças ou processar os dados
 */

// Função para atualizar um pessoa
function updatePessoas(req, res, id) {
  let body = '';

  req.on('data', chunk => {
    // Concatena pedaços do corpo da requisição
    body += chunk.toString();
  });

  req.on('end', () => {
    let updatedPessoas;
    try {
      // Converte o corpo da requisição para JSON
      updatedPessoas = JSON.parse(body);
    } catch (error) {
      // Responde com erro 400 se o JSON for inválido
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Erro: JSON inválido');
      console.error('Erro ao processar o JSON:', error);
      return;
    }

    fs.readFile(dataPath, 'utf8', (err, data) => {
      if (err) {
        // Responde com erro 500 se houver falha ao ler os dados
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Erro ao ler os dados');
        console.error('Erro ao ler o arquivo:', err);
      } else {
        try {
          const pessoas = JSON.parse(data);
          // Encontra o índice do pessoa pelo ID
          const PessoasIndex = pessoas.findIndex(Pessoas => Pessoas.id === parseInt(id));

          if (PessoasIndex === -1) {
            // Responde com erro 404 se o pessoa não for encontrado
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('pessoa não encontrado');
          } else {
            // Atualiza os dados do pessoa
            pessoas[PessoasIndex] = { ...pessoas[PessoasIndex], ...updatedPessoas };

            fs.writeFile(dataPath, JSON.stringify(pessoas, null, 2), err => {
              if (err) {
                // Responde com erro 500 se houver falha ao salvar os dados
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Erro ao salvar as mudanças');
                console.error('Erro ao salvar o arquivo:', err);
              } else {
                // Responde com sucesso e retorna o pessoa atualizado
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(pessoas[PessoasIndex]));
              }
            });
          }
        } catch (error) {
          // Responde com erro 500 se houver falha ao processar os dados
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Erro ao processar os dados');
          console.error('Erro ao processar o JSON:', error);
        }
      }
    });
  });
}

/**
 * @swagger
 * /pessoas:
 *   post:
 *     summary: Adiciona uma nova pessoa ao cadastro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Natan"
 *     responses:
 *       201:
 *         description: Pessoa adicionada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 2
 *                 nome:
 *                   type: string
 *                   example: "Natan"
 *       400:
 *         description: JSON inválido enviado no corpo da requisição
 *       500:
 *         description: Erro ao salvar a nova pessoa
 */

// Função para adicionar um novo pessoa
function addPessoas(req, res) {
  let body = '';

  req.on('data', chunk => {
    // Concatena os pedaços da requisição
    body += chunk.toString();
  });

  req.on('end', () => {
    let newPessoas;
    try {
      // Converte o corpo da requisição para objeto JSON
      newPessoas = JSON.parse(body);
    } catch (error) {
      // Responde com erro 400 se o JSON for inválido
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Erro: JSON inválido');
      console.error('Erro ao processar o JSON:', error);
      return;
    }

    fs.readFile(dataPath, 'utf8', (err, data) => {
      if (err) {
        // Responde com erro 500 se houver falha ao ler os dados
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Erro ao ler os dados');
        console.error('Erro ao ler o arquivo:', err);
      } else {
        try {
          // Carrega os pessoas existentes e adiciona o novo
          const pessoas = JSON.parse(data);
          newPessoas.id = pessoas.length + 1; // Gera um ID único para o pessoa
          pessoas.push(newPessoas);

          // Salva o arquivo atualizado
          fs.writeFile(dataPath, JSON.stringify(pessoas, null, 2), err => {
            if (err) {
              // Responde com erro 500 se houver falha ao salvar o pessoa
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.end('Erro ao salvar o pessoa');
              console.error('Erro ao salvar o arquivo:', err);
            } else {
              // Responde com sucesso e retorna o novo pessoa
              res.writeHead(201, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(newPessoas));
            }
          });
        } catch (error) {
          // Responde com erro 500 se houver falha ao processar os dados
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Erro ao processar os dados');
          console.error('Erro ao processar o JSON:', error);
        }
      }
    });
  });
}

/**
 * @swagger
 * /pessoas/{id}:
 *   delete:
 *     summary: Remove uma pessoa do cadastro
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da pessoa a ser removida
 *     responses:
 *       200:
 *         description: Pessoa deletada com sucesso
 *       400:
 *         description: ID inválido fornecido na requisição
 *       404:
 *         description: Pessoa não encontrada
 *       500:
 *         description: Erro ao processar a remoção da pessoa
 */

// Função para deletar um pessoa
function deletePessoas(res, id) {
  if (!id || isNaN(id)) {
    // Responde com erro 400 se o ID for inválido
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Erro: ID inválido');
    return;
  }

  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      // Responde com erro 500 se houver falha ao ler os dados
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Erro ao ler os dados');
      console.error('Erro ao ler o arquivo:', err);
    } else {
      try {
        const pessoas = JSON.parse(data);
        // Filtra os pessoas para remover o com o ID específico
        const filteredpessoas = pessoas.filter(Pessoas => Pessoas.id !== parseInt(id));

        fs.writeFile(dataPath, JSON.stringify(filteredpessoas, null, 2), err => {
          if (err) {
            // Responde com erro 500 se houver falha ao deletar o pessoa
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Erro ao deletar o pessoa');
            console.error('Erro ao salvar o arquivo:', err);
          } else {
            // Responde com sucesso confirmando a exclusão
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('pessoa deletado com sucesso');
          }
        });
      } catch (error) {
        // Responde com erro 500 se houver falha ao processar os dados
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Erro ao processar os dados');
        console.error('Erro ao processar o JSON:', error);
      }
    }
  });
}

// Exporta as funções para uso em outros módulos
module.exports = { getpessoas, addPessoas, updatePessoas, deletePessoas };
