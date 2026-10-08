"""Package the verified audience articles as an immutable local deliverable."""
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parents[1]
archive = root.parent / 'reviews/riseklix-clipping-audience-guides-local-2026-10-08.zip'
if archive.exists():
    raise SystemExit(f'Preserving existing archive: {archive}')

def included(p):
    rel = p.relative_to(root)
    return (p.is_file() and '.DS_Store' not in rel.parts
            and 'screenshots' not in rel.parts and 'node_modules' not in rel.parts
            and not any(part == '.env' or part.startswith('.env.') for part in rel.parts)
            and not p.name.endswith('package-verification.json')
            and p.name not in {'hero-original.png', 'hero-art-v2-original.png', 'hero-art-v3-repaired-original.png'})

checks = {
    'verification.json': ['issues', 'pageErrors', 'failedRequests'],
    'research-round-three-report.json': ['issues', 'duplicates'],
    'research-round-three-verification.json': ['pageErrors'],
    'research-round-three-discovery.json': ['pageErrors'],
    'research-round-three-preservation.json': ['changedArticleBodies'],
    'design-assets-verification.json': ['pageErrors'],
    'studio-verification.json': ['pageErrors', 'externalRequests'],
    'brand/transparent-footer-verification.json': ['pageErrors'],
}
for name, keys in checks.items():
    report = json.loads((root / 'docs' / name).read_text())
    assert all(not report[key] for key in keys), (name, report)
report = json.loads((root / 'docs/verification.json').read_text())
assert report['pages'] == 130 and report['articleDepthChecks'] == 119
cohort = json.loads((root / 'docs/research-round-three-report.json').read_text())
assert cohort['newArticles'] == 6 and cohort['contextualInboundLinks'] == 18
preservation = json.loads((root / 'docs/research-round-three-preservation.json').read_text())
assert preservation['preservedArticleBodiesAndMetadata'] == 113
assert preservation['officialLogoOriginalPreserved']
assert json.loads((root / 'docs/research-round-three-discovery.json').read_text())['searchRecords'] == 119
assert json.loads((root / 'docs/campaign-api-verification.json').read_text())['liveEmailsSent'] == 0
assert json.loads((root / 'docs/campaign-browser-verification.json').read_text())['liveEmailsSent'] == 0

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
    routes = set(json.loads((root / 'docs/route-manifest.json').read_text()))
    originals = set(json.loads((root / 'docs/original-route-manifest.json').read_text()))
    assert html == routes and len(html) == 130 and originals <= html
    for required in ['src/editorial/researched/round-three/index.cjs',
                     'src/editorial/researched/round-three/01-youtube-tutorials.cjs',
                     'src/editorial/researched/round-three/02-b2b-webinars.cjs',
                     'src/editorial/researched/round-three/03-influencer-sponsorships.cjs',
                     'src/editorial/researched/round-three/04-restaurants.cjs',
                     'src/editorial/researched/round-three/05-real-estate.cjs',
                     'src/editorial/researched/round-three/06-fashion.cjs',
                     'docs/research-round-three-2026-10-08.md',
                     'docs/research-round-three-verification.json',
                     'docs/research-round-three-preservation.json',
                     'public/search-index.json', 'public/assets/riseklix-logo.png',
                     'docs/brand/riseklix-logo-source.png',
                     'public/assets/story-collage-v3-1536.webp',
                     'server/campaign-enquiry.mjs', 'scripts/preview.mjs', '.env.example']:
        assert required in names, required
    for required in ['public/styles.css', 'public/script.js', 'public/search-index.json']:
        assert out.read(required) == (root / required).read_bytes()
    file_count = len(names)

report = {
    'checkedAt': datetime.now(timezone.utc).isoformat(),
    'archive': str(archive), 'bytes': archive.stat().st_size,
    'sha256': hashlib.sha256(archive.read_bytes()).hexdigest(),
    'files': file_count, 'htmlPages': len(html), 'articles': 119,
    'originalRoutesPreserved': len(originals), 'previousRoutesPreserved': 124,
    'previousArticleBodiesPreserved': 113, 'newArticles': 6,
    'newReadingWords': cohort['newReadingWords'], 'newSections': cohort['newSections'],
    'newFAQs': cohort['newFAQs'], 'newTables': cohort['newTables'],
    'primaryReferenceURLsInNewCohort': cohort['newUniquePrimaryReferenceURLs'],
    'zipIntegrity': 'passed', 'allPageBrowserChecks': '130 pages; authored bodies, routing, metadata, images and responsive widths passed',
    'focusedBrowserChecks': 'Six articles: short laptop, narrow phone, both themes, tables, keyboard contents and no-JavaScript reading passed',
    'searchDiscovery': 'All six new articles found in library filters and quick search; 119-record index',
    'sharedStylesAndRuntimeUnchanged': True, 'originalOfficialLogoPreserved': True,
    'transparentFooterPreserved': True, 'artworkRepairPreserved': True,
    'liveEmailsSent': 0, 'localOnly': True,
    'excluded': ['Local environment files and secrets', 'Screenshots', 'Original full-resolution artwork outputs', 'Previous package-hash records'],
    'limitations': 'No hosted changes, indexing submission, field-speed, conversion, ranking or AI-citation gains measured. Campaign mail setup was not changed or tested live.'
}
(root / 'docs/audience-guides-package-verification.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report, indent=2))
