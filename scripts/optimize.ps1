# Executa o otimizador de ativos (images -> webp, css/js minificados)
# Recomendado usar o venv do projeto
$python = "${PWD}\.venv\Scripts\python.exe"
if (Test-Path $python) {
    & $python "${PWD}\tools\optimize_assets.py"
} else {
    Write-Error "Python do venv não encontrado em $python. Ative o venv ou execute o script com uma instalação Python." 
}
