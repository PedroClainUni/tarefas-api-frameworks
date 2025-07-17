const readline = require('node:readline/promises');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

const Conversor = require('./conversor');
const conversor = new Conversor();

async function menuPrincipal() {
    console.log('');
    console.log('1. Converter moeda'); // Tarefa 1 e 2
    console.log('2. Ativar ou desativar taxa'); // Tarefa 3
    console.log('3. Ver taxa cobrada até o momento'); // Tarefa 3
    console.log('4. Ver cotações por periodo'); // Tarefa 4
    console.log('');

    const opcao = await rl.question('Opção: ');
    switch(opcao) {
        case '1': 
            await menuConversao();
            break;
        case '2':
            if (conversor.cobrarTaxa) console.log('Taxa desativada com sucesso!');
            else console.log('Taxa ativada com sucesso!');

            conversor.alternarTaxa();
            break;
        case '3':
            console.log('Taxa cobrada até o momento: ' + conversor.taxaAcumulada);
            break;
        case '4':
            await menuCotacoes();
            break;
        default:
            rl.close();
            return;
    }
    await menuPrincipal();
}

/**
 * Lembre-se de validar os dados abaixo. Você pode usar bibliotecas como yup
 * para auxiliar neste desafio de validação. Você poderá validar algumas 
 * informações diretamente nesta função, porém, caso deseje, poderá validar
 * diretamente no método converter() presente no arquivo conversor.js. Lá você
 * encontrará informações sobre como validar.
 */
async function menuConversao() {
    console.log('');
    const moedaOrigem = await rl.question('Moeda Origem: ');
    const moedaDestino = await rl.question('Moeda Destino: ');
    const valor = Number(await rl.question('Valor: '));
    console.log('');
    
    try {
        if (!(await conversor.moedaEhValida(moedaOrigem))) throw Error('Moeda origem inválda');
        if (!(await conversor.moedaEhValida(moedaDestino))) throw Error('Moeda destino inválda');
        if (valor < 0) throw Error('Valor inváldo');
        
        const resultado = await conversor.converter(valor, moedaOrigem, moedaDestino); // implementar o método converter no arquivo conversor.js
        console.log(`${moedaOrigem} ${valor.toFixed(2)} => ${moedaDestino} ${resultado.toFixed(2)}`);
        console.log(`Taxa: ${(resultado / valor).toFixed(6)}`);
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * Lembre-se de validar os dados abaixo. Você pode usar bibliotecas como yup
 * para auxiliar neste desafio de validação. Você poderá validar algumas 
 * informações diretamente nesta função, porém, caso deseje, poderá validar
 * diretamente no método cotarPorPeriodo() presente no arquivo conversor.js. Lá você
 * encontrará informações sobre como validar.
 */
async function menuCotacoes() {
    console.log('');
    const moedaOrigem = await rl.question('Moeda Origem: ');
    const moedaDestino = await rl.question('Moeda Destino: ');
    const valor = Number(await rl.question('Valor: '));
    const dataInicial = await rl.question('Data Inicial: ');
    const dataFinal = await rl.question('Data Final: ');
    console.log('');

    try {
        const resultado = await conversor.cotarPorPeriodo(valor, moedaOrigem, moedaDestino, dataInicial, dataFinal); // implementar o método cotarPorPeriodo no arquivo conversor.js
        
        await Promise.all(resultado)
            .then(result => console.log(`${result.data}: ${result.valor}`))

    } catch (error) {
        console.log(error.message);
    }
}

module.exports = menuPrincipal;