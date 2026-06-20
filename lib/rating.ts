// lib/rating.ts
// ──────────────────────────────────────────────
// Social Behaviour Rating Utilities
// Maps the Rating enum to numeric values for
// calculating totalScored and percentageAvg
// ──────────────────────────────────────────────

type Rating = "EXCELLENT" | "GOOD" | "AVERAGE" | "POOR" | "VERY_POOR";

// Map enum to number for calculations
export const RatingMap: Record<Rating, number> = {
  EXCELLENT: 5,
  GOOD: 4,
  AVERAGE: 3,
  POOR: 2,
  VERY_POOR: 1,
};

// Map enum to display label
export const RatingLabel: Record<Rating, string> = {
  EXCELLENT: "Excellent",
  GOOD: "Good",
  AVERAGE: "Average",
  POOR: "Poor",
  VERY_POOR: "Very Poor",
};

// Reverse map: number → Rating
export const NumberToRatingMap: Record<number, Rating> = {
  5: "EXCELLENT",
  4: "GOOD",
  3: "AVERAGE",
  2: "POOR",
  1: "VERY_POOR",
};

// Explicit list of the 10 behaviour traits from the result sheet
// This prevents metadata fields (id, studentId, createdAt, etc.)
// from accidentally being counted in calculations
export const BEHAVIOUR_KEYS = [
  "obedience",
  "honesty",
  "responsibility",
  "selfControl",
  "leadership",
  "relationshipWithOthers",
  "gamesAndSports",
  "health",
  "neatness",
  "manipulativeSkill",
] as const;

// Calculate totalCumulative, totalScored, and percentageAvg
// Only processes the 10 defined behaviour keys, ignores metadata safely
export function calculateSocialBehaviourScore(
  behaviour: Record<string, unknown>
): {
  totalCumulative: number;
  totalScored: number;
  percentageAvg: number;
  remark: string;
} {
  const ratings = BEHAVIOUR_KEYS.map((key) => behaviour[key]).filter(
    (v): v is Rating =>
      typeof v === "string" && Object.prototype.hasOwnProperty.call(RatingMap, v)
  );

  const totalCumulative = ratings.length * 5; // Each trait max 5
  const totalScored = ratings.reduce(
    (sum, rating) => sum + RatingMap[rating],
    0
  );
  const percentageAvg =
    totalCumulative > 0
      ? Math.round((totalScored / totalCumulative) * 100 * 100) / 100
      : 0;

  const remark = calculateBehaviourRemark(percentageAvg);

  return { totalCumulative, totalScored, percentageAvg, remark };
}

// Get remark based on social behaviour percentage
export function calculateBehaviourRemark(percentage: number): string {
  if (percentage >= 80) return "Excellent conduct";
  if (percentage >= 60) return "Good conduct";
  if (percentage >= 40) return "Average conduct";
  if (percentage >= 20) return "Needs improvement";
  return "Poor conduct";
}