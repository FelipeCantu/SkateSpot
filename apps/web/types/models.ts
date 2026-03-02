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
    followers: string[]; // User IDs
    following: string[]; // User IDs
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
    location: [number, number]; // [lat, lng]
    difficulty: 'Beginner' | 'Intermediate' | 'Pro' | 'Legendary';
    type: 'Street' | 'Park' | 'DIY' | 'Transition';
    rating: number; // 1-5
    features: string[]; // e.g., "Stairs", "Rail", "Ledge"
    images: string[];
    createdBy: string; // User ID
    createdAt: number;
    isVerified: boolean;
}

export interface Clip {
    id: string;
    userId: string;
    spotId: string;
    type: 'video' | 'image';
    url: string; // Blob URL or external URL
    thumbnail: string;
    description: string;
    trickName?: string;
    likes: string[]; // User IDs
    comments: string[]; // Comment IDs
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

export interface Notification {
    id: string;
    userId: string;
    type: 'like' | 'comment' | 'follow' | 'achievement' | 'battle_invite' | 'battle_result' | 'challenge' | 'crew_invite' | 'message' | 'session_invite' | 'session_starting' | 'crew_battle_started' | 'event_starting' | 'tutorial_helpful' | 'event_invite';
    sourceUserId: string;
    resourceId?: string; // Clip ID or Spot ID
    read: boolean;
    createdAt: number;
}
