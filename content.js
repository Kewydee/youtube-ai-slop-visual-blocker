// Configuration: Known fingerprint hashes or average RGB profiles for the repeating white-shirt avatar
// Since we are running locally inside a browser extension context, we can analyze thumbnail image data canvas arrays.
const AVATAR_FINGERPRINTS = {
  whiteShirtMinRatio: 0.25, // White pixels vs total thumbnail pixels
  skinToneMinRatio: 0.10,
  centerBias: true
};

function isWhiteShirtSlop(canvas, ctx) {
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  
  let whitePixels = 0;
  let skinPixels = 0;
  let totalPixels = data.length / 4;

  for (let i = 0; i < data.length; i += 16) { // Sample every 4th pixel to keep performance smooth
    const r = data[i];
    const g = data[i+1];
    const b = data[i+2];

    // Detect white/near-white shirt fabric
    if (r > 210 && g > 210 && b > 215 && Math.abs(r - g) < 15 && Math.abs(g - b) < 15) {
      whitePixels += 4;
    }
    // Simple bounding box for common studio skin tone ranges under lighting
    else if (r > 160 && g > 110 && b > 80 && r > g && g > b && (r - g) > 20) {
      skinPixels += 4;
    }
  }

  const whiteRatio = whitePixels / totalPixels;
  const skinRatio = skinPixels / totalPixels;

  // The specific template features a dominant center-right or center-left presentation of the white shirt avatar
  return (whiteRatio > AVATAR_FINGERPRINTS.whiteShirtMinRatio && skinRatio > AVATAR_FINGERPRINTS.skinToneMinRatio);
}

function processThumbnails() {
  // Grab all standard YouTube rich grid items and standard compact renderers
  const videoCards = document.querySelectorAll('ytd-rich-item-renderer, ytd-compact-video-renderer, ytd-video-renderer');

  videoCards.forEach(card => {
    if (card.hasAttribute('data-slop-checked')) return;

    const img = card.querySelector('ytd-thumbnail img');
    if (!img || !img.src || img.src.includes('data:image')) return;

    // We flag it as processing to prevent infinite canvas loops
    card.setAttribute('data-slop-checked', 'processing');

    const scanImg = new Image();
    scanImg.crossOrigin = "Anonymous"; 
    scanImg.src = img.src;

    scanImg.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = 80; // Downscale heavily for rapid pixel parsing performance
      canvas.height = 45;
      const ctx = canvas.getContext('2d');
      
      try {
        ctx.drawImage(scanImg, 0, 0, canvas.width, canvas.height);
        if (isWhiteShirtSlop(canvas, ctx)) {
          console.log("[Slop Blocker] Nuked an instance of the White Shirt AI Guy.");
          card.style.transition = 'all 0.3s ease';
          card.style.opacity = '0';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        } else {
          card.setAttribute('data-slop-checked', 'passed');
        }
      } catch (e) {
        // Cross-origin image constraints sometimes fire if YT uses strict local caching
        card.removeAttribute('data-slop-checked');
      }
    };
  });
}

// Continuously scan the DOM as the user scrolls the endless feed
const observer = new MutationObserver((mutations) => {
  processThumbnails();
});

observer.observe(document.body, { childList: true, subtree: true });
processThumbnails();
