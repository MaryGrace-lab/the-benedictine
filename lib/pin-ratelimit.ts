// lib/pin-ratelimit.ts
// Rate limiter for PIN verification — 3 attempts per 15 minutes per student.

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const pinRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "15 m"),
  analytics: true,
  prefix: "ratelimit:pin",
});