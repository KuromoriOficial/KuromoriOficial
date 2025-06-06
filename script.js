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

// ===== Desenho do "mapa" fictício no canvas =====
const canvas = document.getElementById("meuMapa");
const ctx = canvas.getContext("2d");
ctx.fillStyle = "#161b22";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "#58a6ff";
ctx.font = "20px monospace";
ctx.fillText("Mapa da minha região vai aqui 🗺️", 10, 50);

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
