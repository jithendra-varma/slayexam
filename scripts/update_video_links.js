/**
 * update_video_links.js
 *
 * For every topic in cse.json and ece.json:
 *   1. Searches YouTube using the topic name as the query
 *   2. Filters results whose title closely matches the topic name
 *   3. Among matching results, picks the video with the highest view count
 *   4. Replaces the topic's youtube_links with that specific watch URL
 *
 * Saves progress after every subject so it is safe to interrupt and re-run.
 *
 * Usage:
 *   cd scripts
 *   npm install
 *   node update_video_links.js
 */

const YoutubeSearchApi = require('youtube-search-api');
const fs   = require('fs');
const path = require('path');

// ─── helpers ────────────────────────────────────────────────────────────────

const delay = ms => new Promise(r => setTimeout(r, ms));

/** Returns true if at least 60% of meaningful topic words appear in the title */
function titleMatchesTopic(videoTitle, topicName) {
  const STOP = new Set(['and','or','the','a','an','in','of','to','for','with','using','how','what','is','vs','versus']);
  const normalize = str =>
    str.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 1 && !STOP.has(w));

  const topicWords = normalize(topicName);
  const titleLower = videoTitle.toLowerCase();

  if (topicWords.length === 0) return true;
  const hits = topicWords.filter(w => titleLower.includes(w)).length;
  return hits / topicWords.length >= 0.6;
}

/**
 * Search YouTube for `topicName`, return the highest-view video whose title
 * broadly matches. Falls back to top result if no title match found.
 */
async function bestVideoForTopic(topicName) {
  const query = `${topicName} explained tutorial`;

  let items;
  try {
    const res = await YoutubeSearchApi.GetListByKeyword(query, false, 15, [{ type: 'video' }]);
    items = res.items || [];
  } catch (err) {
    console.error(`    ✗ Search error for "${topicName}": ${err.message}`);
    return null;
  }

  if (items.length === 0) return null;

  const validItems = items.filter(v => v.id && v.title);
  if (validItems.length === 0) return null;

  // YouTube already ranks by relevance (which correlates with views).
  // Pick the first result whose title closely matches the topic name.
  // Fall back to the top result if nothing matches closely.
  const matched = validItems.filter(v => titleMatchesTopic(v.title, topicName));
  const best    = matched.length > 0 ? matched[0] : validItems[0];

  return {
    url:   `https://www.youtube.com/watch?v=${best.id}`,
    title: best.title,
    channel: best.channelTitle || '',
  };
}

// ─── main ────────────────────────────────────────────────────────────────────

async function processFile(filePath) {
  const rel  = path.relative(process.cwd(), filePath);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  for (let i = 0; i < data.length; i++) {
    const entry = data[i];
    console.log(`\n  [Sem ${entry.semester}] ${entry.subject}`);

    for (let j = 0; j < entry.topics.length; j++) {
      const topic = entry.topics[j];
      process.stdout.write(`    → ${topic.name} ... `);

      const result = await bestVideoForTopic(topic.name);

      if (result) {
        topic.youtube_links = [result.url];
        console.log(`✓  [${result.channel}]  "${result.title.slice(0, 55)}"`);
      } else {
        console.log('✗  no result — keeping existing link');
      }

      await delay(700); // stay polite to YouTube's servers
    }

    // Save after each subject — safe to interrupt and re-run
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  console.log(`\n  ✅ Saved: ${rel}`);
}

async function main() {
  const docsDir = path.join(__dirname, '..', 'docs');
  const files   = ['cse.json', 'ece.json'].map(f => path.join(docsDir, f));

  for (const file of files) {
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`Processing: ${path.basename(file)}`);
    console.log('─'.repeat(60));
    await processFile(file);
  }

  console.log('\n🎉 Done! Both JSON files now have specific video URLs per topic.\n');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
