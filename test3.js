import { Selector } from 'testcafe';

fixture('Teste Jogo da Memória').page('https://something-symbolic.github.io/game/');

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