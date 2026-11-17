// ---------- utilidades ----------
function soDigitos(texto) {
  return texto.replace(/\D/g, "");
}

// ---------- máscaras ----------
function mascaraCPF(valor) {
  const d = soDigitos(valor).slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function mascaraTelefone(valor) {
  const d = soDigitos(valor).slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return "(" + d;
  if (d.length <= 6) return "(" + d.slice(0, 2) + ") " + d.slice(2);
  if (d.length <= 10) return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
  return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
}

// ---------- validadores (devolvem true ou false) ----------
// CPF: confere os 2 dígitos verificadores
function validarCPF(valor) {
  const d = soDigitos(valor);
  if (d.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(d)) return false; // 111.111.111-11 etc. não valem

  function digito(base, pesoInicial) {
    let soma = 0;
    for (let i = 0; i < base.length; i++) {
      soma += Number(base[i]) * (pesoInicial - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  }

  const d1 = digito(d.slice(0, 9), 10);
  const d2 = digito(d.slice(0, 10), 11);
  return d1 === Number(d[9]) && d2 === Number(d[10]);
}

// Telefone brasileiro: DDD (11 a 99) + 8 dígitos (fixo) ou 9 dígitos começando em 9 (celular)
function validarTelefone(valor) {
  const d = soDigitos(valor);
  if (d.length !== 10 && d.length !== 11) return false;
  if (Number(d.slice(0, 2)) < 11) return false;
  if (d.length === 11) return d[2] === "9";
  return /[2-5]/.test(d[2]); // fixo começa com 2 a 5
}

// ---------- regras por tipo de campo ----------
// cada regra devolve uma mensagem de erro, ou "" se estiver tudo certo
const regras = {
  obrigatorio: function (campo) {
    return campo.value.trim() === "" ? "Preencha este campo." : "";
  },
  email: function (campo) {
    if (campo.value.trim() === "") return "Informe seu e-mail.";
    return campo.checkValidity() ? "" : "Digite um e-mail válido, como nome@email.com.";
  },
  cpf: function (campo) {
    if (campo.value.trim() === "") return "Informe seu CPF.";
    return validarCPF(campo.value) ? "" : "CPF inválido. Confira os números.";
  },
  telefone: function (campo) {
    if (campo.value.trim() === "") return "Informe seu telefone.";
    return validarTelefone(campo.value) ? "" : "Telefone inválido. Use o formato (68) 99999-9999.";
  },
  senha: function (campo) {
    if (campo.value === "") return "Informe sua senha.";
    return campo.value.length >= 6 ? "" : "A senha precisa ter pelo menos 6 caracteres.";
  }
};

// valida um campo, mostra a mensagem e pinta a borda
function validarCampo(campo) {
  const regra = regras[campo.dataset.validar];
  const erro = document.getElementById(campo.id + "-erro");
  const mensagem = regra ? regra(campo) : "";

  erro.textContent = mensagem;
  campo.classList.toggle("invalido", mensagem !== "");
  campo.classList.toggle("valido", mensagem === "" && campo.value !== "");
  campo.setAttribute("aria-invalid", mensagem !== "");
  return mensagem === "";
}

// ---------- ligação com a página ----------
// máscaras enquanto a pessoa digita
document.querySelectorAll("[data-mascara]").forEach(function (campo) {
  campo.addEventListener("input", function () {
    campo.value = campo.dataset.mascara === "cpf"
      ? mascaraCPF(campo.value)
      : mascaraTelefone(campo.value);
  });
});

// valida ao sair do campo
document.querySelectorAll("[data-validar]").forEach(function (campo) {
  campo.addEventListener("blur", function () {
    validarCampo(campo);
  });
  // se já estava com erro, revalida enquanto digita
  campo.addEventListener("input", function () {
    if (campo.classList.contains("invalido")) validarCampo(campo);
  });
});

// valida tudo ao enviar
document.querySelectorAll("form").forEach(function (formulario) {
  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault(); // o site não tem servidor: a validação é a demonstração

    const campos = formulario.querySelectorAll("[data-validar]");
    let tudoCerto = true;
    let primeiroErro = null;

    campos.forEach(function (campo) {
      if (!validarCampo(campo)) {
        tudoCerto = false;
        if (!primeiroErro) primeiroErro = campo;
      }
    });

    const mensagem = document.getElementById(
      formulario.id === "form-login" ? "msg-login" : "msg-cadastro"
    );

    if (tudoCerto) {
      mensagem.textContent = formulario.id === "form-login"
        ? "Dados válidos! Login realizado com sucesso."
        : "Cadastro realizado com sucesso! Bem-vinda à Magnólia.";
      mensagem.hidden = false;

      // aprovado: volta para a página inicial depois de 1,5 segundo
      setTimeout(function () {
        window.location.href = "index.html";
      }, 1500);
    } else {
      mensagem.hidden = true;
      primeiroErro.focus(); // leva o foco ao primeiro campo com erro
    }
  });
});

// alterna entre o cartão de login e o de cadastro
function mostrarCartao(qual, focar) {
  const login = document.getElementById("cartao-login");
  const cadastro = document.getElementById("cartao-cadastro");

  login.hidden = qual !== "login";
  cadastro.hidden = qual !== "cadastro";

  if (focar) {
    const ativo = qual === "login" ? login : cadastro;
    ativo.querySelector("input").focus();
  }
}

document.querySelectorAll("[data-mostrar]").forEach(function (botao) {
  botao.addEventListener("click", function () {
    mostrarCartao(botao.dataset.mostrar, true);
  });
});

// permite abrir direto no cadastro com perfil.html#cadastro
if (window.location.hash === "#cadastro") {
  mostrarCartao("cadastro", false);
}

// botão "Mostrar / Ocultar" da senha
document.querySelectorAll(".campo__mostrar").forEach(function (botao) {
  botao.addEventListener("click", function () {
    const campo = document.getElementById(botao.dataset.alvo);
    const mostrando = campo.type === "text";
    campo.type = mostrando ? "password" : "text";
    botao.textContent = mostrando ? "Mostrar" : "Ocultar";
    botao.setAttribute("aria-label", mostrando ? "Mostrar senha" : "Ocultar senha");
  });
});