# YouTube AI Slop Visual Blocker

A lightweight Chromium browser extension (Chrome, Opera, Brave, Edge) designed to automatically hide low-effort, automated AI avatar channels from your YouTube feed using real-time canvas visual analysis.

## 🚫 The Problem

Automated channel factories generate thousands of videos a day using identical stock AI voice and video avatars (such as the viral "Marcus" avatar wearing a white shirt). Because you are browsing logged out, the YouTube recommendation algorithm continuously pushes these high-volume video templates to your feed. Standard keyword or channel blocking fails because new bot channels are spun up daily.

## 🛠️ How It Works

Instead of checking titles or channel names, this extension scans the **visual layout** of video thumbnails as you scroll:
1. It looks for a specific concentration of studio-lit facial/skin tones directly stacked above a solid block of bright white shirt pixels.
2. If a thumbnail matches this specific AI factory template footprint, the extension automatically hides the entire video element from your grid view.
3. This runs dynamically using a `MutationObserver` to ensure your feed stays clean as you infinitely scroll.

## 🚀 Installation Instructions (Manual Developer Mode)

Since this extension is not currently hosted on the official Chrome Web Store, you can install it manually in under a minute:

1. **Download the Code:** Click the green **Code** button at the top of this GitHub repository and select **Download ZIP**.
2. **Extract the Files:** Unzip the downloaded folder somewhere permanent on your computer.
3. **Open Extensions Page:** Open your browser and navigate to the extensions management console:
   * **Chrome:** Go to `chrome://extensions`
   * **Opera / Opera Developer:** Go to `opera://extensions`
   * **Brave:** Go to `brave://extensions`
4. **Enable Developer Mode:** Turn on the **Developer mode** toggle switch in the top-right corner.
5. **Load the Extension:** Click the **Load unpacked** button in the top-left corner.
6. **Select Folder:** Select the unzipped folder containing `manifest.json` and `content.js`.

The blocker is now active and will work seamlessly on YouTube, even when you are logged out.

## 🔒 Privacy & Performance

- **100% Local:** All visual processing happens strictly inside your browser. No data is collected, stored, or sent to any external servers.
- **Optimized Scanning:** Uses a fast canvas sampler that runs passively without causing browser stutter or UI lag.
