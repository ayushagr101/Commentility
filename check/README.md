# Sentiment Analysis Tool

This tool analyzes text comments (YouTube, social media, reviews, etc.) for sentiment and generates beautiful visualizations.

## Features

### 🎯 Sentiment Analysis
- Uses HuggingFace's multilingual sentiment analysis model
- Classifies comments as Positive, Negative, or Neutral
- Calculates net sentiment score
- Automatic retry logic for model loading

### 🧹 Advanced Text Preprocessing
- **Stop word removal**: Filters out common words (the, and, but, etc.)
- **Emoji removal**: Cleans all emoji characters for pure text analysis
- **URL removal**: Strips out web links
- **Mention/hashtag removal**: Removes @ mentions and # hashtags
- **Number filtering**: Excludes pure numeric values
- **Minimum word length**: Only includes words longer than 3 characters
- **Case normalization**: Converts all text to lowercase

### 📊 Visualizations
1. **Sentiment Bar Chart** (`sentiment_graph.png`)
   - Shows distribution of positive, negative, and neutral comments
   - Color-coded bars for easy interpretation

2. **Word Cloud** (`wordcloud.png`)
   - Beautiful gradient background
   - Top 60 most frequent meaningful words
   - Dynamic font sizing based on word frequency
   - Colorful palette with multiple color schemes
   - Rotated words for visual variety
   - Shadow effects for depth
   - Spiral layout from center outward

3. **Net Sentiment Score** (`net_sentiment.txt`)
   - Single score indicating overall sentiment
   - Range: -1.0 (very negative) to +1.0 (very positive)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Get a HuggingFace token:**
   - Go to https://huggingface.co/settings/tokens
   - Create a new token (read access is sufficient)
   - Copy the token

3. **Set the environment variable:**
   
   **Windows (PowerShell):**
   ```powershell
   $env:HF_TOKEN="your_token_here"
   ```
   
   **Windows (Command Prompt):**
   ```cmd
   set HF_TOKEN=your_token_here
   ```
   
   **Linux/Mac:**
   ```bash
   export HF_TOKEN=your_token_here
   ```

## Usage

Run the sentiment analysis:

```bash
node sentiment.js comments.json
```

Or use the batch file (Windows):
```cmd
run.bat
```

## Input Format

Create a `comments.json` file with an array of text strings:

```json
[
  "This is amazing!",
  "Not very good.",
  "It's okay, I guess."
]
```

## Output Files

The script generates three files:

1. **net_sentiment.txt** - Overall sentiment score (-1.0 to +1.0)
2. **sentiment_graph.png** - Bar chart showing positive/negative/neutral counts
3. **wordcloud.png** - Beautiful word cloud of most frequent meaningful words

## How It Works

1. **Load Comments**: Reads comments from `comments.json`
2. **Sentiment Analysis**: Analyzes each comment using HuggingFace's AI model
3. **Text Preprocessing**: 
   - Removes emojis, URLs, mentions, hashtags
   - Filters stop words and short words
   - Normalizes text to lowercase
4. **Word Frequency**: Counts occurrences of meaningful words
5. **Visualization**: Generates charts and word cloud
6. **Statistics**: Calculates and saves sentiment metrics

## Example Results

For a dataset of 105 music comments:
- **Positive**: 73 comments
- **Negative**: 29 comments  
- **Neutral**: 3 comments
- **Net Sentiment**: 0.42 (moderately positive)

## Customization

You can customize the analysis by editing `sentiment.js`:

- **Stop words**: Add/remove words from the `STOP_WORDS` set
- **Word count**: Change `.slice(0, 60)` to show more/fewer words
- **Minimum word length**: Modify `word.length > 3` condition
- **Canvas size**: Adjust `width` and `height` in `wordcloud.js`
- **Color palettes**: Edit the `colorPalettes` array in `wordcloud.js`

## Troubleshooting

**Model loading error**: The HuggingFace model may take 20-30 seconds to load on first use. The script will automatically retry.

**No words in word cloud**: Check that your comments contain meaningful text after preprocessing.

**API errors**: Verify your HF_TOKEN is valid and has not expired.
