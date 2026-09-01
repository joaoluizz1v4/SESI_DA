const casas = document.querySelectorAll('.casa');
const inputX = document.getElementById('jogadorX');
const inputO = document.getElementById('jogadorO');
const btnReiniciar = document.getElementById('btn-reiniciar');

let jogadorAtual = 'X';
let jogoAtivo = true;

const combinacoesVitoria = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

inputX.addEventListener('input', atualizarTextoVez);
inputO.addEventListener('input', atualizarTextoVez);

function obterNomeAtual() {
    if (jogadorAtual === 'X') {
        return inputX.value.trim() || 'Jogador X';
    } else {
        return inputO.value.trim() || 'Jogador O';
    }
}

function atualizarTextoVez() {
    const statusTexto = document.getElementById('nome-vez');
    if (statusTexto && jogoAtivo) {
        statusTexto.textContent = `${obterNomeAtual()} (${jogadorAtual})`;
    }
}

casas.forEach((casa) => {
    casa.addEventListener('click', () => tratarClique(casa));
});

function tratarClique(casa) {
    if (casa.textContent !== '' || !jogoAtivo) return;

    casa.textContent = jogadorAtual;

    if (verificarVitoria()) {
        const vencedor = obterNomeAtual();
        document.getElementById('status').textContent = `🎉 ${vencedor} venceu!`;
        jogoAtivo = false;
        
        // Exibe o alerta com um pequeno atraso para o simbolo ('X' ou 'O') aparecer na tela antes
        setTimeout(() => {
            alert(`Parabéns! O jogador ${vencedor} (${jogadorAtual}) venceu a partida!`);
        }, 100);
        return;
    }

    if (verificarEmpate()) {
        document.getElementById('status').textContent = '🤝 Empate!';
        jogoAtivo = false;
        
        setTimeout(() => {
            alert('Deu velha! O jogo terminou em empate.');
        }, 100);
        return;
    }

    jogadorAtual = jogadorAtual === 'X' ? 'O' : 'X';
    atualizarTextoVez();
}

function verificarVitoria() {
    return combinacoesVitoria.some(combinacao => {
        return combinacao.every(index => casas[index].textContent === jogadorAtual);
    });
}

function verificarEmpate() {
    return [...casas].every(casa => casa.textContent !== '');
}

btnReiniciar.addEventListener('click', reiniciarJogo);

function reiniciarJogo() {
    casas.forEach(casa => {
        casa.textContent = '';
    });
    jogadorAtual = 'X';
    jogoAtivo = true;
    document.getElementById('status').innerHTML = 'Vez de: <span id="nome-vez"></span>';
    atualizarTextoVez();
}

// Inicializa a interface
atualizarTextoVez();