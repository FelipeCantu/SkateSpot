import type { AchievementDefinition } from '../types/models';

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  // Milestone badges
  { key: 'first_clip', name: 'First Blood', description: 'Upload your first clip', icon: 'film', category: 'milestone', requirement: 'Upload 1 clip' },
  { key: 'clips_10', name: 'Content Creator', description: 'Upload 10 clips', icon: 'video', category: 'milestone', requirement: 'Upload 10 clips' },
  { key: 'clips_50', name: 'Film Director', description: 'Upload 50 clips', icon: 'clapperboard', category: 'milestone', requirement: 'Upload 50 clips' },
  { key: 'first_spot', name: 'Scout', description: 'Add your first spot', icon: 'map-pin', category: 'milestone', requirement: 'Add 1 spot' },
  { key: 'spots_10', name: 'Explorer', description: 'Add 10 spots', icon: 'compass', category: 'milestone', requirement: 'Add 10 spots' },
  { key: 'spots_50', name: 'Cartographer', description: 'Add 50 spots', icon: 'map', category: 'milestone', requirement: 'Add 50 spots' },

  // Activity badges
  { key: 'explorer_10', name: 'Globe Trotter', description: 'Upload clips at 10 different spots', icon: 'globe', category: 'activity', requirement: 'Clip at 10 unique spots' },
  { key: 'night_owl', name: 'Night Owl', description: 'Upload a clip between midnight and 5am', icon: 'moon', category: 'activity', requirement: 'Upload clip at night' },
  { key: 'early_bird', name: 'Early Bird', description: 'Upload a clip between 5am and 7am', icon: 'sunrise', category: 'activity', requirement: 'Upload clip early morning' },
  { key: 'streak_7', name: 'On Fire', description: 'Upload clips 7 days in a row', icon: 'flame', category: 'activity', requirement: '7-day upload streak' },

  // Skill badges
  { key: 'trick_10', name: 'Trickster', description: 'Land 10 different tricks', icon: 'zap', category: 'skill', requirement: 'Log 10 tricks' },
  { key: 'trick_25', name: 'Technician', description: 'Land 25 different tricks', icon: 'sparkles', category: 'skill', requirement: 'Log 25 tricks' },
  { key: 'trick_50', name: 'Trick Master', description: 'Land 50 different tricks', icon: 'crown', category: 'skill', requirement: 'Log 50 tricks' },
  { key: 'all_flatground', name: 'Flat King', description: 'Land all flatground tricks', icon: 'medal', category: 'skill', requirement: 'All flatground tricks' },
  { key: 'all_grinds', name: 'Grind Lord', description: 'Land all grind tricks', icon: 'medal', category: 'skill', requirement: 'All grind tricks' },

  // Social badges
  { key: 'followers_10', name: 'Rising Star', description: 'Get 10 followers', icon: 'users', category: 'social', requirement: '10 followers' },
  { key: 'followers_100', name: 'Famous', description: 'Get 100 followers', icon: 'star', category: 'social', requirement: '100 followers' },
  { key: 'crew_founder', name: 'Crew Boss', description: 'Create a crew', icon: 'shield', category: 'social', requirement: 'Create a crew' },
  { key: 'battle_winner_5', name: 'Battle Veteran', description: 'Win 5 battles', icon: 'swords', category: 'social', requirement: 'Win 5 battles' },

  // Special/Secret badges
  { key: 'first_blood', name: 'First Blood', description: 'Win your first battle', icon: 'trophy', category: 'special', requirement: 'Win 1 battle', secret: true },
  { key: 'dethroned', name: 'Dethroned', description: 'Dethrone a podium holder via challenge', icon: 'crown', category: 'special', requirement: 'Win a challenge', secret: true },
  { key: 'underdog', name: 'Underdog', description: 'Win a battle with fewer initial likes', icon: 'rocket', category: 'special', requirement: 'Win as underdog', secret: true },
  { key: 'triple_crown', name: 'Triple Crown', description: 'Hold gold at 3 different spots', icon: 'gem', category: 'special', requirement: 'Gold at 3 spots', secret: true },
  { key: 'social_butterfly', name: 'Social Butterfly', description: 'Be in 3 different crews', icon: 'butterfly', category: 'special', requirement: 'Join 3 crews', secret: true },
  { key: 'perfectionist', name: 'Perfectionist', description: 'Get a 5-star rating on a clip', icon: 'star', category: 'special', requirement: '5-star clip rating', secret: true },
];

export const BADGE_MAP = Object.fromEntries(
  ACHIEVEMENT_DEFINITIONS.map((d) => [d.key, d])
);
