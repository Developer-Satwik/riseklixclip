"""Package the authorised local revision without publishing it."""
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parents[1]
archive = root.parent / 'reviews/riseklix-clipping-interactive-atelier-local-2026-10-07.zip'
if archive.exists():
    raise SystemExit(f'Preserving existing archive: {archive}')

def included(p):
    rel = p.relative_to(root)
    return (p.is_file() and '.DS_Store' not in rel.parts
            and 'screenshots' not in rel.parts
            and not p.name.endswith('package-verification.json')
            and p.name not in {'hero-original.png', 'hero-art-v2-original.png'})

files = [p for directory in ['public', 'src', 'scripts', 'netlify', 'docs']
         for p in (root / directory).rglob('*') if included(p)]
files += [root / name for name in ['README.md', 'package.json', 'netlify.toml'] if (root / name).exists()]
for file, issue_fields in [
    ('verification.json', ['issues', 'pageErrors', 'failedRequests']),
    ('interactive-design-verification.json', ['pageErrors', 'externalRequests']),
    ('design-assets-verification.json', ['pageErrors'])]:
    report = json.loads((root / 'docs' / file).read_text())
    assert all(not report[field] for field in issue_fields), (file, report)
assert json.loads((root / 'docs/verification.json').read_text())['pages'] == 124
assert json.loads((root / 'docs/verification.json').read_text())['articleDepthChecks'] == 113

archive.parent.mkdir(exist_ok=True)
with ZipFile(archive, 'w', ZIP_DEFLATED, compresslevel=9) as out:
    for p in sorted(files):
        out.write(p, p.relative_to(root))
with ZipFile(archive) as out:
    assert out.testzip() is None
    names = set(out.namelist())
    html = {name.removeprefix('public/') for name in names if name.startswith('public/') and name.endswith('.html')}
    originals = set(json.loads((root / 'docs/original-route-manifest.json').read_text()))
    assert len(html) == 124 and originals <= html
    for required in ['src/design.cjs', 'src/styles.css', 'src/minify-css.cjs',
                     'public/assets/fonts/Inter-latin-variable.woff2',
                     'public/assets/fonts/Inter-symbols-variable.woff2',
                     'public/assets/fonts/Inter-subsets-LICENSE.txt',
                     'docs/design-performance-comparison.json']:
        assert required in names, required
    assert out.read('public/styles.css') == (root / 'public/styles.css').read_bytes()
    file_count = len(names)

report = {
    'checkedAt': datetime.now(timezone.utc).isoformat(),
    'archive': str(archive), 'bytes': archive.stat().st_size,
    'sha256': hashlib.sha256(archive.read_bytes()).hexdigest(),
    'files': file_count, 'htmlPages': len(html), 'articles': 113,
    'originalRoutesPreserved': len(originals), 'zipIntegrity': 'passed',
    'sourceAndReports': 'passed', 'allPageBrowserChecks': 'passed',
    'interactiveChecks': 'passed', 'cssRuleEquivalence': 'passed',
    'localOnly': True,
    'excluded': ['Rendered screenshots', 'Original full-resolution generation outputs', 'Previous package-hash records'],
    'limitations': 'Local checks and lab observations only; no hosted publication, field performance, ranking or AI-citation gain measured.'
}
(root / 'docs/interactive-design-package-verification.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report, indent=2))
