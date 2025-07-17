const axios = require("axios");

class Conversor {
	constructor() {
		this.taxaAcumulada = 0;
		this.cobrarTaxa = false;
		this.chave = "3841811ca099398ac851b8ed5960f0e5";
		this.url = "https://api.exchangerate.host/live?access_key=3841811ca099398ac851b8ed5960f0e5";
		this.moedasPossiveis = [];

		this.#buscarMoedasPossiveis();
	}

	/**
	 * Para lidar com erros da API, siga o exemplo abaixo:
	 *
	 * if (erroEncontrado)
	 *   throw new Error('Erro Encontrado')
	 *
	 * A informação de erro será passado para o usuário e a partir do try catch,
	 * será possível saber qual erro aconteceu.
	 */
	async converter(valor, moedaOrigem, moedaDestino) {
		return axios
			.get(`https://api.exchangerate.host/convert?access_key=${this.chave}&from=${moedaOrigem}&to=${moedaDestino}&amount=${valor}`)
			.then((response) => {
				if (response.data.success) {
					return response.data.result;
				}

				throw Error('Erro Encontrado');
			})
			.then((valor) => {
				if (this.cobrarTaxa) this.taxaAcumulada += valor * 0.01;

				return valor;
			})
			.catch((err) => {
				throw Error('Erro Encontrado');
			});
	}

	async moedaEhValida(moeda) {
		return this.moedasPossiveis.includes(moeda);
	}

	async #buscarMoedasPossiveis() {
		await axios
			.get(`https://api.exchangerate.host/list?access_key=${this.chave}`)
			.then((response) => {
				if (response.data.success) this.moedasPossiveis = Object.keys(response.data.currencies);
				else throw Error('Erro Encontrado');
			})
			.catch((err) => {
				throw Error('Erro Encontrado');
			});
	}

	async cotarPorPeriodo(valor, moedaOrigem, moedaDestino, dataInicio, dataFinal) {
		const timeInicio = new Date(dataInicio).getTime();
		const timeFinal = new Date(dataFinal).getTime();
		const promisses = [];
		let time = timeInicio;

		while (time <= timeFinal) {
			const data = new Date(time).toLocaleDateString("en-CA");
			const promisse = axios
				.get(`https://api.exchangerate.host/historical?access_key=${this.chave}&date=${data}&source=${moedaOrigem}&currencies=${moedaDestino}`)
				.then((response) => {
					if (response.data.success) {
                        return { data, valor: response.data.quotes[Object.keys(response.data.quotes)[0]] } // valor da primeira chave do objeto "quotes"
                    } else throw Error('Erro Encontrado');
				})
				.catch((err) => {
					throw Error('Erro Encontrado');
				});

			promisses.push(promisse);

			time += 1000 * 60 * 60 * 24; // soma 1 dia
		}

        return promisses;
	}

	alternarTaxa() {
		this.cobrarTaxa = !this.cobrarTaxa;
	}
}

module.exports = Conversor;
