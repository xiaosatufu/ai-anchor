/**
 * Offline mode utilities for AI-Anchor
 * Provides fallback mechanisms when network is unavailable
 */

export class OfflineMode {
  private static _isOffline = false;

  /**
   * Check if we're in offline mode
   */
  static isOffline(): boolean {
    return this._isOffline;
  }

  /**
   * Enable offline mode
   */
  static enable(): void {
    this._isOffline = true;
    console.log('AI-Anchor: Offline mode enabled');
  }

  /**
   * Disable offline mode
   */
  static disable(): void {
    this._isOffline = false;
    console.log('AI-Anchor: Offline mode disabled');
  }

  /**
   * Automatically detect offline mode based on network connectivity
   */
  static async autoDetect(): Promise<boolean> {
    try {
      // Try to make a simple request to detect network
      const response = await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache',
        signal: AbortSignal.timeout(3000)
      });
      this._isOffline = false;
      return false;
    } catch (error) {
      console.warn('Network unavailable, enabling offline mode:', error);
      this._isOffline = true;
      return true;
    }
  }

  /**
   * Get offline fallback for API token
   */
  static getOfflineToken(): string {
    return 'offline-mode-token-' + Date.now();
  }

  /**
   * Get offline user data
   */
  static getOfflineUser() {
    return {
      id: 'offline-user',
      name: 'Offline User',
      avatar: '',
      deviceCode: 'offline-device'
    };
  }

  /**
   * Handle network request with offline fallback
   */
  static async handleRequest<T>(
    requestFn: () => Promise<T>,
    fallbackData?: T
  ): Promise<T> {
    if (this.isOffline()) {
      console.warn('Request skipped due to offline mode');
      if (fallbackData !== undefined) {
        return fallbackData;
      }
      throw new Error('Network unavailable - running in offline mode');
    }

    try {
      return await requestFn();
    } catch (error) {
      console.warn('Request failed, enabling offline mode:', error);
      this.enable();
      if (fallbackData !== undefined) {
        return fallbackData;
      }
      throw error;
    }
  }

  /**
   * Check if server type is supported in offline mode
   */
  static isServerTypeSupported(serverType: string): boolean {
    // Only local servers are supported in offline mode
    return serverType === 'local' || serverType === 'localDir';
  }

  /**
   * Get recommended offline configuration
   */
  static getRecommendedConfig() {
    return {
      skipCloudServers: true,
      skipUpdaterCheck: true,
      skipUserAuthentication: true,
      skipStatisticsReporting: true,
      useLocalServersOnly: true
    };
  }
}
