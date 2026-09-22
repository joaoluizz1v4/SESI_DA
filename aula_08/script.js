// Executa a verificação ao carregar a página de recuperação de senha
if (window.location.pathname.includes("recuperar_senha.html")) {
    verificarBloqueioRecuperacao();
}

function login() {
    // 1º Acessar o valor digitado nos campos USUARIO e SENHA
    const campo_usuario = document.getElementById("usuario").value;
    const campo_senha = document.getElementById("senha").value;

    // 2º Carregar os valores do localStorage
    const local_usuario = localStorage.getItem("usuario");
    const local_senha = localStorage.getItem("senha");

    // 3º Validar se os valores digitados são iguais aos valores armazenados no localStorage
    if (campo_usuario === local_usuario && campo_senha === local_senha) {
        alert("Login realizado com sucesso! 👍");
        window.location.href = "./home.html"; // Redireciona para a Home
    } else {
        alert("Usuário ou senha inválidos! 👎");
    }
}

function cadastro() {
    // 1º Carregar os campos de cadastro
    const nome = document.getElementById("nome").value;
    const usuario = document.getElementById("cad_usuario").value;
    const senha = document.getElementById("cad_senha").value;
    const palavraPasse = document.getElementById("palavra_passe").value;

    if (!nome || !usuario || !senha || !palavraPasse) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    // 2º Cadastrar os dados no localStorage
    localStorage.setItem("nome", nome);
    localStorage.setItem("usuario", usuario);
    localStorage.setItem("senha", senha);
    localStorage.setItem("palavraPasse", palavraPasse);
    
    // Reseta as tentativas incorretas para novo cadastro
    localStorage.setItem("tentativasIncorretas", "0");

    alert("Cadastro realizado com sucesso!");

    // 3º Redirecionar para a tela de login
    window.location.href = "./login.html";
}

function recuperar_senha() {
    // 1º Carregar os valores dos campos NOME e PALAVRA-PASSE
    const recNomeInput = document.getElementById("rec_nome");
    const recPalavraPasseInput = document.getElementById("rec_palavra_passe");

    const recNome = recNomeInput.value;
    const recPalavraPasse = recPalavraPasseInput.value;

    // 2º Buscar no localStorage os valores
    const localNome = localStorage.getItem("nome");
    const localPalavraPasse = localStorage.getItem("palavraPasse");
    const localSenha = localStorage.getItem("senha");

    let tentativas = parseInt(localStorage.getItem("tentativasIncorretas") || "0");

    // Se já tiver atingido 3 erros, bloqueia de imediato
    if (tentativas >= 3) {
        bloquearRecuperacao();
        return;
    }

    // 3º Comparar os valores
    if (recNome === localNome && recPalavraPasse === localPalavraPasse) {
        alert("Dados confirmados! Sua senha é: " + localSenha);
        localStorage.setItem("tentativasIncorretas", "0"); // Reseta o contador ao acertar
    } else {
        tentativas++;
        localStorage.setItem("tentativasIncorretas", tentativas.toString());

        if (tentativas >= 3) {
            alert("Você errou 3 vezes! O acesso à recuperação de senha foi bloqueado.");
            bloquearRecuperacao();
        } else {
            alert(`Dados incorretos! Você tem mais ${3 - tentativas} tentativa(s).`);
            // Limpa os campos de entrada
            recNomeInput.value = "";
            recPalavraPasseInput.value = "";
        }
    }
}

// Função auxiliar para bloquear os campos de recuperação
function bloquearRecuperacao() {
    const inputNome = document.getElementById("rec_nome");
    const inputPalavraPasse = document.getElementById("rec_palavra_passe");
    const btnRecuperar = document.getElementById("btn_recuperar");

    if (inputNome && inputPalavraPasse && btnRecuperar) {
        inputNome.disabled = true;
        inputPalavraPasse.disabled = true;
        btnRecuperar.disabled = true;
    }
}

// Verifica se os campos devem ser bloqueados ao entrar na tela
function verificarBloqueioRecuperacao() {
    const tentativas = parseInt(localStorage.getItem("tentativasIncorretas") || "0");
    if (tentativas >= 3) {
        // Aguarda carregar o DOM se necessário
        window.addEventListener("DOMContentLoaded", () => {
            bloquearRecuperacao();
            alert("A recuperação de senha está bloqueada por excesso de tentativas.");
        });
    }
}