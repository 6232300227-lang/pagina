#!/usr/bin/env python3
"""
sync_nav.py

Copiar el bloque <nav> de index.html y reemplazar/insertar en los demás
archivos HTML del mismo directorio. También asegura que el CSS del
scrollbar para `.dropdown-content` exista en cada archivo (inserta antes
de </style> si es posible).

Uso: run desde la carpeta `pagina`:
    python3 sync_nav.py
"""
from pathlib import Path
import re
import sys


def extract_nav(index_text: str) -> str:
    m = re.search(r"<nav[\s\S]*?</nav>", index_text, re.IGNORECASE)
    return m.group(0) if m else None


def extract_scroll_css(index_text: str) -> str:
    # Captura los tres selectores usados para estilizar el scrollbar en index.html
    pattern = re.compile(r"(\.dropdown-content::-webkit-scrollbar[\s\S]*?}\s*\.dropdown-content::-webkit-scrollbar-track[\s\S]*?}\s*\.dropdown-content::-webkit-scrollbar-thumb[\s\S]*?})", re.IGNORECASE)
    m = pattern.search(index_text)
    if m:
        return m.group(1)

    # Fallback: un pequeño snippet seguro
    return (
        ".dropdown-content::-webkit-scrollbar {\n"
        "    width: 6px;\n"
        "}\n\n"
        ".dropdown-content::-webkit-scrollbar-track {\n"
        "    background: var(--gray);\n"
        "    border-radius: 10px;\n"
        "}\n\n"
        ".dropdown-content::-webkit-scrollbar-thumb {\n"
        "    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);\n"
        "    border-radius: 10px;\n"
        "}\n"
    )


def main():
    root = Path(__file__).parent
    index_path = root / 'index.html'
    if not index_path.exists():
        print('index.html no encontrado en', root)
        sys.exit(1)

    index_text = index_path.read_text(encoding='utf-8')
    nav_block = extract_nav(index_text)
    if not nav_block:
        print('No se encontró <nav> en index.html')
        sys.exit(1)

    scroll_css = extract_scroll_css(index_text)

    html_files = sorted(root.glob('*.html'))
    updated = []
    skipped = []

    for f in html_files:
        if f.name == 'index.html':
            continue

        txt = f.read_text(encoding='utf-8')
        changed = False

        if re.search(r"<nav[\s\S]*?</nav>", txt, re.IGNORECASE):
            new_txt = re.sub(r"<nav[\s\S]*?</nav>", nav_block, txt, count=1, flags=re.IGNORECASE)
            if new_txt != txt:
                txt = new_txt
                changed = True
                action = 'Replaced'
            else:
                action = 'NoChange'
        else:
            # intentar insertar después de </header>
            if '</header>' in txt:
                txt = txt.replace('</header>', '</header>\n\n' + nav_block, 1)
                changed = True
                action = 'InsertedAfterHeader'
            else:
                skipped.append(f.name)
                action = 'Skipped'

        if changed:
            # asegurar que el CSS del scrollbar exista
            if 'dropdown-content::-webkit-scrollbar' not in txt:
                if '</style>' in txt:
                    txt = txt.replace('</style>', scroll_css + '\n</style>', 1)
                elif '<head>' in txt and '</head>' in txt:
                    # insertar un <style> con el snippet antes de </head>
                    style_block = '<style>\n' + scroll_css + '</style>\n'
                    txt = txt.replace('</head>', style_block + '</head>', 1)
                else:
                    # append al final del archivo
                    txt = txt + '\n<!-- Scrollbar styles added by sync_nav.py -->\n' + '<style>\n' + scroll_css + '</style>\n'

            f.write_text(txt, encoding='utf-8')
            updated.append((f.name, action))

    # Normalizar la regla .dropdown-content en todos los HTML
    canonical_dropdown = (
        ".dropdown-content {\n"
        "    position: absolute;\n"
        "    top: 100%;\n"
        "    left: 0;\n"
        "    background: white;\n"
        "    min-width: 280px;\n"
        "    max-height: 400px;\n"
        "    overflow-y: auto;\n"
        "    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);\n"
        "    border-radius: var(--border-radius);\n"
        "    z-index: 1000;\n"
        "    opacity: 0;\n"
        "    visibility: hidden;\n"
        "    transform: translateY(15px) scale(0.95);\n"
        "    transition: var(--transition);\n"
        "    padding: 15px 0;\n"
        "    border: 1px solid #f0f0f0;\n"
        "    scrollbar-width: thin;\n"
        "    scrollbar-color: var(--primary) var(--gray);\n"
        "}\n\n"
        ".dropdown-content::-webkit-scrollbar {\n"
        "    width: 6px;\n"
        "}\n\n"
        ".dropdown-content::-webkit-scrollbar-track {\n"
        "    background: var(--gray);\n"
        "    border-radius: 10px;\n"
        "}\n\n"
        ".dropdown-content::-webkit-scrollbar-thumb {\n"
        "    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);\n"
        "    border-radius: 10px;\n"
        "}\n"
    )

    for f in html_files:
        if f.name == 'index.html':
            continue
        txt = f.read_text(encoding='utf-8')
        # Replace any .dropdown-content { ... } block with canonical
        new_txt, count = re.subn(r"(?i)\\.dropdown-content\s*\{[\\s\\S]*?\}", canonical_dropdown, txt)
        if count > 0 and new_txt != txt:
            f.write_text(new_txt, encoding='utf-8')
            print(f'Normalized dropdown CSS in: {f.name}')

    for name, act in updated:
        print(f"{act}: {name}")
    for name in skipped:
        print(f"Skipped (no header/nav found): {name}")

    print('\nHecho.')


if __name__ == '__main__':
    main()
