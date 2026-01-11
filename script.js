/*
 * script.js — Interações de UI e helpers (arquivo não-minificado)
 * Seções editáveis:
 *  - Animação do slider: conteúdo em `index.html` (#habilidades-slider) e botão de controle `#toggle-play`.
 *  - Toggle de formação: alterna `.content.expanded` e mostra `.modulos-concluidos`.
 *  - Redirecionamento de hash: redireciona links com hash para `index.html#hash` quando o alvo não existe; ajuste `indexPath` se necessário.
 *  - Easter egg: clique na foto (7 cliques) aciona a nuvem de sucesso.
 *  - Espelho: clona `<main>` em `#espelho` (scripts removidos para evitar reexecução).
 *  - Tema: alterna `theme-light` e persiste escolha em localStorage.
 *  - Repositórios fixados: edite o array `pinnedRepos` no final para alterar os cards.
 */

// ===== Animação do slider de habilidades =====
const slider = document.getElementById("habilidades-slider");
const toggleButton = document.getElementById("toggle-play");
let animando = true;

// Duplica o conteúdo para rolar infinitamente (sempre ativa)
if (slider) {
    if (!slider.dataset.duplicated) {
        slider.innerHTML += slider.innerHTML;
        slider.dataset.duplicated = "true";
    }
} else {
    console.warn("habilidades-slider não encontrado no documento.");
}  

if (toggleButton) {
    toggleButton.addEventListener("click", () => {
        animando = !animando;
        if (slider) slider.style.animationPlayState = animando ? "running" : "paused";
        toggleButton.textContent = animando ? "⏸️" : "▶️";
        toggleButton.title = animando ? "Pausar animação" : "Retomar animação";
    });
} else {
    console.warn("toggle-play não encontrado no documento.");
}

// ===== Expansão de módulos da formação acadêmica =====
// Garante que o botão atualize o estado aria-expanded e altere o ícone
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll(".toggle-detalhes").forEach(botao => {
        // estado inicial
        botao.setAttribute('aria-expanded', 'false');
        botao.addEventListener("click", () => {
            const content = botao.closest(".content");
            if (!content) return;
            const expanded = content.classList.toggle("expanded");
            botao.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            botao.textContent = expanded ? '▲' : '▼';
        });
    });
});

// Corrige links com hash em páginas internas — redireciona para index.html#id se o alvo não existir na página atual
// AVISO: Se o site estiver em um subpath (ex.: GitHub Pages), ajuste `indexPath` abaixo (pode usar '/index.html' ou caminho absoluto).
document.addEventListener('click', (event) => {
    const a = event.target.closest('a[href^="#"]');
    if (!a) return;
    const hash = a.getAttribute('href');
    if (!hash || hash === '#') return;
    if (document.querySelector(hash)) return; // elemento existe na página atual
    event.preventDefault();
    const indexPath = window.location.pathname.replace(/\/[^\/]*$/,'/index.html');
    window.location.href = indexPath + hash;
});

// ===== Easter egg: clique na foto 7 vezes =====
const avatar = document.getElementById("avatar");
const nuvem = document.getElementById("nuvem-sucesso");
let clickCount = 0;
let clickTimer = null;

if (avatar && nuvem) {
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
} else {
    if (!avatar) console.warn("avatar não encontrado no documento.");
    if (!nuvem) console.warn("nuvem-sucesso não encontrado no documento.");
} 

const espelho = document.getElementById("espelho");

if (espelho) {
    // clone apenas a tag main para reduzir peso
    const origem = document.querySelector("main") || document.body;
    const clone = origem.cloneNode(true);

    // Evita loop infinito: remove o espelho de dentro dele mesmo
    const fakeEspelho = clone.querySelector("#espelho-card");
    if (fakeEspelho) fakeEspelho.remove();

    // Remover scripts no clone para evitar reexecução
    clone.querySelectorAll("script").forEach(s => s.remove());

    espelho.appendChild(clone);
}

// ===== Theme toggle (GitHub-like light/dark) =====
const themeToggle = document.getElementById('theme-toggle');
function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'light') {
        root.classList.add('theme-light');
        themeToggle && (themeToggle.textContent = '🌞');
    } else {
        root.classList.remove('theme-light');
        themeToggle && (themeToggle.textContent = '🌙');
    }
    localStorage.setItem('site-theme', theme);
}

// Inicializa o tema salvo (default dark)
const savedTheme = localStorage.getItem('site-theme') || 'dark';
applyTheme(savedTheme);

themeToggle && themeToggle.addEventListener('click', () => {
    const current = localStorage.getItem('site-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
});

// ===== Renderização de repositórios (estáticos) =====
// AVISO: Edite o array `pinnedRepos` abaixo para alterar os itens exibidos em 'Pinned Repositories' (name, url, desc, stars, lang).
const pinnedRepos = [
    {name: 'TravelMIngo', url: 'https://github.com/KuromoriOficial/TravelMIngo', desc: 'Projeto de TCC — app de viagens', stars: 12, lang: 'HTML'},
    {name: 'Portfolio', url: 'https://github.com/KuromoriOficial/KuromoriOficial', desc: 'Meu portfólio pessoal', stars: 45, lang: 'HTML'},
    {name: 'Dev-Utils', url: '#', desc: 'Ferramentas e scripts úteis', stars: 7, lang: 'JavaScript'},
    {name: 'Modpack', url: 'https://github.com/KuromoriOficial/Modpack', desc: 'Site para divulgar servidor (Modpack)', stars: 0, lang: 'HTML'},
    {name: 'project_curso_ciee', url: 'https://github.com/KuromoriOficial/project_curso_ciee', desc: 'Projeto web para CIEE — divulgação social', stars: 0, lang: 'HTML'},
    {name: 'ProjetoExtra1', url: '#', desc: 'Projeto extra: adicione detalhes aqui.', stars: 0, lang: 'HTML'},
    {name: 'ProjetoExtra2', url: '#', desc: 'Projeto extra: adicione detalhes aqui.', stars: 0, lang: 'JavaScript'}
];

// Accessibility: ensure skill dots are keyboard-focusable and labelled
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.skill-dot[data-level]').forEach(el => {
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
        el.setAttribute('role', 'img');
        if (!el.hasAttribute('aria-label') && el.dataset.level) el.setAttribute('aria-label', el.dataset.level);
    });
});

function renderPinned() {
    const container = document.getElementById('repos-container');
    if (!container) return;
    container.innerHTML = '';
    pinnedRepos.forEach(r => {
        const card = document.createElement('div');
        card.className = 'repo-card';
        card.innerHTML = `<h3><a href="${r.url}" target="_blank" rel="noopener">${r.name}</a></h3>
                          <p class="repo-meta">${r.desc}</p>
                          <p class="repo-meta">⭐ ${r.stars} • ${r.lang}</p>`;
        container.appendChild(card);
    });
}

renderPinned();


