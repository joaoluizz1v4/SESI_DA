// --- DADOS DOS PRODUTOS DO CARDÁPIO ---
const produtos = [
  {
    id: 1,
    nome: "X-Salada Especial",
    categoria: "lanches",
    preco: 22.00,
    descricao: "Hambúrguer artesanal 150g, queijo prato, alface, tomate e maionese da casa.",
    imagem: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"
  },
  {
    id: 2,
    nome: "X-Bacon Supremo",
    categoria: "lanches",
    preco: 26.50,
    descricao: "Hambúrguer 150g, muito bacon crocante, queijo cheddar e molho barbecue.",
    imagem: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400"
  },
  {
    id: 3,
    nome: "Coca-Cola Lata 350ml",
    categoria: "bebidas",
    preco: 6.00,
    descricao: "Geladinha para acompanhar seu lanche.",
    imagem: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400"
  },
  {
    id: 4,
    nome: "Suco Natural de Laranja 500ml",
    categoria: "bebidas",
    preco: 9.00,
    descricao: "Feito na hora, 100% fruta sem adição de água.",
    imagem: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400"
  },
  {
    id: 5,
    nome: "Batata Frita C/ Queijo e Bacon",
    categoria: "porcoes",
    preco: 28.00,
    descricao: "Porção de 400g de batata palito, coberta com cheddar e bacon picado.",
    imagem: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400"
  },
  {
    id: 6,
    nome: "Pudim de Leite Condensado",
    categoria: "sobremesas",
    preco: 8.50,
    descricao: "Fatia generosa de pudim caseiro bem lisinho.",
    imagem: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=400"
  }
];

// VARIÁVEIS DE ESTADO
let carrinho = [];
let usuarioLogado = null;
const taxaEntrega = 5.00;

// ELEMENTOS DOM
const gridProdutos = document.getElementById('grid-produtos');
const carrinhoSidebar = document.getElementById('carrinho-sidebar');
const overlay = document.getElementById('overlay');
const btnAbrirCarrinho = document.getElementById('btn-abrir-carrinho');
const btnFecharCarrinho = document.getElementById('btn-fechar-carrinho');
const carrinhoItensContainer = document.getElementById('carrinho-itens');
const carrinhoQtdSpan = document.getElementById('carrinho-qtd');
const subtotalSpan = document.getElementById('subtotal');
const totalFinalSpan = document.getElementById('total-final');
const btnIrCheckout = document.getElementById('btn-ir-checkout');

// AUTH DOM
const areaUsuario = document.getElementById('area-usuario');
const btnAbrirAuth = document.getElementById('btn-abrir-auth');
const modalAuth = document.getElementById('modal-auth');
const fecharAuth = document.getElementById('fechar-auth');
const abaLogin = document.getElementById('aba-login');
const abaCadastro = document.getElementById('aba-cadastro');
const formLogin = document.getElementById('form-login');
const formCadastro = document.getElementById('form-cadastro');

// CHECKOUT DOM
const modalCheckout = document.getElementById('modal-checkout');
const fecharCheckout = document.getElementById('fechar-checkout');
const formCheckout = document.getElementById('form-checkout');
const selectPagamento = document.getElementById('pagamento');
const boxTroco = document.getElementById('box-troco');

// COMPROVANTE DOM
const modalSucesso = document.getElementById('modal-sucesso');
const conteudoComprovante = document.getElementById('conteudo-comprovante');
const btnFecharSucesso = document.getElementById('btn-fechar-sucesso');

// HISTÓRICO DOM
const btnAbrirHistorico = document.getElementById('btn-abrir-historico');
const modalHistorico = document.getElementById('modal-historico');
const fecharHistorico = document.getElementById('fechar-historico');
const listaPedidosHistorico = document.getElementById('lista-pedidos-historico');

const toast = document.getElementById('toast');

