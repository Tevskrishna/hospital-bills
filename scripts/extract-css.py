#!/usr/bin/env python3
"""Extract inline CSS from index.html into css/ modules (v25 LTS). Cascade order preserved."""
from pathlib import Path
import re

ROOT = Path(__file__).parent.parent
html = (ROOT / "index.html").read_text(encoding="utf-8")
m = re.search(r"<style>\s*(.*?)\s*</style>", html, re.DOTALL)
if not m:
    raise SystemExit("No <style> block found")

lines = [re.sub(r"^    ", "", ln) for ln in m.group(1).splitlines()]
css_dir = ROOT / "css"
css_dir.mkdir(exist_ok=True)

# Sequential slices — concatenation equals original stylesheet (cascade-safe)
SLICES = [
    ("theme.css", 0, 53),
    ("app.css", 53, 336),
    ("components.css", 336, 456),
    ("utilities.css", 456, 681),
    ("animations.css", 681, 789),
    ("responsive.css", 789, len(lines)),
]

for name, start, end in SLICES:
    chunk = "\n".join(lines[start:end]).strip() + "\n"
    (css_dir / name).write_text(chunk, encoding="utf-8")
    print(f"  {name}: {end - start} lines")

links = "\n".join(f'  <link rel="stylesheet" href="css/{name}" />' for name, _, _ in SLICES)
new_html = re.sub(r"  <style>.*?</style>", links, html, count=1, flags=re.DOTALL)

for path in [ROOT / "index.html", ROOT / "hospital-bills.html"]:
    text = path.read_text(encoding="utf-8")
    if "<style>" in text:
        path.write_text(re.sub(r"  <style>.*?</style>", links, text, count=1, flags=re.DOTALL), encoding="utf-8")
        print(f"Updated {path.name}")
