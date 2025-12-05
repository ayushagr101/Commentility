# Heuristic Sentiment Analyzer

A simple JavaScript-based sentiment analyzer using heuristic rules, designed for YouTube comment sentiment classification.

## Features

- **Word-based scoring**: Positive and negative word lexicon with weighted scores
- **Negation handling**: Detects "not", "no", "never" and flips sentiment
- **Intensifiers**: Boosts scores for words like "very", "extremely", "so"
- **Punctuation analysis**: Exclamation marks and question marks add context
- **Emoji support**: Recognizes common sentiment emojis

## Quick Start

```powershell
cd mock_heurisitcsentiment
node runAnalyzer.js
```

## Output Format

```
Comment: "I love this video!"
Sentiment: Positive
Confidence: 0.92
Score: 2.0
---
```

## How It Works

1. Tokenizes comment into words
2. Scores each word based on sentiment lexicon
3. Applies intensifiers (multiplies by 1.5)
4. Applies negations (reverses sentiment if preceded by negation word)
5. Adjusts for punctuation (! and ?)
6. Maps final score to Positive / Neutral / Negative
7. Calculates confidence (0-1) based on accumulated score magnitude

## Sample Comments

See `comments.json` for test data.
