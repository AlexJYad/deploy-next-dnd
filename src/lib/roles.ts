// lib/roles.ts
export type Role = "guest" | "player" | "admin";

export const roleRank: Record<Role, number> = {
   guest: 0,
   player: 1,
   admin: 2,
};

export function getRoleRank(role: string | null | undefined): number {
   return roleRank[role as Role] ?? 0;
}
