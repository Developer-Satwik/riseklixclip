"""Prepare a read-only public snapshot from an earlier local ZIP for paired tests."""
from pathlib import Path
import sys,tempfile,zipfile
if len(sys.argv)!=2:
    raise SystemExit('Usage: python3 scripts/prepare-design-comparison.py /path/to/baseline.zip')
root=Path(tempfile.mkdtemp(prefix='riseklix-design-ab-'))
needed={'public/styles.css','public/script.js','public/index.html','public/resources/index.html','public/compare/video-clipping-vs-video-editing-vs-ugc-india.html'}
with zipfile.ZipFile(sys.argv[1]) as archive:
    names=set(archive.namelist())
    if not needed.issubset(names): raise SystemExit('Baseline ZIP is missing required public files.')
    for name in names:
        if name not in needed and not name.startswith('public/assets/'): continue
        rel=Path(name)
        if rel.is_absolute() or '..' in rel.parts: raise SystemExit('Unsafe archive path.')
        if name.endswith('/'): continue
        target=root/rel
        target.parent.mkdir(parents=True,exist_ok=True)
        target.write_bytes(archive.read(name))
Path('/tmp/riseklix-design-ab-root.txt').write_text(str(root))
print(root/'public')
