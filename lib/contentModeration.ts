import { Filter } from "bad-words";

// Initialize the bad-words filter
const profanityFilter = new Filter();

// Add additional words to the filter if needed
const additionalWords: string[] = [
  // Add any additional inappropriate words not covered by bad-words
  "nsfw",
  "xxx",
  "adult",
];

if (additionalWords.length > 0) {
  profanityFilter.addWords(...additionalWords);
}

// Patterns that might indicate spam or inappropriate content
const suspiciousPatterns = [
  /\b(buy|sell|cheap|discount|free money|cash|loan|credit)\b/gi, // Spam patterns (more specific)
  /\b(click here|visit now|website\.com|http|www\.[\w-]+\.com)\b/gi, // More specific link spam
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, // Email patterns (more precise)
  /\b[0-9]{3}[-.]\s*[0-9]{3}[-.]\s*[0-9]{4}\b/g, // Phone numbers
];

export interface ModerationResult {
  isClean: boolean;
  filteredText: string;
  detectedWords: string[];
  reasons: string[];
}

/**
 * Moderates text content for inappropriate language and spam
 * @param text The text to moderate
 * @returns ModerationResult with clean status and filtered text
 */
export function moderateContent(text: string): ModerationResult {
  if (!text || typeof text !== "string") {
    return {
      isClean: true,
      filteredText: text,
      detectedWords: [],
      reasons: [],
    };
  }

  const detectedWords: string[] = [];
  const reasons: string[] = [];
  let filteredText = text;

  // Check for profanity using bad-words library
  if (profanityFilter.isProfane(text)) {
    reasons.push("Inappropriate language detected");
    filteredText = profanityFilter.clean(text);

    // Extract detected words (approximate - bad-words doesn't expose this directly)
    const words = text.toLowerCase().split(/\s+/);
    words.forEach((word) => {
      const cleanWord = word.replace(/[^\w]/g, "");
      if (cleanWord && profanityFilter.isProfane(cleanWord)) {
        detectedWords.push(word);
      }
    });
  }

  // Check for suspicious patterns
  suspiciousPatterns.forEach((pattern) => {
    if (pattern.test(text)) {
      reasons.push("Suspicious content pattern detected");
    }
  });

  // Check for excessive caps (might indicate shouting/spam)
  const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
  if (text.length > 10 && capsRatio > 0.7) {
    reasons.push("Excessive capital letters detected");
  }

  // Check for repeated characters (spam pattern)
  if (/(.)\1{4,}/.test(text)) {
    reasons.push("Repeated character spam detected");
  }

  const isClean = detectedWords.length === 0 && reasons.length === 0;

  return {
    isClean,
    filteredText,
    detectedWords: [...new Set(detectedWords)],
    reasons: [...new Set(reasons)],
  };
}

/**
 * Validates if content is appropriate for posting
 * @param name User's name
 * @param message User's message
 * @returns Object with validation result and error message if any
 */
export function validateGuestbookEntry(name: string, message: string) {
  const nameResult = moderateContent(name);
  const messageResult = moderateContent(message);

  if (!nameResult.isClean) {
    return {
      isValid: false,
      error: "Please use appropriate language in your name.",
      field: "name" as const,
      details: nameResult.reasons,
    };
  }

  if (!messageResult.isClean) {
    return {
      isValid: false,
      error:
        "Please keep your message family-friendly. Inappropriate language is not allowed.",
      field: "message" as const,
      details: messageResult.reasons,
    };
  }

  // Additional length checks
  if (name.trim().length < 1) {
    return {
      isValid: false,
      error: "Name is required.",
      field: "name" as const,
      details: [],
    };
  }

  if (name.trim().length > 100) {
    return {
      isValid: false,
      error: "Name must be less than 100 characters.",
      field: "name" as const,
      details: [],
    };
  }

  if (message.trim().length < 1) {
    return {
      isValid: false,
      error: "Message is required.",
      field: "message" as const,
      details: [],
    };
  }

  if (message.trim().length > 1000) {
    return {
      isValid: false,
      error: "Message must be less than 1000 characters.",
      field: "message" as const,
      details: [],
    };
  }

  return {
    isValid: true,
    error: null,
    field: null,
    details: [],
  };
}
