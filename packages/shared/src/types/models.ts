export type UserTier = 'rookie' | 'amateur' | 'pro' | 'legend';

export interface User {
    id: string;
    username: string;
    name: string;
    avatar: string;
    bio: string;
    points: number;
    tier: UserTier;
    location?: string;
    crewId?: string;
    followers: string[];
    following: string[];
    joinedAt: number;
    socialLinks?: {
        instagram?: string;
        youtube?: string;
        tiktok?: string;
    };
}

export interface Spot {
    id: string;
    name: string;
    description: string;
    location: [number, number];
    difficulty: 'Beginner' | 'Intermediate' | 'Pro' | 'Legendary';
    type: 'Street' | 'Park' | 'DIY' | 'Transition';
    rating: number;
    features: string[];
    images: string[];
    createdBy: string;
    createdAt: number;
    isVerified: boolean;
}

export interface Clip {
    id: string;
    userId: string;
    spotId: string;
    type: 'video' | 'image';
    url: string;
    thumbnail: string;
    description: string;
    trickName?: string;
    likes: string[];
    comments: string[];
    views: number;
    createdAt: number;
}

export interface Comment {
    id: string;
    userId: string;
    clipId: string;
    content: string;
    createdAt: number;
}

export type NotificationType =
    | 'like' | 'comment' | 'follow' | 'achievement'
    | 'battle_invite' | 'battle_result' | 'challenge' | 'crew_invite' | 'message'
    | 'session_invite' | 'session_starting' | 'crew_battle_started' | 'event_starting' | 'tutorial_helpful';

export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    sourceUserId: string;
    resourceId?: string;
    read: boolean;
    createdAt: number;
}

// V2 Types

export type BattleStatus = 'active' | 'completed' | 'expired';
export type ChallengeStatus = 'active' | 'completed' | 'expired' | 'rejected';
export type PodiumPosition = 1 | 2 | 3;
export type CrewRole = 'owner' | 'admin' | 'member';
export type MessageType = 'text' | 'image' | 'clip_share';
export type ActivityEventType =
    | 'clip_upload'
    | 'battle_win'
    | 'badge_earned'
    | 'spot_created'
    | 'trick_landed'
    | 'crew_joined'
    | 'challenge_won'
    | 'podium_earned'
    | 'follow'
    | 'session_hosted'
    | 'session_joined'
    | 'crew_battle_won'
    | 'event_won'
    | 'tutorial_created'
    | 'gear_setup_created';

export interface Battle {
    id: string;
    spotId: string;
    clip1Id: string;
    clip2Id: string;
    clip1Votes: number;
    clip2Votes: number;
    status: BattleStatus;
    winnerId?: string;
    expiresAt: number;
    createdAt: number;
}

export interface BattleVote {
    id: string;
    battleId: string;
    userId: string;
    clipId: string;
    createdAt: number;
}

export interface Challenge {
    id: string;
    spotId: string;
    challengerClipId: string;
    defenderClipId: string;
    position: PodiumPosition;
    challengerVotes: number;
    defenderVotes: number;
    status: ChallengeStatus;
    winnerId?: string;
    expiresAt: number;
    createdAt: number;
}

export interface ChallengeVote {
    id: string;
    challengeId: string;
    userId: string;
    clipId: string;
    createdAt: number;
}

export interface PodiumBadge {
    id: string;
    spotId: string;
    userId: string;
    clipId: string;
    position: PodiumPosition;
    awardedAt: number;
}

export interface Conversation {
    id: string;
    createdAt: number;
    updatedAt: number;
    participants: ConversationParticipant[];
    lastMessage?: Message;
}

export interface ConversationParticipant {
    id: string;
    conversationId: string;
    userId: string;
    lastReadAt: number;
    joinedAt: number;
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    type: MessageType;
    clipId?: string;
    createdAt: number;
}

export interface Crew {
    id: string;
    name: string;
    description: string;
    avatar: string;
    totalPoints: number;
    createdById: string;
    createdAt: number;
    memberCount: number;
}

export interface CrewMember {
    id: string;
    crewId: string;
    userId: string;
    role: CrewRole;
    joinedAt: number;
}

export interface TrickLog {
    id: string;
    userId: string;
    trickName: string;
    category: string;
    landedAt: number;
    clipId?: string;
    notes?: string;
}

export interface Achievement {
    id: string;
    userId: string;
    badgeKey: string;
    unlockedAt: number;
}

export interface AchievementDefinition {
    key: string;
    name: string;
    description: string;
    icon: string;
    category: 'milestone' | 'activity' | 'skill' | 'social' | 'special';
    requirement: string;
    secret?: boolean;
}

export interface ActivityEvent {
    id: string;
    userId: string;
    type: ActivityEventType;
    resourceId: string;
    metadata: string;
    createdAt: number;
}

// V3 Types

export type SessionStatus = 'active' | 'scheduled' | 'completed' | 'cancelled';
export type CrewBattleStatus = 'active' | 'voting' | 'completed';
export type EventType = 'contest' | 'jam' | 'meetup';
export type EventStatus = 'upcoming' | 'active' | 'voting' | 'completed';
export type EventCategory = 'open' | 'flatground' | 'grinds' | 'best-trick';
export type TutorialDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface GearSetup {
    id: string;
    userId: string;
    name: string;
    deckBrand: string;
    deckSize: string;
    trucksBrand: string;
    wheelsBrand: string;
    wheelsSize: string;
    bearingsBrand: string;
    shoesBrand: string;
    photos: string[];
    isActive: boolean;
    createdAt: number;
}

export interface Tutorial {
    id: string;
    userId: string;
    trickName: string;
    difficulty: TutorialDifficulty;
    videoUrl: string;
    thumbnail: string;
    description: string;
    steps: { step: number; text: string; timestamp?: number }[];
    views: number;
    helpfulCount: number;
    createdAt: number;
}

export interface TutorialVote {
    id: string;
    tutorialId: string;
    userId: string;
    helpful: boolean;
    createdAt: number;
}

export interface SkateSession {
    id: string;
    userId: string;
    spotId: string;
    status: SessionStatus;
    title: string;
    description: string;
    startTime: number;
    endTime?: number;
    maxParticipants?: number;
    createdAt: number;
}

export interface SessionParticipant {
    id: string;
    sessionId: string;
    userId: string;
    status: 'joined' | 'interested';
    joinedAt: number;
}

export interface CrewBattleType {
    id: string;
    crew1Id: string;
    crew2Id: string;
    spotId?: string;
    status: CrewBattleStatus;
    theme: string;
    startDate: number;
    endDate: number;
    winnerId?: string;
    createdAt: number;
}

export interface CrewBattleClip {
    id: string;
    battleId: string;
    crewId: string;
    clipId: string;
    userId: string;
    createdAt: number;
}

export interface CrewBattleVote {
    id: string;
    battleId: string;
    clipId: string;
    userId: string;
    createdAt: number;
}

export interface EventType2 {
    id: string;
    name: string;
    description: string;
    type: EventType;
    spotId?: string;
    startTime: number;
    endTime: number;
    createdById: string;
    category: EventCategory;
    prizes: any[];
    status: EventStatus;
    createdAt: number;
}

export interface EventParticipant {
    id: string;
    eventId: string;
    userId: string;
    clipId?: string;
    joinedAt: number;
}

export interface EventVote {
    id: string;
    eventId: string;
    clipId: string;
    userId: string;
    createdAt: number;
}
