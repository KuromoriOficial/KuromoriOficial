#!/usr/bin/env python3
"""Otimiza imagens (converte para WebP e cria versões reduzidas) e minifica CSS/JS.
Uso: python tools/optimize_assets.py
"""
from pathlib import Path
from PIL import Image
from rcssmin import cssmin
from rjsmin import jsmin
from tqdm import tqdm

ROOT = Path(__file__).resolve().parents[1]
IMG_DIRS = [ROOT / 'assets' / 'img', ROOT]
IMG_EXTS = ('.jpg', '.jpeg', '.png', '.jfif')

# Config
WEBP_QUALITY = 80
SMALL_WIDTH = 800
LARGE_WIDTH = 1600

converted = []

# Build unique list of image files to avoid duplicates
files = []
seen = set()
for base in IMG_DIRS:
    if not base.exists():
        continue
    for path in sorted(base.rglob('*')):
        if path.is_file() and path.suffix.lower() in IMG_EXTS:
            if path.resolve() in seen:
                continue
            seen.add(path.resolve())
            files.append(path)

if not files:
    print('Nenhuma imagem encontrada para otimização.')
else:
    print(f'Scanning {len(files)} imagens...')
    for path in files:
        print(f'Processando: {path.relative_to(ROOT)}')
        try:
            im = Image.open(path)
            # Trate imagens com paleta (P) convertendo para RGBA para evitar warnings
            if im.mode == 'P':
                im = im.convert('RGBA')
            # Convert to RGB if necessário (quando não há canal alpha)
            elif im.mode in ('RGBA', 'LA'):
                pass
            else:
                im = im.convert('RGB')

            webp_path = path.with_suffix('.webp')
            # Save full-size webp
            im.save(webp_path, 'WEBP', quality=WEBP_QUALITY, method=6)

            # Create small version if larger than SMALL_WIDTH
            w, h = im.size
            if w > SMALL_WIDTH:
                ratio = SMALL_WIDTH / w
                new_size = (SMALL_WIDTH, int(h * ratio))
                small = im.resize(new_size, Image.LANCZOS)
                small_path = path.with_name(path.stem + f'-{SMALL_WIDTH}w.webp')
                small.save(small_path, 'WEBP', quality=WEBP_QUALITY, method=6)

            # Create large capped version if larger than LARGE_WIDTH
            if w > LARGE_WIDTH:
                ratio = LARGE_WIDTH / w
                new_size = (LARGE_WIDTH, int(h * ratio))
                large = im.resize(new_size, Image.LANCZOS)
                large_path = path.with_name(path.stem + f'-{LARGE_WIDTH}w.webp')
                large.save(large_path, 'WEBP', quality=WEBP_QUALITY, method=6)

            converted.append((path, webp_path))
        except Exception as e:
            print(f'Erro ao processar {path}: {e}')

print('\nImagens convertidas:')
for orig, webp in converted:
    print(f' - {orig.relative_to(ROOT)} -> {webp.relative_to(ROOT)}')

# Minificar CSS
css_src = ROOT / 'style.css'
css_dest = ROOT / 'style.min.css'
if css_src.exists():
    css_text = css_src.read_text(encoding='utf-8')
    minified = cssmin(css_text)
    css_dest.write_text(minified, encoding='utf-8')
    print(f'\nCSS minificado: {css_src.name} -> {css_dest.name}')
else:
    print('\nstyle.css não encontrado; pulando minificação de CSS.')

# Minificar JS
js_src = ROOT / 'script.js'
js_dest = ROOT / 'script.min.js'
if js_src.exists():
    js_text = js_src.read_text(encoding='utf-8')
    minified_js = jsmin(js_text)
    js_dest.write_text(minified_js, encoding='utf-8')
    print(f'JS minificado: {js_src.name} -> {js_dest.name}')
else:
    print('script.js não encontrado; pulando minificação de JS.')

print('\nOtimização concluída.')
