# Controle de Veículos API 

API REST para controlar a utilização dos automóveis de uma empresa: cadastro de
automóveis e motoristas e registro de quem está usando cada veículo, com regras
para impedir uso simultâneo.

Teste técnico desenvolvido em Node.js com Express e persistência em memória.

## Tecnologias

- Node.js 18 ou superior (v26.13.0)
- Express 5
- Jest (testes automatizados)

## Como executar

Pré-requisito: Node.js instalado.

```bash
git clone https://github.com/code-nickk/controle-veiculos-api
cd controle-veiculos-api
npm install
npm start
```

A API sobe em `http://localhost:3000`.

> Os dados ficam apenas em memória: ao reiniciar o servidor, tudo é perdido.

## Como executar os testes

```bash
npm test
```

## Estrutura do projeto

```
CONTROLE-VEICULOS-API/
├── src/
│   ├── controllers/
│   │   ├── motoristaController.js
│   │   ├── utilizacaoController.js
│   │   └── veiculoController.js
│   ├── errors/
│   │   ├── ConflitoError.js
│   │   ├── NaoEncontradoError.js
│   │   └── ValidacaoError.js
│   ├── middlewares/
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── motorista.js
│   │   ├── utilizacao.js
│   │   └── veiculo.js
│   ├── repositories/
│   │   ├── motoristaRepository.js
│   │   ├── utilizacaoRepository.js
│   │   └── veiculoRepository.js
│   ├── routes/
│   │   ├── motoristaRoutes.js
│   │   ├── utilizacaoRoutes.js
│   │   └── veiculoRoutes.js
│   ├── services/
│   │   ├── motoristaService.js
│   │   ├── utilizacaoService.js
│   │   └── veiculoService.js
│   ├── utils/
│   │   ├── converterId.js
│   │   └── textoValido.js
│   ├── app.js
│   └── container.js
├── tests/
│   └── services/
│       ├── motoristaService.test.js
│       ├── utilizacaoService.test.js
│       └── veiculoService.test.js
├── server.js
├── package.json
└── README.md
        
```

Cada módulo segue as camadas: **routes → controller → service → repository**.
O controller só trata HTTP, as regras de negócio ficam no service e o repository
guarda os dados em memória.

## Endpoints

### Veículos

| Método | Rota | Descrição | Sucesso |
|---|---|---|---|
| POST | `/veiculos` | Cadastra um veículo | 201 |
| GET | `/veiculos` | Lista veículos (filtros opcionais `?cor=` e `?marca=`) | 200 |
| GET | `/veiculos/:id` | Busca um veículo pelo id | 200 |
| PUT | `/veiculos/:id` | Atualiza cor e/ou marca | 200 |
| DELETE | `/veiculos/:id` | Exclui um veículo | 204 |

### Motoristas

| Método | Rota | Descrição | Sucesso |
|---|---|---|---|
| POST | `/motoristas` | Cadastra um motorista | 201 |
| GET | `/motoristas` | Lista motoristas (filtro opcional `?nome=`, busca parcial) | 200 |
| GET | `/motoristas/:id` | Busca um motorista pelo id | 200 |
| PUT | `/motoristas/:id` | Atualiza o nome | 200 |
| DELETE | `/motoristas/:id` | Exclui um motorista | 204 |

### Utilizações

| Método | Rota | Descrição | Sucesso |
|---|---|---|---|
| POST | `/utilizacoes` | Inicia a utilização de um veículo por um motorista | 201 |
| PATCH | `/utilizacoes/:id/finalizar` | Registra a data de término | 200 |
| GET | `/utilizacoes` | Lista com nome do motorista e dados do veículo | 200 |

### Exemplos

Cadastrar motorista: `POST /motoristas`

```json
{"nome":"Nicholas Brandão"}
```

Cadastrar veículo: `POST /veiculos`

```json
{ "placa": "abc1234", "cor": "Preto", "marca": "Honda" }
```

Iniciar utilização: `POST /utilizacoes`

```json
{ "motoristaId": 1, "veiculoId": 1, "motivo": "Passeio no parque" }
```

Resposta (`GET /utilizacoes`):

```json
[{
  "id": 1,
  "motivo": "Passeio no parque",
  "dataInicio": "2026-11-08T19:42:05.898Z",
  "dataFim": null,
  "motorista": {
    "id": 1,
    "nome": "Nicholas Brandão"
  },
  "veiculo": {
    "id": 1,
    "placa": "ABC1234",
    "cor": "Preto",
    "marca": "Honda"
  }
}]
```

### Erros

Todos os erros seguem o formato `{ "erro": "mensagem" }`.

| Status | Quando acontece |
|---|---|
| 400 | Dados inválidos ou obrigatórios ausentes (ex.: ID inválido, nome vazio ou motivo não informado). |
| 404 | Recurso não encontrado (ex.: veículo, motorista ou utilização inexistente). |
| 409 | Conflito com uma regra de negócio (ex.: placa duplicada, veículo ocupado ou motorista já utilizando outro veículo).|
| 500 | Inesperado (a mensagem real é registrada só no log do servidor) |

## Regras de negócio

- Um veículo só pode ser utilizado por um motorista por vez.
- Um motorista que já esteja utilizando um veículo não pode utilizar outro ao mesmo tempo.
- Uma utilização está "em andamento" enquanto não tem data de término. Ao finalizar, veículo e motorista voltam a ficar livres.
- O nome do motorista é obrigatório e deve conter nome e sobrenome. 
- Placa: antes de armazenar, o sistema remove os espaços das extremidades e transforma as letras em maiúsculas. Também impede o cadastro de placas duplicadas.
- Existência dos registros: antes de iniciar uma utilização, o sistema verifica se o motorista e o veículo informados estão cadastrados.

## Decisões de projeto

- O service de utilização recebe os services de veículo e motorista porque precisa consultar se o veículo e o motorista existem antes de iniciar uma utilização, além de verificar se estão disponíveis.
- O nome do motorista exige sobrenome para identificar melhor cada motorista. Nomes completos não podem se repetir para evitar cadastros duplicados e facilitar a identificação dos registros.
- Foi utilizado PATCH em vez de PUT no finalizar porque a operação altera apenas uma parte do registro, preenchendo a data de término, sem substituir todos os dados da utilização.

## Limitações conhecidas

- Persistência apenas em memória: os dados são perdidos quando o servidor é reiniciado, pois ainda não existe integração com banco de dados.
- Motoristas homônimos: o sistema não permite cadastrar dois motoristas com o mesmo nome completo, mesmo que sejam pessoas diferentes na vida real. Isso pode impedir o cadastro de pessoas com nomes iguais.