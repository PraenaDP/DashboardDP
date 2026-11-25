# Validation scope for 1.11.5

Local checks on November 25, 2026 used isolated Brave profiles, fictional data and blocked or simulated network services.

- 85 regression checks passed, covering imports, editing, recovery, content safety, navigation, language selection, bulk selection, and drafts. Browser side-panel checks also passed.
- A clean install loaded 1,309 unique tools, with 129 PhET references. Only public metadata, embed URLs and code, dimensions, catalog IDs, and English/Spanish translations were included. No personal bookmarks, notes, tasks, projects, accounts, or coordinates were included.
- Full backup and restoration preserved the catalog, iframe code, translations, and a test favorite across reloads. The isolated profile accepted 3,276,800 additional characters in localStorage before quota exhaustion; this is not a guaranteed capacity on other profiles.
- Listing the catalog loaded no widget iframes. Opening the library took roughly 0.3–0.8 seconds in local tests. This does not establish performance on a physical 8 GB system.
- Help contains 46 matching articles per language. Search, reading, related topics and last-article restoration were checked. Dictionary checks cannot guarantee that every dynamic interface string is translated.
- Screenshots use fictional data and simulated audit results. No PhET simulation content is shown as promotional material.

## Provider references

The catalog contains links to external tools, not copies of their executables. Providers retain their own licenses:
[PhET](https://phet.colorado.edu/en/licensing/), [Windy](https://account.windy.com/agreements/windy-general-terms-of-use), [Google Maps](https://support.google.com/maps/answer/144361), [NASA Eyes](https://science.nasa.gov/eyes/museums/), [ToolkitsApp](https://www.toolkitsapp.com/fr/embed), [HIFreeTools](https://www.hifreetools.com/widgets), [METER.net](https://www.metercustom.net/), [HaoWordTool](https://haowordtool.com/embed/), [Calculations.tools](https://calculations.tools/embed-tools), [VClock](https://vclock.eu/widgets/), [Widget.us.com](https://widget.us.com/), [GOAT Lab](https://tools.goat-lab.net/en/embed/) and [TechCompare](https://www.techcompare.app/embed/).

Live availability of all URLs and Ko-fi payments were not tested. These checks do not certify security, calculator accuracy, or Chrome Web Store acceptance.
