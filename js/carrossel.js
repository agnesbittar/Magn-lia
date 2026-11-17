// Carrossel: desliza a faixa de slides com os botões, as bolinhas ou as setas do teclado
const faixa = document.getElementById("carrossel-faixa");
const botaoAnterior = document.getElementById("carrossel-anterior");
const botaoProximo = document.getElementById("carrossel-proximo");
const areaBolinhas = document.getElementById("carrossel-bolinhas");

const slides = faixa.querySelectorAll(".carrossel__slide");
let atual = 0;

// cria uma bolinha para cada slide
slides.forEach(function (slide, i) {
  const bolinha = document.createElement("button");
  bolinha.type = "button";
  bolinha.className = "carrossel__bolinha";
  bolinha.setAttribute("aria-label", "Ir para o slide " + (i + 1));
  bolinha.addEventListener("click", function () {
    irPara(i);
  });
  areaBolinhas.appendChild(bolinha);
});

const bolinhas = areaBolinhas.querySelectorAll(".carrossel__bolinha");

// vai para o slide indicado; o % faz voltar ao início depois do último
function irPara(indice) {
  atual = (indice + slides.length) % slides.length;
  faixa.style.transform = "translateX(-" + atual * 100 + "%)";

  bolinhas.forEach(function (bolinha, i) {
    bolinha.classList.toggle("ativa", i === atual);
  });
}

botaoAnterior.addEventListener("click", function () {
  irPara(atual - 1);
});

botaoProximo.addEventListener("click", function () {
  irPara(atual + 1);
});

// setas do teclado quando o foco está no carrossel
document.getElementById("carrossel").addEventListener("keydown", function (evento) {
  if (evento.key === "ArrowLeft") irPara(atual - 1);
  if (evento.key === "ArrowRight") irPara(atual + 1);
});

irPara(0); // começa no primeiro slide