class LocalStorage {
  static readonly accessTokenKey = 'accessToken';
  static readonly cartkey = 'cart';

  static getAccessToken(): string | null {
    const stored = localStorage.getItem(LocalStorage.accessTokenKey);
    if (!stored) return null;

    try {
      return JSON.parse(stored);
    } catch {
      return stored;
    }
  }
}

export default LocalStorage;
