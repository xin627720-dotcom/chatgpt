# App v0.2 upgrade PRD

Read these files directly:
- docs/PRD_v0.2.md
- data/vocab-basic-700-enhanced.json
- data/vocab-core-2050-enhanced.json

Goal: upgrade the existing Gaokao English vocabulary PWA into a richer personal learning app.

Required features:
1. Prefer enhanced vocab JSON files and stay compatible with old vocab JSON files.
2. Add a word detail page with word, Chinese meaning, part of speech, English definition, root/affix, synonyms, antonyms, collocations, examples, exam meanings, favorite and speak buttons.
3. Upgrade learning mode: show word first, reveal meaning/examples/collocations, keep known/fuzzy/unknown, add speak/favorite/detail buttons.
4. Fix quiz progress: persist quiz progress in localStorage; do not restart from the first words after leaving; correct words enter review/mastered progress; wrong words enter wrong-word list; avoid fixed allWords.slice(0,20).
5. Add spelling test mode.
6. Add speechSynthesis Web Speech API support for words and examples.
7. Add spaced review rules: unknown 10 minutes; fuzzy 1 day; known 3 days; three known reviews become mastered; mastered review again after 7 days.
8. Dashboard: today new words, due reviews, mastered count, wrong count, favorite count, daily task, streak, points.
9. Upgrade wrong words list with wrong count, last wrong time, next review time, detail, relearn, mark mastered, remove.
10. Add check-in, streak and points stored in localStorage.
11. Keep PWA, manifest, service worker, Vercel deployment.
12. Mobile-first UI with clear bottom nav and friendly empty states.

Run npm install, npm run typecheck, npm run build. Fix all errors. Create a PR and say whether it is safe to merge.