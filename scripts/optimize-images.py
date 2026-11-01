"""Export restored masters as bounded, responsive WebP assets."""
import argparse
import io
import json
from pathlib import Path
from PIL import Image

parser = argparse.ArgumentParser()
parser.add_argument('source_directory', type=Path)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
assets = root / 'dist/assets'
sources = json.loads((root / 'qa/image-enhancement-sources.json').read_text())
aliases = {'switchgear': 'after', 'technician': 'maintenance', 'testing': 'control'}
sources.update({alias: sources[name] for alias, name in aliases.items()})
report = []
for name, source in sources.items():
    original = Image.open(args.source_directory / source).convert('RGB')
    for suffix, width, budget in [('-small', 320, 22_000), ('', 640, 60_000), ('-large', 1280, 180_000)]:
        size = (width, round(original.height * width / original.width))
        resized = original.resize(size, Image.Resampling.LANCZOS)
        for quality in range(84, 59, -2):
            encoded = io.BytesIO()
            resized.save(encoded, format='WEBP', quality=quality, method=6)
            if encoded.tell() <= budget:
                break
        assert encoded.tell() <= budget, f'{name}{suffix} exceeds its image budget'
        filename = f'{name}{suffix}.webp'
        (assets / filename).write_bytes(encoded.getvalue())
        with Image.open(assets / filename) as check:
            assert check.size == size and check.format == 'WEBP'
            check.verify()
        report.append({'file': filename, 'width': width, 'height': size[1], 'bytes': encoded.tell(), 'quality': quality})
(root / 'qa/image-sizes.json').write_text(json.dumps(report, indent=2) + '\n')
for width in [320, 640, 1280]:
    subset = [r for r in report if r['width'] == width]
    print(f"{width}px: {len(subset)} assets; average {sum(r['bytes'] for r in subset)//len(subset)//1024} KB; max {max(r['bytes'] for r in subset)//1024} KB")
print(f"All responsive assets: {sum(r['bytes'] for r in report)/1024/1024:.2f} MB (only the selected sizes load)")
