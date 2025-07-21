import Parser from "rss-parser";
import fs from "fs";

const RSS_URL = "https://douiri.org/rss.xml";
const parser = new Parser();
/**
 * Formats a feed entry into a string.
 * @param {Entry} entry - The feed entry to format.
 * @returns {string} The formatted feed entry.
 */
const formatFeedEntry = ({ title, link, isoDate }) => {
  const date = isoDate ? new Date(isoDate).toISOString().slice(0, 10) : "";
  return date ? `- [${title}](${link}) - ${date}` : `[${title}](${link})`;
};

const feed = await parser.parseURL(RSS_URL);

// Only take the latest 5 posts
const latestPosts = feed.items.slice(0, 5).map(formatFeedEntry).join("\n");

// Read the current README
let readme = fs.readFileSync("README.md", "utf-8");

// Replace content between markers
const updated = readme.replace(
  /<!-- blog start -->[\s\S]*<!-- blog end -->/,
  `<!-- blog start -->\n${latestPosts}\n<!-- blog end -->`
);

if (updated !== readme) {
  fs.writeFileSync("README.md", updated);
  console.log("✅ README updated.");
} else {
  console.log("ℹ️ No changes to README.");
}
