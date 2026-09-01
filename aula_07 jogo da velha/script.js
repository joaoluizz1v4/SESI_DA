const casas = document.querySelectorAll('.casa');
let jogadorAtual = 'X';
let jogoAtivo = true;

// Combinações possíveis para vencer
const combinacoesVitoria = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
    [0, 4, 8], [2, 4, 6]             // Diagonais
];

// Adiciona o evento de clique em cada casa
casas.forEach((casa, index) => {
    casa.addEventListener('click', () => tratarClique(casa, index));
});

function tratarClique(casa, index) {
    // Se a casa já foi clicada ou o jogo acabou, ignora o clique
    if (casa.textContent !== '' || !jogoAtivo) return;

    // Marca a jogada na tela
    casa.textContent = jogadorAtual;

    // Estiliza o texto centralizado na casa
    casa.style.display = 'flex';
    casa.style.alignItems = 'center';
    casa.style.justifyContent = 'center';
    casa.style.fontSize = '40px';
    casa.style.fontFamily = 'sans-serif';

    // Verifica se houve vencedor ou empate
    if (verificarVitoria()) {
        setTimeout(() => alert(`O jogador '${jogadorAtual}' venceu!`), 10);
        jogoAtivo = false;
        return;
    }

    if (verificarEmpate()) {
        setTimeout(() => alert('Empate!'), 10);
        jogoAtivo = false;
        return;
    }

    // Alterna a vez do jogador
    jogadorAtual = jogadorAtual === 'X' ? 'O' : 'X';
}

function verificarVitoria() {
    return combinacoesVitoria.some(combinacao => {
        return combinacao.every(index => {
            return casas[index].textContent === jogadorAtual;
        });
    });
}

function verificarEmpate() {
    return [...casas].every(casa => casa.textContent !== '');
}