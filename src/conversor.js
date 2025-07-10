const axios = require("axios");

class Conversor {
    constructor() { 
        this.taxaAcumulada = 0; 
        this.cobrarTaxa = false;
        this.key = '3841811ca099398ac851b8ed5960f0e5';
        this.url = 'https://api.exchangerate.host/live?access_key=3841811ca099398ac851b8ed5960f0e5';
        this.allCurrents = [];
        this.taxa = 0;

        this.#getAllCurrents();
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
        
        return axios.get(`https://api.exchangerate.host/convert?access_key=${this.key}&from=${moedaOrigem}&to=${moedaDestino}&amount=${valor}`)    
            .then(response => {
                if (response.data.success) {
                    return response.data.result;
                }
                
                throw Error(response.data.error.info)
            })
    }

    async moedaEhValida(moeda) {
        return this.allCurrents.includes(moeda)
    }

    async #getAllCurrents() {
         await axios.get(`https://api.exchangerate.host/list?access_key=${this.key}`)    
            .then((response) => {
                if (response.data.success) this.allCurrents = Object.keys(response.data.currencies);
                else throw Error(response.data.error.info)
            })
            .catch(err => {
                throw Error(err)
            })
    }
    
    async cotarPorPeriodo(valor, moedaOrigem, moedaDestino, dataInicio, dataFinal) {
        return [] // retornar o resultado das cotações por periodo aqui
    }

    alternarTaxa() { 
        this.cobrarTaxa = !this.cobrarTaxa; 
    }
}

module.exports = Conversor;