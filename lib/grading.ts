// lib/grading.ts
// ──────────────────────────────────────────────
// Academic Grading Utilities
// Handles grade calculation based on percentage
// as defined in the school's result sheet:
//   A - Distinction (90%+)
//   B - Credit     (70%+)
//   C - Pass       (50%+)
//   F - Fail       (Below 50%)
// ──────────────────────────────────────────────

type Grade = "A" | "B" | "C" | "F";

// Map grade to display label
export const GradeLabel: Record<Grade, string> = {
  A: "Distinction",
  B: "Credit",
  C: "Pass",
  F: "Fail",
};

// Calculate grade from percentage
export function calculateGrade(percentage: number): Grade {
  if (percentage >= 90) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 50) return "C";
  return "F";
}

// Calculate remark from percentage
// These are the performance comments that appear
// in the REMARK column of the result sheet
export function calculateRemark(percentage: number): string {
  if (percentage >= 90) return "An excellent result. Keep it up!";
  if (percentage >= 70) return "A very good performance.";
  if (percentage >= 50) return "A satisfactory result. Can do better.";
  return "Needs significant improvement.";
}

// Calculate total and grade for a single subject
// Returns nulls if any component is missing to avoid
// prematurely assigning an 'F' grade before all scores are entered
export function calculateSubjectResult(
  firstTest: number | null,
  secondTest: number | null,
  exam: number | null
): {
  total: number | null;
  percentage: number | null;
  grade: Grade | null;
  remark: string;
} {
  // Guard against partial data — don't calculate until all scores are in
  if (firstTest === null || secondTest === null || exam === null) {
    return {
      total: null,
      percentage: null,
      grade: null,
      remark: "Incomplete",
    };
  }

  const total = firstTest + secondTest + exam;
  const percentage = Math.round(total * 100) / 100;
  const grade = calculateGrade(percentage);
  const remark = calculateRemark(percentage);

  return { total, percentage, grade, remark };
}

// Calculate overall result summary (for ResultSummary model)
// Accepts an array of subject totals and returns the cumulative stats
export function calculateResultSummary(
  subjectTotals: (number | null)[]
): {
  totalCumulative: number;
  totalScore: number;
  percentageAvg: number;
  grade: Grade | null;
  remark: string;
} {
  // Filter out incomplete subjects
  const validTotals = subjectTotals.filter((s): s is number => s !== null);

  // Guard against cold-start / empty state when no terms are finalized yet
  if (validTotals.length === 0) {
    return {
      totalCumulative: 0,
      totalScore: 0,
      percentageAvg: 0,
      grade: null,
      remark: "No results recorded yet.",
    };
  }

  const totalCumulative = validTotals.length * 100; // Each subject max 100
  const totalScore = validTotals.reduce((sum, score) => sum + score, 0);
  const percentageAvg =
    totalCumulative > 0
      ? Math.round((totalScore / totalCumulative) * 100 * 100) / 100
      : 0;
  const grade = calculateGrade(percentageAvg);
  const remark = calculateRemark(percentageAvg);

  return { totalCumulative, totalScore, percentageAvg, grade, remark };
}