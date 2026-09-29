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

const modalCheckout = document.getElementById('modal-checkout');
const fecharCheckout = document.getElementById('fechar-checkout');
const formCheckout = document.getElementById('form-checkout');
const selectPagamento = document.getElementById('pagamento');
const boxTroco = document.getElementById('box-troco');

const modalSucesso = document.getElementById('modal-sucesso');
const conteudoComprovante = document.getElementById('conteudo-comprovante');
const btnFecharSucesso = document.getElementById('btn-fechar-sucesso');
const toast = document.getElementById('toast');

// --- EXIBIR NOTIFICAÇÃO TOAST ---
function mostrarToast(mensagem) {
  toast.textContent = mensagem;
  toast.classList.add('active');
  setTimeout(() => {
    toast.classList.remove('active');
  }, 3000);
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

// --- CHECKOUT E FINALIZAÇÃO DENTRO DO SITE ---
btnIrCheckout.addEventListener('click', () => {
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

// SUBMIT DO FORMULÁRIO (SEM WHATSAPP)
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

  // Monta o comprovante no formato de recibo em HTML
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

  // Atualiza e exibe o modal de comprovante na tela
  conteudoComprovante.innerHTML = htmlRecibo;
  modalCheckout.classList.remove('active');
  modalSucesso.classList.add('active');

  // Limpa o carrinho e reseta o formulário
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

// INICIALIZAR
renderizarProdutos(produtos);