// --- TOAST ---
function mostrarToast(mensagem) {
  toast.textContent = mensagem;
  toast.classList.add('active');
  setTimeout(() => {
    toast.classList.remove('active');
  }, 3000);
}

// --- BANCO DE DADOS (LOCALSTORAGE) ---
function obterUsuarios() {
  return JSON.parse(localStorage.getItem('xtudo_usuarios')) || [];
}

function salvarUsuarios(usuarios) {
  localStorage.setItem('xtudo_usuarios', JSON.stringify(usuarios));
}

function obterPedidos() {
  return JSON.parse(localStorage.getItem('xtudo_pedidos')) || [];
}

function salvarPedidosLocal(pedidos) {
  localStorage.setItem('xtudo_pedidos', JSON.stringify(pedidos));
}

// --- GERENCIAMENTO DE SESSÃO / AUTH ---
function carregarSessao() {
  const sessao = localStorage.getItem('xtudo_usuario_logado');
  if (sessao) {
    usuarioLogado = JSON.parse(sessao);
    renderizarAreaUsuario();
  }
}

function renderizarAreaUsuario() {
  if (usuarioLogado) {
    areaUsuario.innerHTML = `
      <div class="user-badge">
        <i class="fa-solid fa-user-check"></i>
        <span>Olá, <strong>${usuarioLogado.usuario}</strong></span>
        <button class="btn-logout" id="btn-logout" title="Sair"><i class="fa-solid fa-right-from-bracket"></i></button>
      </div>
    `;
    document.getElementById('btn-logout').addEventListener('click', fazerLogout);
  } else {
    areaUsuario.innerHTML = `
      <button class="btn-auth" id="btn-abrir-auth">
        <i class="fa-solid fa-user"></i> Entrar
      </button>
    `;
    document.getElementById('btn-abrir-auth').addEventListener('click', abrirModalAuth);
  }
}

function abrirModalAuth() {
  modalAuth.classList.add('active');
  overlay.classList.add('active');
}

function fecharModalAuth() {
  modalAuth.classList.remove('active');
  overlay.classList.remove('active');
}

if (btnAbrirAuth) btnAbrirAuth.addEventListener('click', abrirModalAuth);
fecharAuth.addEventListener('click', fecharModalAuth);

// TROCA DE ABAS LOGIN / CADASTRO
abaLogin.addEventListener('click', () => {
  abaLogin.classList.add('active');
  abaCadastro.classList.remove('active');
  formLogin.classList.remove('escondido');
  formCadastro.classList.add('escondido');
});

abaCadastro.addEventListener('click', () => {
  abaCadastro.classList.add('active');
  abaLogin.classList.remove('active');
  formCadastro.classList.remove('escondido');
  formLogin.classList.add('escondido');
});

// SUBMIT CADASTRO
formCadastro.addEventListener('submit', (e) => {
  e.preventDefault();
  const usuario = document.getElementById('cad-usuario').value.trim();
  const email = document.getElementById('cad-email').value.trim().toLowerCase();
  const senha = document.getElementById('cad-senha').value;

  const usuarios = obterUsuarios();

  if (usuarios.some(u => u.usuario.toLowerCase() === usuario.toLowerCase())) {
    mostrarToast("Nome de usuário já existe!");
    return;
  }

  if (usuarios.some(u => u.email === email)) {
    mostrarToast("E-mail já está cadastrado!");
    return;
  }

  const novoUsuario = { usuario, email, senha };
  usuarios.push(novoUsuario);
  salvarUsuarios(usuarios);

  // Auto-login após cadastro
  usuarioLogado = novoUsuario;
  localStorage.setItem('xtudo_usuario_logado', JSON.stringify(usuarioLogado));
  renderizarAreaUsuario();
  fecharModalAuth();
  formCadastro.reset();
  mostrarToast("Conta criada com sucesso!");
});

