import { Selector } from 'testcafe';

fixture('Teste Jogo da Memória').page('https://something-symbolic.github.io/game/');

// Teste 2: Inicia o jogo e realiza uma rodada. O teste é finalizado quando o primeiro par de cartas é encontrado
test('Iniciar e Jogar uma Rodada do Jogo da Memória', async (t) => {
    const startButton = Selector('#start'); // o nome no seletor deve ser o mesmo do código do jogo, nesse caso é o id do botão
    const cardContainers = Selector('.card-container'); // o nome no seletor deve ser o mesmo do código do jogo, nesse caso é a classe onde está o conteúdos dos cards
    const numPairs = 18; // Número de pares no jogo

    // Clique no botão de Start
    await t.click(startButton);

    // Função para verificar se duas cartas são um par correspondente
    const isMatchingPair = async (card1, card2) => {
        const value1 = await card1.getAttribute('data-card-value'); // data-card-value também é o identificador que está no jogo, qualquer valor diferente resultará em falha no teste
        const value2 = await card2.getAttribute('data-card-value');
        return value1 === value2; // os cards são marcados como iguais se ambos os valores coincidirem
    };

    // Loop até encontrar um par correspondente
    let foundMatchingPair = false; // necessariamente falso pois o jogo não inicia com pares
    while (!foundMatchingPair) {
        // Escolhe dois índices aleatórios distintos para o cursor do teste se movimentar
        const randomIndex1 = Math.floor(Math.random() * numPairs) * 2;
        let randomIndex2;
        do {
            randomIndex2 = Math.floor(Math.random() * numPairs) * 2; // inicia o índice aleatório
        } while (randomIndex1 === randomIndex2); // enquanto os dois indices não são iguais, para o cursor não clicar no mesmo card

        // Clique em duas cartas aleatórias
        await t.click(cardContainers.nth(randomIndex1)).click(cardContainers.nth(randomIndex2));

        // Verifique se as cartas formam um par correspondente, o teste termina quando encontrar o primeiro par
        foundMatchingPair = await isMatchingPair(cardContainers.nth(randomIndex1), cardContainers.nth(randomIndex2));
    }

});