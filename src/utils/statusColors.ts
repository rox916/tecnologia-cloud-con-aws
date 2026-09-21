// src/utils/statusColors.ts
import type { StatusLevel } from "../types/cloud";

export const STATUS_HEX: Record<StatusLevel, string> = {
  success: "#16A34A",
  warning: "#F59E0B",
  danger: "#DC2626",
};