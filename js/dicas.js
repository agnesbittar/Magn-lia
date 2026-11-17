// Dica do dia: troca o texto (HTML) e alterna a cor da caixa (CSS) a cada clique
const dicas = [
  "Beba bastante água: a pele agradece.",
  "Use protetor solar todos os dias, mesmo em dias nublados.",
  "Lave o rosto com água morna, nunca muito quente.",
  "Retire toda a maquiagem antes de dormir.",
  "Aplique o sérum com a pele ainda levemente úmida.",
  "Troque a fronha do travesseiro com frequência.",
  "Introduza um produto novo de cada vez na rotina."
];

const caixaDica = document.getElementById("caixa-dica");
const textoDica = document.getElementById("texto-dica");
const botaoDica = document.getElementById("botao-dica");
let posicao = 0;

botaoDica.addEventListener("click", function () {
  posicao = (posicao + 1) % dicas.length;          // volta ao início depois da última
  textoDica.textContent = dicas[posicao];          // muda o HTML
  caixaDica.classList.toggle("alternada");         // muda o CSS
});