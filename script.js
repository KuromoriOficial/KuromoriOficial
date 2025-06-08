// ===== Animação do slider de habilidades =====
const slider = document.getElementById("habilidades-slider");
const toggleButton = document.getElementById("toggle-play");
let animando = true;

// Duplica o conteúdo para rolar infinitamente
slider.innerHTML += slider.innerHTML;

toggleButton.addEventListener("click", () => {
    animando = !animando;
    slider.style.animationPlayState = animando ? "running" : "paused";
    toggleButton.textContent = animando ? "⏸️" : "▶️";
    toggleButton.title = animando ? "Pausar animação" : "Retomar animação";
});

// ===== Expansão de módulos da formação acadêmica =====
document.querySelectorAll(".toggle-detalhes").forEach(botao => {
    botao.addEventListener("click", () => {
        const content = botao.closest(".content");
        content.classList.toggle("expanded");
    });
});

// ===== Easter egg: clique na foto 7 vezes =====
const avatar = document.getElementById("avatar");
const nuvem = document.getElementById("nuvem-sucesso");
let clickCount = 0;
let clickTimer = null;

avatar.addEventListener("click", () => {
    avatar.classList.add("shake");
    setTimeout(() => avatar.classList.remove("shake"), 300);

    clickCount++;

    if (clickCount >= 7) {
        const partes = nuvem.querySelectorAll(".bolha, .texto-nuvem");

        // Adiciona classe de visibilidade
        nuvem.classList.add("ativo");

        // Reinicia estilos e força reflow
        partes.forEach(parte => {
            parte.style.opacity = "0";
            parte.style.animation = "none";
            void parte.offsetWidth; // força reflow
            parte.style.opacity = "1";
        });

        // Remove animação de bolhas após delay
        setTimeout(() => {
            nuvem.classList.remove("ativo");

            partes.forEach(parte => {
                parte.style.opacity = "0";
                parte.style.animation = "none";
            });
        }, 4000);

        clickCount = 0;
    }

    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
        clickCount = 0;
    }, 2000);
});

window.addEventListener("load", () => {
    const portfolioCard = document.querySelector('.card:nth-child(2) img');

    if (portfolioCard) {
        html2canvas(document.body).then(canvas => {
            const dataURL = canvas.toDataURL();
            portfolioCard.src = dataURL;
        });
    }
});

const espelho = document.getElementById("espelho");

if (espelho) {
    const clone = document.body.cloneNode(true);

    // Evita loop infinito: remove o espelho de dentro dele mesmo
    const cardRef = document.getElementById("espelho-card");
    const fakeEspelho = clone.querySelector("#espelho-card");
    if (fakeEspelho) fakeEspelho.remove();

    espelho.appendChild(clone);
}

// Esconde o espelho dentro dele mesmo (previne loop infinito)
if (window.self !== window.top) {
    const reflexo = document.querySelector(".espelho-iframe");
    if (reflexo) reflexo.style.display = "none";
}
