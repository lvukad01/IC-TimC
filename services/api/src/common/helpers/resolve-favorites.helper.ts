export async function resolveFavorites(userId?: string): Promise<Set<string>> {
  if (!userId) return new Set<string>();
  return await this.getFavoriteSalonIds(userId);
}
