const fs = require("fs");
const { HfInference } = require("@huggingface/inference");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const { generateWordCloud } = require("./wordcloud");

// ---------------- CONFIG -----------------
const HF_TOKEN = process.env.HF_TOKEN || "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";
const hf = new HfInference(HF_TOKEN);
// -----------------------------------------

if (!HF_TOKEN) {
  console.error("❌ HF_TOKEN is not set. Please set your HuggingFace token.");
  process.exit(1);
}

// ---- Load comments file ----
const inputFile = process.argv[2];
if (!inputFile) {
  console.log("⚠ Usage: node sentiment.js comments.json");
  process.exit(1);
}

const comments = JSON.parse(fs.readFileSync(inputFile, "utf8"));

// ---- HF Sentiment API call with retry ----
async function analyzeSentiment(text, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await hf.textClassification({
        model: "cardiffnlp/twitter-xlm-roberta-base-sentiment",
        inputs: text,
      });

      if (result && result.length > 0) {
        const label = result[0].label;
        // Map labels to our format
        if (label.includes("positive") || label === "LABEL_2") return "Positive";
        if (label.includes("negative") || label === "LABEL_0") return "Negative";
        return "Neutral";
      }
      return "Neutral";
    } catch (err) {
      if (err.message && err.message.includes("loading")) {
        console.log(`⏳ Model is loading, waiting 20s... (attempt ${i + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, 20000));
      } else if (i === retries - 1) {
        console.error(`❌ Error analyzing: "${text.substring(0, 50)}..." - ${err.message}`);
        return "Neutral";
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
  return "Neutral";
}

// ---- Stop Words List ----
const STOP_WORDS = new Set([
  "this", "that", "these", "those", "the", "and", "but", "for", "with",
  "from", "into", "about", "after", "before", "between", "through",
  "during", "above", "below", "under", "over", "again", "further",
  "then", "once", "here", "there", "when", "where", "why", "how",
  "all", "both", "each", "few", "more", "most", "other", "some",
  "such", "only", "own", "same", "than", "too", "very", "can",
  "will", "just", "should", "now", "what", "which", "who", "whom",
  "have", "has", "had", "been", "being", "does", "did", "doing",
  "would", "could", "ought", "they", "them", "their", "theirs",
  "you", "your", "yours", "she", "her", "hers", "him", "his",
  "its", "our", "ours", "was", "were", "are", "isn", "wasn",
  "weren", "don", "doesn", "didn", "won", "wouldn", "shan",
  "shouldn", "can", "couldn", "mustn", "needn", "isn't", "aren't",
  "wasn't", "weren't", "haven't", "hasn't", "hadn't", "don't",
  "doesn't", "didn't", "won't", "wouldn't", "shan't", "shouldn't",
  "can't", "cannot", "couldn't", "mustn't", "needn't", "it's",
  "he's", "she's", "that's", "there's", "who's", "what's",
  "let's", "they're", "we're", "you're", "i'm", "we've",
  "they've", "you've", "i've", "isn", "aren", "wasn", "weren",
  "haven", "hasn", "hadn", "wouldn", "shouldn", "couldn",
  "also", "much", "many", "well", "even", "still", "make",
  "made", "get", "got", "like", "really", "think", "know",
  "want", "need", "feel", "seem", "look", "come", "going",
  "thing", "things", "something", "anything", "everything"
]);

// ---- Text Preprocessing ----
function preprocessText(text) {
  return text
    .toLowerCase()
    // Remove emojis and special characters
    .replace(/[\u{1F600}-\u{1F64F}]/gu, "") // Emoticons
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, "") // Misc Symbols
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, "") // Transport
    .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, "") // Flags
    .replace(/[\u{2600}-\u{26FF}]/gu, "")   // Misc symbols
    .replace(/[\u{2700}-\u{27BF}]/gu, "")   // Dingbats
    .replace(/[\u{FE00}-\u{FE0F}]/gu, "")   // Variation Selectors
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, "") // Supplemental Symbols
    .replace(/[\u{1FA70}-\u{1FAFF}]/gu, "") // Symbols and Pictographs Extended-A
    // Remove URLs
    .replace(/https?:\/\/\S+/g, "")
    // Remove mentions and hashtags
    .replace(/@\w+/g, "")
    .replace(/#\w+/g, "")
    // Keep only letters and spaces
    .replace(/[^a-z\s]/g, " ")
    // Normalize whitespace
    .replace(/\s+/g, " ")
    .trim();
}

// ---- Main ----
async function run() {
  let positive = 0, negative = 0, neutral = 0;
  const wordFreq = {};

  console.log("🔍 Analyzing comments...");

  for (const comment of comments) {
    const sentiment = await analyzeSentiment(comment);

    if (sentiment === "Positive") positive++;
    else if (sentiment === "Negative") negative++;
    else neutral++;

    // Process text and extract meaningful words
    const cleanText = preprocessText(comment);
    const words = cleanText.split(/\s+/);
    
    words.forEach(word => {
      // Filter: length > 3, not a stop word, not a number
      if (word.length > 3 && !STOP_WORDS.has(word) && !/^\d+$/.test(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });
  }

  const total = positive + negative + neutral;
  const netSentiment = ((positive - negative) / total).toFixed(2);

  // ---- Save sentiment score ----
  fs.writeFileSync("net_sentiment.txt", `Net Sentiment Score: ${netSentiment}`);
  console.log("📌 Net Sentiment Score Saved → net_sentiment.txt");

  // ---- Generate Chart ----
  const chart = new ChartJSNodeCanvas({ width: 800, height: 600 });
  const config = {
    type: "bar",
    data: {
      labels: ["Positive", "Negative", "Neutral"],
      datasets: [
        {
          label: "Sentiment Count",
          data: [positive, negative, neutral],
          backgroundColor: ["green", "red", "gray"],
        },
      ],
    },
  };

  const image = await chart.renderToBuffer(config);
  fs.writeFileSync("sentiment_graph.png", image);
  console.log("📌 Bar Chart Saved → sentiment_graph.png");

  // ---- Generate Word Cloud ----
  await generateWordCloud(wordFreq);
  console.log("☁ Word Cloud Saved → wordcloud.png");

  console.log("\n🎉 Analysis Complete!");
  console.log({ positive, negative, neutral, netSentiment });
}

run();
