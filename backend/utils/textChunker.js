// backend/utils/textChunker.js

/**
 * Split text into overlapping chunks
 * @param {string} text
 * @param {number} chunkSize
 * @param {number} overlap
 * @returns {Array<Object>}
 */
export const chunkText = (text, chunkSize = 500, overlap = 50) => {
  const chunks = [];
  let chunkIndex = 0;

  if (!text || typeof text !== "string") {
    return chunks;
  }

  const cleanedText = text.replace(/\s+/g, " ").trim();
  const paragraphs = cleanedText.split(/\n\s*\n/);

  let currentChunk = [];
  let currentWordCount = 0;

  for (const paragraph of paragraphs) {
    const paragraphWords = paragraph.split(/\s+/);
    const paragraphWordCount = paragraphWords.length;

    // If single paragraph exceeds chunk size, split it by words
    if (paragraphWordCount > chunkSize) {
      if (currentChunk.length > 0) {
        chunks.push({
          content: currentChunk.join("\n\n"),
          chunkIndex: chunkIndex++,
          pageNumber: 0,
        });
        currentChunk = [];
        currentWordCount = 0;
      }

      for (let i = 0; i < paragraphWords.length; i += chunkSize - overlap) {
        const chunkWords = paragraphWords.slice(i, i + chunkSize);
        chunks.push({
          content: chunkWords.join(" "),
          chunkIndex: chunkIndex++,
          pageNumber: 0,
        });

        if (i + chunkSize >= paragraphWords.length) break;
      }
      continue;
    }

    // If adding this paragraph exceeds chunk size, save current chunk
    if (
      currentWordCount + paragraphWordCount > chunkSize &&
      currentChunk.length > 0
    ) {
      chunks.push({
        content: currentChunk.join("\n\n"),
        chunkIndex: chunkIndex++,
        pageNumber: 0,
      });

      // Create overlap from previous chunk
      const prevChunkText = currentChunk.join(" ");
      const prevWords = prevChunkText.split(/\s+/);
      const overlapText = prevWords
        .slice(-Math.min(overlap, prevWords.length))
        .join(" ");

      currentChunk = [overlapText, paragraph.trim()];
      currentWordCount =
        overlapText.split(/\s+/).length + paragraphWordCount;
    } else {
      currentChunk.push(paragraph.trim());
      currentWordCount += paragraphWordCount;
    }
  }

  // MISSING PART (82–88): Add last chunk
  if (currentChunk.length > 0) {
    chunks.push({
      content: currentChunk.join("\n\n"),
      chunkIndex: chunkIndex++,
      pageNumber: 0,
    });
  }

  // Fallback: if no chunks created, split by words
  if (chunks.length === 0 && cleanedText.length > 0) {
    const allWords = cleanedText.split(/\s+/);
    for (let i = 0; i < allWords.length; i += chunkSize - overlap) {
      const chunkWords = allWords.slice(i, i + chunkSize);
      chunks.push({
        content: chunkWords.join(" "),
        chunkIndex: chunkIndex++,
        pageNumber: 0,
      });

      if (i + chunkSize >= allWords.length) break;
    }
  }

  return chunks;
};

/**
 * Find relevant chunks based on keyword matching
 * @param {Array<Object>} chunks
 * @param {string} query
 * @param {number} maxChunks
 * @returns {Array<Object>}
 */
export const findRelevantChunks = (chunks, query, maxChunks = 3) => {
  const stopWords = new Set([
    "the", "is", "at", "which", "on", "a", "an", "and", "or", "but",
    "in", "with", "to", "for", "of", "as", "by", "this", "that", "it",
  ]);

  // Extract and clean query words
  const queryWords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));

  // ✅ MISSING PART (122–141): handle empty query
  if (queryWords.length === 0) {
    return chunks.slice(0, maxChunks).map((chunk) => ({
      content: chunk.content,
      chunkIndex: chunk.chunkIndex,
      pageNumber: chunk.pageNumber,
      _id: chunk._id,
    }));
  }

  const scoredChunks = chunks.map((chunk, index) => {
    const content = chunk.content.toLowerCase();
    const contentWords = content.split(/\s+/).length;
    let score = 0;

    for (const word of queryWords) {
      // Exact match
      const exactMatches =
        (content.match(new RegExp(`\\b${word}\\b`, "g")) || []).length;
      score += exactMatches * 3;

      // Partial match
      const partialMatches =
        (content.match(new RegExp(word, "g")) || []).length;
      score += Math.max(0, partialMatches - exactMatches) * 1.5;
    }

    // Bonus: multiple query words found
    const uniqueWordsFound = queryWords.filter((word) =>
      content.includes(word)
    ).length;

    if (uniqueWordsFound > 1) {
      score += uniqueWordsFound * 2;
    }

    // Normalize score by content length
    const normalizedScore = score / Math.sqrt(contentWords || 1);

    // Small bonus for earlier chunks
    const positionBonus = 1 - (index / chunks.length) * 0.1;

    return {
      content: chunk.content,
      chunkIndex: chunk.chunkIndex,
      pageNumber: chunk.pageNumber,
      _id: chunk._id,
      score: normalizedScore * positionBonus,
      rawScore: score,
      matchedWords: uniqueWordsFound,
    };
  });

  return scoredChunks
    .filter((chunk) => chunk.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.matchedWords !== a.matchedWords)
        return b.matchedWords - a.matchedWords;
      return a.chunkIndex - b.chunkIndex;
    })
    .slice(0, maxChunks);
};
