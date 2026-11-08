// Middleware de erro: transforma qualquer erro lançado nas camadas anteriores em uma resposta JSON padronizada.

function errorHandler(erro, req, res, next) {
    const status = erro.statusCode || 500;

    // Erros inesperados (500) não devem expor detalhes internos ao cliente
    const mensagem = status === 500
        ? "Erro interno do servidor"
        : erro.message;
    console.log("mensagem:", mensagem); 
    res.status(status).json({ erro: mensagem });

    if (status === 500) {
    console.error(erro);
}
}

module.exports = errorHandler;