// SUBMIT LOGIN (Aceita Usuário OU E-mail)
formLogin.addEventListener('submit', (e) => {
  e.preventDefault();
  const identificador = document.getElementById('login-identificador').value.trim().toLowerCase();
  const senha = document.getElementById('login-senha').value;

  const usuarios = obterUsuarios();
  const usuarioEncontrado = usuarios.find(
    u => (u.usuario.toLowerCase() === identificador || u.email.toLowerCase() === identificador) && u.senha === senha
  );

  if (!usuarioEncontrado) {
    mostrarToast("Usuário/E-mail ou senha incorretos!");
    return;
  }

  usuarioLogado = usuarioEncontrado;
  localStorage.setItem('xtudo_usuario_logado', JSON.stringify(usuarioLogado));
  renderizarAreaUsuario();
  fecharModalAuth();
  formLogin.reset();
  mostrarToast(`Bem-vindo de volta, ${usuarioLogado.usuario}!`);
});

function fazerLogout() {
  usuarioLogado = null;
  localStorage.removeItem('xtudo_usuario_logado');
  renderizarAreaUsuario();
  mostrarToast("Você saiu da conta.");
}

// --- RENDERIZAR PRODUTOS ---
function renderizarProdutos(lista) {
  gridProdutos.innerHTML = "";

  if (lista.length === 0) {
    gridProdutos.innerHTML = "<p style='grid-column: 1/-1; text-align: center;'>Nenhum item encontrado.</p>";
    return;
  }

  lista.forEach(prod => {
    const card = document.createElement('div');
    card.className = 'card-produto';
    card.innerHTML = `
      <img src="${prod.imagem}" alt="${prod.nome}">
      <div class="card-info">
        <h3>${prod.nome}</h3>
        <p>${prod.descricao}</p>
      </div>
      <div class="card-rodape">
        <span class="preco">R$ ${prod.preco.toFixed(2).replace('.', ',')}</span>
        <button class="btn-add" onclick="adicionarAoCarrinho(${prod.id})">
          <i class="fa-solid fa-plus"></i> Add
        </button>
      </div>
    `;
    gridProdutos.appendChild(card);
  });
}

// --- CONTROLE DO CARRINHO ---
function adicionarAoCarrinho(id) {
  const itemExistente = carrinho.find(item => item.id === id);

  if (itemExistente) {
    itemExistente.qtd += 1;
  } else {
    const prod = produtos.find(p => p.id === id);
    carrinho.push({ ...prod, qtd: 1 });
  }

  atualizarCarrinho();
  mostrarToast("Item adicionado ao carrinho!");
}

function alterarQtd(id, delta) {
  const item = carrinho.find(i => i.id === id);
  if (item) {
    item.qtd += delta;
    if (item.qtd <= 0) {
      carrinho = carrinho.filter(i => i.id !== id);
    }
  }
  atualizarCarrinho();
}

