const { createCanvas } = require("canvas");
const fs = require("fs");

/**
 * Generate a word cloud image from word frequency data with no overlaps
 * @param {Object} wordFreq - Object with words as keys and frequencies as values
 */
async function generateWordCloud(wordFreq) {
  const width = 1200;
  const height = 800;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Soft gradient background (cloud-like)
  const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/1.5);
  gradient.addColorStop(0, "#e8f4f8");
  gradient.addColorStop(0.5, "#d4e9f7");
  gradient.addColorStop(1, "#b8ddf1");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Sort words by frequency
  const sortedWords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 60); // Top 60 words

  if (sortedWords.length === 0) {
    console.warn("⚠ No words to generate word cloud");
    return;
  }

  const maxFreq = sortedWords[0][1];
  const minFreq = sortedWords[sortedWords.length - 1][1];

  // Cloud-like color palettes
  const colorPalettes = [
    ["#4A90E2", "#5BA3F5", "#7BB8FF"],  // Sky blues
    ["#6C5CE7", "#A29BFE", "#74B9FF"],  // Purple-blue
    ["#00B894", "#00CEC9", "#55EFC4"],  // Teals
    ["#FF6B9D", "#FD79A8", "#FDCB6E"],  // Warm sunset
    ["#FF7675", "#FD79A8", "#FDCB6E"],  // Coral
  ];

  // Track placed words with bounding boxes
  const placedWords = [];
  
  /**
   * Check if a word position collides with already placed words
   */
  function checkCollision(x, y, width, height, padding = 10) {
    for (const placed of placedWords) {
      if (!(x + width + padding < placed.x ||
            x > placed.x + placed.width + padding ||
            y + height + padding < placed.y ||
            y > placed.y + placed.height + padding)) {
        return true; // Collision detected
      }
    }
    return false;
  }

  /**
   * Try to place a word using spiral positioning
   */
  function tryPlaceWord(word, fontSize, color, opacity) {
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    const metrics = ctx.measureText(word);
    const textWidth = metrics.width;
    const textHeight = fontSize;

    // Start from center and spiral outward
    const centerX = width / 2;
    const centerY = height / 2;
    const maxAttempts = 500;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // Archimedean spiral
      const angle = attempt * 0.15;
      const radius = attempt * 8;
      
      const x = centerX + Math.cos(angle) * radius - textWidth / 2;
      const y = centerY + Math.sin(angle) * radius;

      // Check bounds
      if (x < 50 || x + textWidth > width - 50 || 
          y < 80 || y + textHeight > height - 50) {
        continue;
      }

      // Check collision
      if (!checkCollision(x, y, textWidth, textHeight)) {
        // Place the word
        ctx.save();
        ctx.fillStyle = color;
        ctx.globalAlpha = opacity;
        
        // Soft shadow for cloud effect
        ctx.shadowColor = "rgba(100, 150, 200, 0.3)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        
        ctx.fillText(word, x, y + fontSize);
        ctx.restore();
        
        // Store placement
        placedWords.push({ 
          word, 
          x, 
          y, 
          width: textWidth, 
          height: textHeight 
        });
        
        return true;
      }
    }
    
    return false; // Failed to place
  }

  // Place words starting with largest
  let placedCount = 0;
  sortedWords.forEach(([word, freq], index) => {
    // Scale font size based on frequency
    const fontSize = Math.max(20, Math.min(90, (freq / maxFreq) * 70 + 25));

    // Select color from palette
    const palette = colorPalettes[index % colorPalettes.length];
    const color = palette[Math.floor(Math.random() * palette.length)];
    
    // Opacity based on frequency
    const opacity = 0.75 + (freq / maxFreq) * 0.25;

    // Try to place the word
    if (tryPlaceWord(word, fontSize, color, opacity)) {
      placedCount++;
    }
  });

  console.log(`✓ Placed ${placedCount} out of ${sortedWords.length} words`);

  // Add decorative cloud shapes in background
  ctx.globalAlpha = 0.1;
  for (let i = 0; i < 5; i++) {
    const cloudX = Math.random() * width;
    const cloudY = Math.random() * height;
    const cloudSize = 100 + Math.random() * 150;
    
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(cloudX, cloudY, cloudSize, 0, Math.PI * 2);
    ctx.fill();
  }

  // Reset alpha
  ctx.globalAlpha = 1.0;

  // Add title with cloud styling
  ctx.font = "bold 32px Arial";
  ctx.fillStyle = "#2C3E50";
  ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
  ctx.shadowBlur = 10;
  ctx.fillText("Word Cloud Analysis", 30, 50);

  // Save to file
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync("wordcloud.png", buffer);
  console.log("✓ Word cloud saved as wordcloud.png");
}

module.exports = { generateWordCloud };