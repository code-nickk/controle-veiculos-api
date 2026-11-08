const VeiculoRepository = require("../../src/repositories/veiculoRepository");
const VeiculoService = require("../../src/services/veiculoService");
const ConflitoError = require("../../src/errors/ConflitoError");
const ValidacaoError = require("../../src/errors/ValidacaoError");
const NaoEncontradoError = require("../../src/errors/NaoEncontradoError");

describe("VeiculoService", () => {
    let service;

    // Antes de cada teste: service novo, com a memória vazia
    beforeEach(() => {
        service = new VeiculoService(new VeiculoRepository());
    });

    test("cria veículo com id sequencial e placa padronizada", () => {
        const veiculo = service.criar({ placa: " abc1234 ", cor: "Azul", marca: "Fiat" });

        expect(veiculo.id).toBe(1);
        expect(veiculo.placa).toBe("ABC1234");
    });

    test("rejeita placa duplicada, ignorando maiúsculas e espaços", () => {
        service.criar({ placa: "abc1234", cor: "Azul", marca: "Fiat" });

        expect(() =>
            service.criar({ placa: "ABC1234 ", cor: "Preto", marca: "Ford" })
        ).toThrow(ConflitoError);
    });

    test("rejeita veículo sem placa, cor ou marca", () => {
        expect(() => service.criar({ cor: "Azul", marca: "Fiat" })).toThrow(ValidacaoError);
        expect(() => service.criar({ placa: "abc1234", marca: "Fiat" })).toThrow(ValidacaoError);
        expect(() => service.criar({ placa: "abc1234", cor: "Azul" })).toThrow(ValidacaoError);
    });

    test("filtra por cor e marca, ignorando maiúsculas", () => {
        service.criar({ placa: "abc1234", cor: "Azul", marca: "Fiat" });
        service.criar({ placa: "xyz9999", cor: "Preto", marca: "Ford" });
        service.criar({ placa: "def5678", cor: "Preto", marca: "Fiat" });

        expect(service.listar()).toHaveLength(3);
        expect(service.listar({ cor: "PRETO" })).toHaveLength(2);
        expect(service.listar({ cor: "preto", marca: "fiat" })[0].placa).toBe("DEF5678");
    });

    test("atualiza só a cor e preserva marca e placa", () => {
        service.criar({ placa: "abc1234", cor: "Azul", marca: "Fiat" });

        const veiculo = service.atualizar(1, { cor: "Vermelho", placa: "zzz0000" });

        expect(veiculo.cor).toBe("Vermelho");
        expect(veiculo.marca).toBe("Fiat");
        expect(veiculo.placa).toBe("ABC1234");
    });

    test("exclui o veículo e rejeita id inexistente", () => {
        service.criar({ placa: "abc1234", cor: "Azul", marca: "Fiat" });

        service.excluir(1);

        expect(service.listar()).toHaveLength(0);
        expect(() => service.buscarPorId(1)).toThrow(NaoEncontradoError);
        expect(() => service.excluir(99)).toThrow(NaoEncontradoError);
    });
});