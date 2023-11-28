import { Selector } from 'testcafe';

fixture('Teste Jogo da Memória').page('https://something-symbolic.github.io/game/');

// Teste 1: Verifica se o título do site é o esperado
test('Verificar Título', async (t) => {
    const title = Selector('title'); // Seletor para obter o título da página

    await t.expect(title.innerText).eql('Something Symbolic');
});