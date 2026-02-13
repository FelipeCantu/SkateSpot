import type { UserTier } from '../types/models';

export const TIER_THRESHOLDS: Record<UserTier, number> = {
  rookie: 0,
  amateur: 100,
  pro: 500,
  legend: 1000,
};

export function calculateTier(points: number): UserTier {
  if (points >= TIER_THRESHOLDS.legend) return 'legend';
  if (points >= TIER_THRESHOLDS.pro) return 'pro';
  if (points >= TIER_THRESHOLDS.amateur) return 'amateur';
  return 'rookie';
}

export const TIER_COLORS: Record<UserTier, string> = {
  rookie: '#9CA3AF',
  amateur: '#3B82F6',
  pro: '#8B5CF6',
  legend: '#F59E0B',
};
