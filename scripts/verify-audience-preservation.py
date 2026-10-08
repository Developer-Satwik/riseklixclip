"""Compare the audience expansion with the preceding immutable local package."""
import hashlib
import json
import subprocess
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from zipfile import ZipFile

root = Path(__file__).resolve().parents[1]
baseline = root.parent / 'reviews/riseklix-clipping-transparent-logo-local-2026-10-08.zip'

def articles(directory):
    source = "process.stdout.write(JSON.stringify(require('./src/content.cjs').articles))"
    return json.loads(subprocess.check_output(['node', '-e', source], cwd=directory))

def body(article):
    # New contextual recommendations are the sole allowed old-article change.
    return {**article, 'sections': [{k: v for k, v in section.items() if k != 'links'}
                                   for section in article['sections']]}

with ZipFile(baseline) as archive, tempfile.TemporaryDirectory(prefix='riseklix-audience-baseline-') as temporary:
    snapshot = Path(temporary)
    for name in archive.namelist():
        if name.startswith('src/') and not name.endswith('/'):
            target = snapshot / name
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(archive.read(name))
    previous = articles(snapshot)
    current = articles(root)
    by_slug = {article['slug']: article for article in current}
    assert len(previous) == 113 and len(current) == 119
    changed = [article['slug'] for article in previous if body(article) != body(by_slug[article['slug']])]
    assert not changed, changed
    additions = []
    for article in previous:
        revised = by_slug[article['slug']]
        for old_section, new_section in zip(article['sections'], revised['sections']):
            old_links, new_links = old_section.get('links', []), new_section.get('links', [])
            assert new_links[:len(old_links)] == old_links
            additions += [{'from': article['slug'], **link} for link in new_links[len(old_links):]]
    assert len(additions) == 18
    assert all(by_slug[link['slug']].get('researchBatch') == 3 for link in additions)

    changed_sources, unchanged_sources = [], []
    for name in archive.namelist():
        if name.startswith('src/editorial/') and name.endswith('.cjs'):
            (unchanged_sources if (root / name).read_bytes() == archive.read(name) else changed_sources).append(name)
    assert changed_sources == ['src/editorial/researched/index.cjs'], changed_sources
    assets = [name for name in archive.namelist() if name.startswith('public/assets/') and not name.endswith('/')]
    assert all((root / name).read_bytes() == archive.read(name) for name in assets)
    shared = ['src/styles.css', 'public/styles.css', 'public/script.js', 'public/quick-search.js',
              'public/studio-frame.js', 'src/contact.cjs', 'src/contact.css',
              'public/contact.css', 'public/campaign-enquiry.js', 'server/campaign-enquiry.mjs']
    assert all((root / name).read_bytes() == archive.read(name) for name in shared)
    old_routes = set(json.loads(archive.read('docs/route-manifest.json')))
    new_routes = set(json.loads((root / 'docs/route-manifest.json').read_text()))
    assert old_routes <= new_routes and len(new_routes - old_routes) == 6
    assert (root / 'docs/brand/riseklix-logo-source.png').read_bytes() == archive.read('docs/brand/riseklix-logo-source.png')

report = {
    'checkedAt': datetime.now(timezone.utc).isoformat(),
    'baselineArchive': str(baseline),
    'baselineSha256': hashlib.sha256(baseline.read_bytes()).hexdigest(),
    'previousArticles': 113, 'currentArticles': 119,
    'preservedArticleBodiesAndMetadata': len(previous), 'changedArticleBodies': changed,
    'preservedRoutes': len(old_routes), 'addedRoutes': sorted(new_routes - old_routes),
    'appendedContextualLinks': additions,
    'unchangedEditorialSourceFiles': len(unchanged_sources),
    'changedExistingEditorialSourceFiles': changed_sources,
    'changedSourcePurpose': 'Include the third researched cohort in the aggregate index',
    'unchangedPublicAssetFiles': len(assets), 'unchangedSharedFiles': shared,
    'officialLogoOriginalPreserved': True, 'localOnly': True,
    'limitations': 'Content and file integrity comparison; not a field-speed, ranking or citation measurement.'
}
(root / 'docs/research-round-three-preservation.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps({k: report[k] for k in ['preservedArticleBodiesAndMetadata', 'changedArticleBodies',
      'preservedRoutes', 'addedRoutes', 'unchangedEditorialSourceFiles', 'unchangedPublicAssetFiles',
      'officialLogoOriginalPreserved']}, indent=2))
