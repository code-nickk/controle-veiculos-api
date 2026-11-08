const VeiculoRepository = require("../../src/repositories/veiculoRepository");
const VeiculoService = require("../../src/services/veiculoService");
const MotoristaRepository = require("../../src/repositories/motoristaRepository");
const MotoristaService = require("../../src/services/motoristaService");
const UtilizacaoRepository = require("../../src/repositories/utilizacaoRepository");
const UtilizacaoService = require("../../src/services/utilizacaoService");
const ConflitoError = require("../../src/errors/ConflitoError");
const ValidacaoError = require("../../src/errors/ValidacaoError");
const NaoEncontradoError = require("../../src/errors/NaoEncontradoError");

describe("UtilizacaoService", () => {
    let service;

    // Antes de cada teste: veículos 1 e 2, motoristas 1 (Maria) e 2 (João)
    beforeEach(() => {
        const veiculoService = new VeiculoService(new VeiculoRepository());
        const motoristaService = new MotoristaService(new MotoristaRepository());

        veiculoService.criar({ placa: "abc1234", cor: "Azul", marca: "Fiat" });
        veiculoService.criar({ placa: "xyz9999", cor: "Preto", marca: "Ford" });
        motoristaService.criar({ nome: "Maria Souza" });
        motoristaService.criar({ nome: "João Lima" });

        service = new UtilizacaoService(new UtilizacaoRepository(), veiculoService, motoristaService);
    });

    test("inicia uma utilização em andamento", () => {
        const utilizacao = service.iniciar({ motoristaId: 1, veiculoId: 1, motivo: "Reunião" });

        expect(utilizacao.id).toBe(1);
        expect(utilizacao.dataFim).toBeNull();
    });

    test("regra 1: veículo em uso não pode ser usado por outro motorista", () => {
        service.iniciar({ motoristaId: 1, veiculoId: 1, motivo: "Reunião" });

        expect(() =>
            service.iniciar({ motoristaId: 2, veiculoId:1, motivo: "Visita" })
        ).toThrow(ConflitoError);
    });

    test("regra 2: motorista não pode usar dois veículos ao mesmo tempo", () => {
        service.iniciar({ motoristaId: 1, veiculoId: 1, motivo: "Reunião" });

        expect(() =>
            service.iniciar({ motoristaId: 1, veiculoId: 2, motivo: "Visita" })
        ).toThrow(ConflitoError);
    });

    test("rejeita motorista ou veículo inexistente", () => {
        expect(() => service.iniciar({ motoristaId: 99, veiculoId: 1, motivo: "Reunião" })).toThrow(NaoEncontradoError);
        expect(() => service.iniciar({ motoristaId: 1, veiculoId: 99, motivo: "Reunião" })).toThrow(NaoEncontradoError);
    });

    test("rejeita utilização sem motivo", () => {
        expect(() => service.iniciar({ motoristaId: 1, veiculoId: 1 })).toThrow(ValidacaoError);
    });

    test("finaliza preenchendo a data de término e não deixa finalizar duas vezes", () => {
        service.iniciar({ motoristaId: 1, veiculoId: 1, motivo: "Reunião" });

        expect(service.finalizar(1).dataFim).toBeInstanceOf(Date);
        expect(() => service.finalizar(1)).toThrow(ConflitoError);
    });

    test("depois de finalizar, veículo e motorista ficam livres", () => {
        service.iniciar({ motoristaId: 1, veiculoId: 1, motivo: "Reunião" });
        service.finalizar(1);

        expect(() => service.iniciar({ motoristaId: 1, veiculoId: 2, motivo: "Visita" })).not.toThrow();
        expect(() => service.iniciar({ motoristaId: 2, veiculoId: 1, motivo: "Entrega" })).not.toThrow();
    });

    test("lista trazendo o nome do motorista e os dados do veículo", () => {
        service.iniciar({ motoristaId: 1, veiculoId: 1, motivo: "Reunião" });

        const lista = service.listar();

        expect(lista).toHaveLength(1);
        expect(lista[0].motorista.nome).toBe("Maria Souza");
        expect(lista[0].veiculo.placa).toBe("ABC1234");
    });
});