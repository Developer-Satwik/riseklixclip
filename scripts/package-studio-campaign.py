"""Package the verified local revision, excluding secrets and original references."""
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parents[1]
archive = root.parent / 'reviews/riseklix-clipping-studio-and-campaign-local-2026-10-08.zip'
if archive.exists():
    raise SystemExit(f'Preserving existing archive: {archive}')

def included(p):
    rel = p.relative_to(root)
    return (p.is_file() and '.DS_Store' not in rel.parts
            and 'screenshots' not in rel.parts and 'node_modules' not in rel.parts
            and not any(part == '.env' or part.startswith('.env.') for part in rel.parts)
            and not p.name.endswith('package-verification.json')
            and p.name not in {'hero-original.png', 'hero-art-v2-original.png'})

checks = {
    'verification.json': ['issues', 'pageErrors', 'failedRequests'],
    'interactive-design-verification.json': ['pageErrors', 'externalRequests'],
    'design-assets-verification.json': ['pageErrors'],
    'studio-verification.json': ['pageErrors', 'externalRequests'],
    'campaign-browser-verification.json': ['pageErrors', 'externalRequests'],
}
for name, keys in checks.items():
    report = json.loads((root / 'docs' / name).read_text())
    assert all(not report[key] for key in keys), (name, report)
report = json.loads((root / 'docs/verification.json').read_text())
assert report['pages'] == 124 and report['articleDepthChecks'] == 113
assert json.loads((root / 'docs/campaign-api-verification.json').read_text())['liveEmailsSent'] == 0
assert json.loads((root / 'docs/campaign-browser-verification.json').read_text())['liveEmailsSent'] == 0
assert not json.loads((root / 'docs/studio-editorial-preservation.json').read_text())['changed']
assert not any(item['failures'] for item in json.loads((root / 'docs/accessibility-performance.json').read_text())['contrast'])

files = [p for directory in ['public', 'src', 'scripts', 'server', 'netlify', 'docs']
         for p in (root / directory).rglob('*') if included(p)]
files += [root / name for name in ['README.md', 'package.json', 'netlify.toml', '.env.example', '.gitignore']]
archive.parent.mkdir(exist_ok=True)
with ZipFile(archive, 'w', ZIP_DEFLATED, compresslevel=9) as out:
    for p in sorted(files):
        out.write(p, p.relative_to(root))
with ZipFile(archive) as out:
    assert out.testzip() is None
    names = set(out.namelist())
    assert not any(Path(name).name.startswith('.env') and name != '.env.example' for name in names)
    html = {name.removeprefix('public/') for name in names if name.startswith('public/') and name.endswith('.html')}
    originals = set(json.loads((root / 'docs/original-route-manifest.json').read_text()))
    assert len(html) == 124 and originals <= html
    for required in ['src/studio.cjs', 'src/contact.cjs', 'src/contact.css', 'src/styles.css',
                     'public/campaign-enquiry.js', 'public/quick-search.js', 'public/studio-frame.js',
                     'server/campaign-enquiry.mjs', 'netlify/functions/campaign-enquiry.mjs',
                     'scripts/preview.mjs', '.env.example', '.gitignore',
                     'docs/campaign-enquiry-research-2026-10-08.md', 'docs/studio-verification.json']:
        assert required in names, required
    assert out.read('public/styles.css') == (root / 'public/styles.css').read_bytes()
    assert out.read('public/contact.css') == (root / 'public/contact.css').read_bytes()
    file_count = len(names)

report = {
    'checkedAt': datetime.now(timezone.utc).isoformat(),
    'archive': str(archive), 'bytes': archive.stat().st_size,
    'sha256': hashlib.sha256(archive.read_bytes()).hexdigest(),
    'files': file_count, 'htmlPages': len(html), 'articles': 113,
    'originalRoutesPreserved': len(originals), 'zipIntegrity': 'passed',
    'allPageBrowserChecks': 'passed', 'studioAndSearch': 'passed',
    'campaignMockApiAndBrowser': 'passed', 'sampledContrast': 'passed',
    'editorialSourceFilesUnchanged': 75, 'liveEmailsSent': 0, 'localOnly': True,
    'excluded': ['Local environment files and secrets', 'Screenshots', 'Original full-resolution artwork outputs', 'Previous package-hash records'],
    'limitations': 'API key absent. No Resend domain/inbox or live delivery verification. No hosted changes, conversion/field-performance/ranking or AI-citation gains measured.'
}
(root / 'docs/studio-campaign-package-verification.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report, indent=2))
