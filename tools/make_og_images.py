"""Generate a 1200x630 share image for every Pit article.

    python tools/make_og_images.py            # only articles without an image yet
    python tools/make_og_images.py --force    # regenerate all

Writes src/img/og/<slug>.png (passthrough-copied with src/img). The-pit.11tydata.js points
og:image at that file whenever it exists, so a new post with no image just falls back to
the site-wide /og-image.png until this is rerun. Needs Pillow only; it reads the site's own
self-hosted woff2 fonts, so the images match the site's type.
"""
import pathlib
import re
import sys

from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
PIT = ROOT / "src" / "the-pit"
OUT = ROOT / "src" / "img" / "og"
FONTS = ROOT / "src" / "fonts"

W, H = 1200, 630
PAD = 80
BG = "#081810"
FELT = "#0e2419"
RAIL = "#1c4a30"
MINT = "#35d07a"
BONE = "#edf2ee"
MUTED = "#9fb0a6"


def frontmatter(text):
    m = re.match(r"^---\s*\n(.*?)\n---", text, re.S)
    if not m:
        return {}
    data = {}
    for line in m.group(1).splitlines():
        km = re.match(r'^(\w+):\s*(.*)$', line)
        if km:
            v = km.group(2).strip()
            if len(v) >= 2 and v[0] == v[-1] and v[0] in "\"'":
                v = v[1:-1]
            data[km.group(1)] = v
    return data


def inter(size, weight):
    f = ImageFont.truetype(str(FONTS / "inter-latin-var.woff2"), size)
    try:
        f.set_variation_by_axes([weight])
    except Exception:
        pass
    return f


def serif(size):
    return ImageFont.truetype(str(FONTS / "dm-serif-display-latin.woff2"), size)


def wrap(draw, text, font, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if draw.textlength(trial, font=font) <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def draw_mark(d, cx, cy, r):
    """The ring/chip brand mark: dashed outer ring plus a solid inner ring."""
    s = r / 50.0
    outer, inner, stroke = 44 * s, 28 * s, max(2, round(11 * s))
    d.ellipse([cx - inner, cy - inner, cx + inner, cy + inner], outline=MINT, width=stroke)
    # 8 dashes around the outer ring, matching the SVG's dasharray (about 43% on).
    for i in range(8):
        start = -90 + i * 45 - 9.75
        d.arc([cx - outer, cy - outer, cx + outer, cy + outer], start, start + 19.5, fill=MINT, width=stroke)


def render(title, out_path):
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    # Felt panel with a rail border.
    d.rounded_rectangle([24, 24, W - 24, H - 24], radius=28, fill=FELT, outline=RAIL, width=2)

    # Brand row.
    draw_mark(d, PAD + 22, PAD + 22, 26)
    brand_font = inter(34, 800)
    x = PAD + 58
    d.text((x, PAD + 22), "0", font=brand_font, fill=MINT, anchor="lm")
    x += d.textlength("0", font=brand_font)
    d.text((x, PAD + 22), "stakes", font=brand_font, fill=BONE, anchor="lm")

    eyebrow = inter(24, 650)
    d.text((W - PAD, PAD + 22), "THE PIT", font=eyebrow, fill=MINT, anchor="rm")

    # Title: largest size that fits in 4 lines.
    max_w = W - 2 * PAD
    for size in (76, 70, 64, 58, 52, 48):
        font = serif(size)
        lines = wrap(d, title, font, max_w)
        if len(lines) <= 4:
            break
    line_h = int(size * 1.14)
    block_h = line_h * len(lines)
    top = 175 + max(0, (300 - block_h) // 2)
    for i, line in enumerate(lines):
        d.text((PAD, top + i * line_h), line, font=font, fill=BONE)

    # Footer.
    foot = inter(24, 500)
    d.line([PAD, H - PAD - 34, W - PAD, H - PAD - 34], fill=RAIL, width=2)
    d.text((PAD, H - PAD + 2), "Free casino practice. True odds.", font=foot, fill=MUTED, anchor="lm")
    d.text((W - PAD, H - PAD + 2), "0stakes.com", font=foot, fill=MINT, anchor="rm")

    img.save(out_path, optimize=True)


def main():
    force = "--force" in sys.argv
    OUT.mkdir(parents=True, exist_ok=True)
    made = 0
    for md in sorted(PIT.glob("*.md")):
        out = OUT / (md.stem + ".png")
        if out.exists() and not force:
            continue
        fm = frontmatter(md.read_text(encoding="utf-8"))
        title = fm.get("ogTitle") or fm.get("title")
        if not title:
            continue
        render(title, out)
        made += 1
        print("wrote", out.relative_to(ROOT))
    print(f"{made} image(s) generated")


if __name__ == "__main__":
    main()
