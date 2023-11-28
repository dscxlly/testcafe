import { Selector } from 'testcafe';

fixture('Teste Jogo da Memória').page('https://something-symbolic.github.io/game/');

// Teste 1: Verifica se o título do site é o esperado
test('Verificar Título', async (t) => {
    const title = Selector('title'); // Seletor para obter o título da página

    await t.expect(title.innerText).eql('Something Symbolic');
});

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

// Teste 3: Verifica se há um container para contar as estatísticas: quantidade de movimentos e tempo de jogo.
test('Verificar Container de Estatísticas', async (t) => {
    const startButton = Selector('#start');
    const statsContainer = Selector('.stats-container');

    // Clique no botão de Start
    await t.click(startButton);

    // Verifica se o container de estatísticas está presente
    await t.expect(statsContainer.exists).ok();

    // Verifica o conteúdo do container de estatísticas
    const movesCount = Selector('#moves-count').innerText;
    const time = Selector('#time').innerText;

    await t.expect(movesCount).contains('Moves:'); // Verifica se contém a label "Moves:"
    await t.expect(time).contains('Time:'); // Verifica se contém a label "Time:"
    // Essas "labels" são específicas do jogo sendo testado, você precisará mudar se quiser realizar o mesmo teste é um jogo diferente ou haverá uma falha
});

// Teste 4: Inicia o jogo e realiza apenas 20 movimentos. Ao finalizar o teste irá mostrar no console se foram encontrados pares.
test('Teste de 20 Movimentos no Jogo da Memória', async (t) => {
    const startButton = Selector('#start');
    const stopButton = Selector('#stop');
    const movesCountElement = Selector('#moves-count');
    const cardContainers = Selector('.card-container');

    // Clique no botão de Start
    await t.click(startButton);

    // Execute até que o número de movimentos seja 20
    while (parseInt((await movesCountElement.textContent).match(/\d+/)[0]) < 20) {
        const unflippedCards = cardContainers.filter((card) => !card.classList.contains('matched'));

        // Verifique se há cartas não marcadas
        if (await unflippedCards.count > 0) {
            // Calcule um índice aleatório dentro do número de cartas não marcadas
            const randomIndex = Math.floor(Math.random() * await unflippedCards.count);

            // Aguarde até que não haja sobreposição pois o jogo abre outra janela quando é finalizado
            await t
                .expect(unflippedCards.nth(randomIndex).visible)
                .ok()
                .hover(unflippedCards.nth(randomIndex)); // Mova o cursor sobre a carta

            // Clique na carta aleatória
            await t.click(unflippedCards.nth(randomIndex));

            // Aguarde um curto período para simular uma ação (200ms)
            await t.wait(200);
        } else {
            // Se não houver cartas não marcadas, continue verificando
            await t.wait(500); // Aguarde um curto período antes de verificar novamente
        }
    }

    // Aguarde um pouco para garantir que o jogo estabilize
    await t.wait(1000);

    // Clique no botão "Stop Game"
    await t.click(stopButton);

    // Verifique quantas cartas foram encontradas
    const matchedCards = cardContainers.filter((card) => card.classList.contains('matched'));
    const numPairsFound = Math.floor(matchedCards.count / 2);

    // Verifique se matchedCards.count é um número antes de realizar a divisão
    if (!isNaN(numPairsFound)) {
        // Exiba o resultado no console
        console.log(`${numPairsFound} pares de cartas foram encontrados.`);
    } else {
        console.log(`Nenhum par foi encontrado em 20 movimentos.`);
    }

    // Verifique se pelo menos um par foi encontrado
    await t.expect(matchedCards.count).gt(0);
});