function atualizarCarrinho() {
  carrinhoItensContainer.innerHTML = "";
  let subtotal = 0;
  let totalItens = 0;

  if (carrinho.length === 0) {
    carrinhoItensContainer.innerHTML = '<p class="carrinho-vazio">Seu carrinho está vazio no momento.</p>';
    btnIrCheckout.disabled = true;
  } else {
    btnIrCheckout.disabled = false;

    carrinho.forEach(item => {
      subtotal += item.preco * item.qtd;
      totalItens += item.qtd;

      const div = document.createElement('div');
      div.className = 'item-carrinho';
      div.innerHTML = `
        <div class="item-info">
          <h4>${item.nome}</h4>
          <span>R$ ${item.preco.toFixed(2).replace('.', ',')}</span>
        </div>
        <div class="qtd-controles">
          <button onclick="alterarQtd(${item.id}, -1)">-</button>
          <span>${item.qtd}</span>
          <button onclick="alterarQtd(${item.id}, 1)">+</button>
        </div>
      `;
      carrinhoItensContainer.appendChild(div);
    });
  }

  const total = subtotal > 0 ? subtotal + taxaEntrega : 0;

  carrinhoQtdSpan.textContent = totalItens;
  subtotalSpan.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
  totalFinalSpan.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// DRAWER TOGGLE
function abrirCarrinho() {
  carrinhoSidebar.classList.add('open');
  overlay.classList.add('active');
}

function fecharCarrinhoDrawer() {
  carrinhoSidebar.classList.remove('open');
  overlay.classList.remove('active');
}

btnAbrirCarrinho.addEventListener('click', abrirCarrinho);
btnFecharCarrinho.addEventListener('click', fecharCarrinhoDrawer);

overlay.addEventListener('click', () => {
  fecharCarrinhoDrawer();
  modalCheckout.classList.remove('active');
  modalSucesso.classList.remove('active');
  modalAuth.classList.remove('active');
  modalHistorico.classList.remove('active');
});

// --- BUSCA E FILTROS ---
document.getElementById('campo-busca').addEventListener('input', (e) => {
  const termo = e.target.value.toLowerCase();
  const filtrados = produtos.filter(p => p.nome.toLowerCase().includes(termo) || p.descricao.toLowerCase().includes(termo));
  renderizarProdutos(filtrados);
});

const btnsCategorias = document.querySelectorAll('.btn-categoria');
btnsCategorias.forEach(btn => {
  btn.addEventListener('click', () => {
    btnsCategorias.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const cat = btn.dataset.cat;
    if (cat === 'todos') {
      renderizarProdutos(produtos);
    } else {
      renderizarProdutos(produtos.filter(p => p.categoria === cat));
    }
  });
});

// --- CHECKOUT E CONFIRMAÇÃO ---
btnIrCheckout.addEventListener('click', () => {
  // Preenche nome automaticamente se estiver logado
  if (usuarioLogado) {
    document.getElementById('nome').value = usuarioLogado.usuario;
  }
  fecharCarrinhoDrawer();
  modalCheckout.classList.add('active');
  overlay.classList.add('active');
});

fecharCheckout.addEventListener('click', () => {
  modalCheckout.classList.remove('active');
  overlay.classList.remove('active');
});

selectPagamento.addEventListener('change', (e) => {
  if (e.target.value === 'dinheiro') {
    boxTroco.classList.remove('escondido');
  } else {
    boxTroco.classList.add('escondido');
  }
});

// SUBMIT DO PEDIDO
formCheckout.addEventListener('submit', (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const telefone = document.getElementById('telefone').value;
  const endereco = document.getElementById('endereco').value;
  const bairro = document.getElementById('bairro').value;
  const pagamento = selectPagamento.value;
  const troco = document.getElementById('troco').value;
  const obs = document.getElementById('obs').value;

  const numPedido = Math.floor(1000 + Math.random() * 9000);
  let subtotal = carrinho.reduce((acc, i) => acc + (i.preco * i.qtd), 0);
  let total = subtotal + taxaEntrega;

  const pedidoObj = {
    id: numPedido,
    data: new Date().toLocaleString('pt-BR'),
    usuarioLogado: usuarioLogado ? usuarioLogado.usuario : 'Convidado',
    cliente: nome,
    telefone,
    endereco: `${endereco} - ${bairro}`,
    pagamento,
    itens: [...carrinho],
    subtotal,
    taxaEntrega,
    total
  };

  // Salva pedido no localStorage
  const historico = obterPedidos();
  historico.push(pedidoObj);
  salvarPedidosLocal(historico);

  // Monta comprovante
  let htmlRecibo = `
    <h4>LANCHONETE X-TUDO - PEDIDO #${numPedido}</h4>
    <div class="comprovante-linha"><span>Cliente:</span> <strong>${nome}</strong></div>
    <div class="comprovante-linha"><span>Telefone:</span> <span>${telefone}</span></div>
    <div class="comprovante-linha"><span>Entrega:</span> <span>${endereco} - ${bairro}</span></div>
    <div class="comprovante-divisor"></div>
  `;

  carrinho.forEach(item => {
    htmlRecibo += `
      <div class="comprovante-linha">
        <span>${item.qtd}x ${item.nome}</span>
        <span>R$ ${(item.preco * item.qtd).toFixed(2).replace('.', ',')}</span>
      </div>
    `;
  });

  htmlRecibo += `
    <div class="comprovante-divisor"></div>
    <div class="comprovante-linha"><span>Subtotal:</span> <span>R$ ${subtotal.toFixed(2).replace('.', ',')}</span></div>
    <div class="comprovante-linha"><span>Taxa Entrega:</span> <span>R$ ${taxaEntrega.toFixed(2).replace('.', ',')}</span></div>
    <div class="comprovante-linha" style="font-weight:bold; font-size:1rem;">
      <span>TOTAL:</span> <span>R$ ${total.toFixed(2).replace('.', ',')}</span>
    </div>
    <div class="comprovante-divisor"></div>
    <div class="comprovante-linha"><span>Pagamento:</span> <span>${pagamento.toUpperCase()}</span></div>
  `;

  if (pagamento === 'dinheiro' && troco) {
    const valTroco = parseFloat(troco) - total;
    htmlRecibo += `<div class="comprovante-linha"><span>Troco p/:</span> <span>R$ ${parseFloat(troco).toFixed(2).replace('.', ',')} (Troco: R$ ${valTroco > 0 ? valTroco.toFixed(2).replace('.', ',') : '0,00'})</span></div>`;
  }

  if (obs) {
    htmlRecibo += `<div class="comprovante-linha" style="margin-top:5px;"><span>Obs:</span> <span>${obs}</span></div>`;
  }

  conteudoComprovante.innerHTML = htmlRecibo;
  modalCheckout.classList.remove('active');
  modalSucesso.classList.add('active');

  carrinho = [];
  atualizarCarrinho();
  formCheckout.reset();
  boxTroco.classList.add('escondido');
});

btnFecharSucesso.addEventListener('click', () => {
  modalSucesso.classList.remove('active');
  overlay.classList.remove('active');
  mostrarToast("Obrigado pelo seu pedido!");
});

// --- HISTÓRICO DE PEDIDOS ---
btnAbrirHistorico.addEventListener('click', () => {
  const todosPedidos = obterPedidos();
  
  // Filtra por usuário logado ou mostra geral se não houver filtro estrito
  const meusPedidos = usuarioLogado 
    ? todosPedidos.filter(p => p.usuarioLogado === usuarioLogado.usuario)
    : todosPedidos;

  listaPedidosHistorico.innerHTML = "";

  if (meusPedidos.length === 0) {
    listaPedidosHistorico.innerHTML = "<p style='text-align:center; color:#777; margin:20px 0;'>Nenhum pedido realizado ainda.</p>";
  } else {
    meusPedidos.reverse().forEach(ped => {
      const div = document.createElement('div');
      div.className = 'card-historico';
      const itensTxt = ped.itens.map(i => `${i.qtd}x ${i.nome}`).join(', ');
      
      div.innerHTML = `
        <div class="card-historico-topo">
          <span>Pedido #${ped.id}</span>
          <span>R$ ${ped.total.toFixed(2).replace('.', ',')}</span>
        </div>
        <div class="card-historico-data"><i class="fa-regular fa-calendar"></i> ${ped.data}</div>
        <div class="card-historico-itens">${itensTxt}</div>
      `;
      listaPedidosHistorico.appendChild(div);
    });
  }

  modalHistorico.classList.add('active');
  overlay.classList.add('active');
});

fecharHistorico.addEventListener('click', () => {
  modalHistorico.classList.remove('active');
  overlay.classList.remove('active');
});

// INICIALIZAÇÃO
carregarSessao();
renderizarProdutos(produtos);