
const MotoristaRepository = require("../../src/repositories/motoristaRepository");
const MotoristaService = require("../../src/services/motoristaService");
const ConflitoError = require("../../src/errors/ConflitoError");
const ValidacaoError = require("../../src/errors/ValidacaoError");
const NaoEncontradoError = require("../../src/errors/NaoEncontradoError");

describe("MotoristaService", () => {
    let service;

    beforeEach(() => {
        service = new MotoristaService(new MotoristaRepository());
    });

    describe("criar", () => {


        test("cria um motorista com id sequencial", () => {
            const motorista = service.criar({ nome: "Maria Souza" });

            expect(motorista.id).toBe(1);
            expect(motorista.nome).toBe("Maria Souza");
        });

        test("aceita o mesmo primeiro nome com sobrenomes diferentes", () => {
            service.criar({ nome: "Maria Souza" });
            const segundo = service.criar({ nome: "Maria Lima" });

            expect(segundo.id).toBe(2);
        });

        test("rejeita nome completo duplicado, ignorando maiúsculas", () => {
            service.criar({ nome: "Maria Souza" });

            expect(() => service.criar({ nome: "maria souza" })).toThrow(ConflitoError);
        });
    

        test("rejeita nome sem sobrenome ou vazio", () => {
            expect(() => service.criar({ nome: "Maria" })).toThrow(ValidacaoError);
            expect(() => service.criar({ nome: "   " })).toThrow(ValidacaoError);
        });
    });        

    describe("listar", () => {
        test("filtra por parte do nome, ignorando maiúsculas", () => {
            service.criar({ nome: "Mariana Lima" });
            service.criar({ nome: "João Silva" });

            const resultado = service.listar({ nome: "ANA" });

            expect(resultado).toHaveLength(1);
            expect(resultado[0].nome).toBe("Mariana Lima");
        });
    });

    describe("atualizar", () => {
        test("barra o nome de outro motorista, mas aceita o próprio", () => {
            service.criar({ nome: "Maria Souza" });
            service.criar({ nome: "João Lima" });

            expect(() => service.atualizar(1, { nome: "Maria Souza" })).not.toThrow();
            expect(() => service.atualizar(2, { nome: "Maria Souza" })).toThrow(ConflitoError);

            expect(service.atualizar(1, { nome: "Maria Costa" }).nome).toBe("Maria Costa");
        });

        test("rejeita atualização de motorista inexistente", () => {
         expect(() =>
          service.atualizar(99, { nome: "Pedro Santos" })
           ).toThrow(NaoEncontradoError);
        });
    });
});

