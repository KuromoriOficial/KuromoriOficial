Resumo da otimização aplicada

O que foi feito:
- Imagens otimizadas e convertidas para WebP (qualidade 80) — versões reduzidas (-800w, -1600w) quando aplicável.
- Geradas `style.min.css` e `script.min.js` a partir dos arquivos originais.
- Substituído `style.css` e `script.js` por `style.min.css` e `script.min.js` em `index.html`.
- Avatar (`foto.png`) agora tem fallback WebP via `<picture>` (`foto.webp`).
- Criado script Python `tools/optimize_assets.py` para refazer otimizações localmente.
- Script de execução (PowerShell): `scripts/optimize.ps1`.

Como rodar:
- Ative o virtualenv do projeto:
  .\.venv\Scripts\Activate.ps1
- Execute o script de otimização:
  .\scripts\optimize.ps1

Observações:
- Nenhum arquivo original foi removido; os arquivos `.webp` estão ao lado dos originais.
- Recomendo rodar um teste de Lighthouse e, em seguida, revisar o uso de imagens que podem avar mais/menos compressão dependendo do conteúdo.
