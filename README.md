# Excel Daily Lab
Static Excel / Business Analyst practice site. Plain HTML, CSS, JS. No backend, no build, no login.

## Features
30 challenges with generated datasets and computed answer keys; spreadsheet-style workspace (build a helper column, answer with formulas evaluated in-browser), answer checking with tolerance; hints, formulas, steps, interpretation, desired output; safe formula playground (no eval); searchable formula reference; filters; streaks, accuracy, badges, resume (LocalStorage, per browser, no cross-device sync).

## Structure
`index.html` · `style.css` · `script.js` (UI) · `data.js` (datasets, tasks, evaluator, reference)

## Test locally
Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.

## Deploy on GitHub Pages
1. On github.com click **New repository** (public), e.g. `excel-daily-lab`.
2. Click **uploading an existing file**, drag all 5 files in, then **Commit changes**.
3. Go to **Settings → Pages**. Under Source choose **Deploy from a branch**, branch `main`, folder `/ (root)`, Save.
4. After ~1 minute open `https://YOUR-USERNAME.github.io/excel-daily-lab/`.

All paths are relative, so the project URL works.

## Add or change a challenge
In `data.js`: add a line to `TITLES` (`Title|Category|Skills`), extend `DSK` and change `30` limits in `script.js` (`%30`, `/30`). To change data edit a generator in `DS` or the seed in `build()`; answers update automatically. Add a new task type by adding a function to `T` and naming it in `COMBOS`.

## Limitations
Challenges share four dataset types and generic task patterns; day-specific skills (XLOOKUP, ABC classification, date math, text cleaning) are described but not all practised as dedicated task types. The playground runs a documented subset of functions only. No charts yet. Progress does not sync between devices.
