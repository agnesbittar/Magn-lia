// Menu sanduíche: abre e fecha a lista de links em telas pequenas
const botaoMenu = document.getElementById("botao-menu");
const listaLinks = document.getElementById("menu-links");

// abre ou fecha o menu e atualiza o botão (X) e a acessibilidade
function alternarMenu(abrir) {
  listaLinks.classList.toggle("aberto", abrir);
  botaoMenu.classList.toggle("aberto", abrir);
  botaoMenu.setAttribute("aria-expanded", abrir);
  botaoMenu.setAttribute("aria-label", abrir ? "Fechar menu" : "Abrir menu");
}

botaoMenu.addEventListener("click", function () {
  alternarMenu(!listaLinks.classList.contains("aberto"));
});

// fecha ao clicar em um link (útil para âncoras na mesma página)
listaLinks.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    alternarMenu(false);
  });
});

// fecha com a tecla Esc
document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape") alternarMenu(false);
});

// se a tela voltar a ser grande, garante o menu fechado
window.addEventListener("resize", function () {
  if (window.innerWidth > 768) alternarMenu(false);
});