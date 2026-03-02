export const EVENT_TYPE = {
  CONTEST: 'contest',
  JAM: 'jam',
  MEETUP: 'meetup',
} as const;

export const EVENT_STATUS = {
  UPCOMING: 'upcoming',
  ACTIVE: 'active',
  VOTING: 'voting',
  COMPLETED: 'completed',
} as const;

export const EVENT_CATEGORY = {
  OPEN: 'open',
  FLATGROUND: 'flatground',
  GRINDS: 'grinds',
  BEST_TRICK: 'best-trick',
} as const;

export const CREW_BATTLE_STATUS = {
  ACTIVE: 'active',
  VOTING: 'voting',
  COMPLETED: 'completed',
} as const;
