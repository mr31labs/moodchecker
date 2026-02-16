# MoodChecker

A privacy-first daily mental wellness self-assessment web app built on validated, peer-reviewed psychological screening instruments. No data is collected, stored, or transmitted &mdash; everything runs entirely in the browser.

## Purpose

MoodChecker is an experiment in making academically validated mental health screening tools accessible through a simple, calming web interface. The aim is to provide individuals with a structured way to check in with themselves daily across three dimensions &mdash; **well-being**, **mood**, and **anxiety** &mdash; using the same brief instruments widely adopted in clinical research and primary care settings.

This is **not** a diagnostic tool. It is a self-reflection aid that uses established screening scales to help users notice patterns in how they feel over time and to encourage them to seek professional support when appropriate.

## Validated Scales Used

All questions are drawn directly from peer-reviewed, clinically validated instruments:

### WHO-5 Well-Being Index
- **5 items** rated on a 6-point Likert scale (0&ndash;5), producing a percentage score from 0&ndash;100
- Developed by the WHO Regional Office in Europe (1998)
- Validated across 30+ languages and 213+ studies
- Sensitivity of 93% and specificity of 83% for depression screening
- **Reference:** Topp, C.W., &Oslash;stergaard, S.D., S&oslash;ndergaard, S., & Bech, P. (2015). The WHO-5 Well-Being Index: A systematic review of the literature. *Psychotherapy and Psychosomatics*, 84(3), 167&ndash;176.

### PHQ-2 (Patient Health Questionnaire-2)
- **2 items** assessing core depressive symptoms over the past two weeks
- Rated on a 4-point frequency scale (0&ndash;3), total score 0&ndash;6
- Clinical threshold &ge;3 (sensitivity 83%, specificity 92%)
- **Reference:** Kroenke, K., Spitzer, R.L., & Williams, J.B.W. (2003). The Patient Health Questionnaire-2: Validity of a two-item depression screener. *Medical Care*, 41(11), 1284&ndash;1292.

### GAD-2 (Generalised Anxiety Disorder-2)
- **2 items** assessing core anxiety symptoms over the past two weeks
- Rated on a 4-point frequency scale (0&ndash;3), total score 0&ndash;6
- Clinical threshold &ge;3 (sensitivity 86%, specificity 83%)
- **Reference:** Kroenke, K., Spitzer, R.L., Williams, J.B.W., Monahan, P.O., & L&ouml;we, B. (2007). Anxiety disorders in primary care: Prevalence, impairment, comorbidity, and detection. *Annals of Internal Medicine*, 146(5), 317&ndash;325.

### Additional References
- L&ouml;we, B., Wahl, I., Rose, M., et al. (2010). A 4-item measure of depression and anxiety: Validation and standardization of the PHQ-4. *Journal of Affective Disorders*, 122(1&ndash;2), 86&ndash;95.
- Hlynsson, J.I. & Carlbring, P. (2024). Diagnostic accuracy and clinical utility of the PHQ-2 and GAD-2. *Frontiers in Psychology*, 15, 1259997.

## Features

- **9 multiple-choice questions** drawn from validated academic instruments (WHO-5 + PHQ-2 + GAD-2)
- **Scoring engine** with clinically derived thresholds and interpretation
- **Personalised suggestions** based on score combinations, citing evidence-based strategies
- **Optional reflection** text area for private journaling
- **Downloadable Markdown report** with timestamped filename &mdash; the user is prompted to download and warned that results will be lost otherwise
- **Crisis resources** for UK, US, EU, Australia, and New Zealand with emergency numbers and helplines
- **Comprehensive legal disclaimer** at entry and in full at the results page
- **Calming UI** based on colour psychology research for mental health applications (soft blues, muted greens, gentle lavenders, warm neutrals)

## Privacy

This app is designed to run on a personal web server with **zero data storage**:

- No cookies, no localStorage, no sessionStorage
- No analytics, tracking, or telemetry
- No server-side processing &mdash; all scoring and analysis happens client-side in the browser
- No data is transmitted to any server at any point
- Results exist only in the browser session; if the user does not download them, they are permanently lost on page close or refresh
- The download produces a local `.md` file on the user's device only

## Design Rationale

### Colour Palette
The colour palette is informed by UX research on colour psychology in health and wellness applications:

- **Soft blues** &mdash; Calm, trust, stability (primary UI)
- **Muted greens** &mdash; Healing, growth (mood section)
- **Gentle lavenders** &mdash; Emotional engagement, mindfulness (anxiety section)
- **Warm neutrals** &mdash; Grounding, non-overstimulating (backgrounds, text)

Sources: UXmatters (2024), *Leveraging the Psychology of Color in UX Design for Health and Wellness Apps*; Fuzzy Math, *The Color Palettes of Mental Healthcare UI*; CogniFit, *Colors That Calm the Mind*.

### Accessibility
- Responsive design for mobile and desktop
- Semantic HTML with ARIA labels
- High contrast text on all backgrounds
- Clear visual feedback on selection

## Project Structure

```
moodchecker/
  index.html   # Single-page app structure with all 9 questions
  style.css    # Responsive styles with research-backed colour palette
  app.js       # Scoring engine, interpretation logic, Markdown export
  README.md    # This file
```

## Running Locally

No build step required. Open `index.html` in any modern browser:

```bash
open index.html
```

Or serve it from any static web server:

```bash
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## Deployment

This is a static site with no dependencies. Deploy to any static hosting provider or personal web server by copying the four files.

## Disclaimer

This application is designed solely for informational and educational purposes. The content provided, including questionnaire results and suggestions, does **not** constitute medical advice, psychological counselling, diagnosis, or treatment of any mental health condition. It does **not** establish a therapist-patient, doctor-patient, or any other professional-client relationship. It is **not** a substitute for the advice, diagnosis, or treatment provided by a licensed and registered mental health professional or healthcare provider. Always seek the advice of a qualified mental health professional with any questions regarding a mental health condition. If you are in crisis, please contact emergency services or a crisis helpline immediately.

## Licence

MIT
