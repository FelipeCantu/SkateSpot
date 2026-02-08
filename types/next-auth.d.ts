import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      username: string;
      tier: string;
      points: number;
    };
  }

  interface User {
    username?: string;
    tier?: string;
    points?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    tier: string;
    points: number;
  }
}
