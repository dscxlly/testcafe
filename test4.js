import { Selector } from 'testcafe';

fixture('Teste Jogo da Memória').page('https://something-symbolic.github.io/game/');

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