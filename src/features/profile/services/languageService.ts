import { apiClient } from '../../../core/api/apiClient';
import { ApiPaths } from '../../../core/api/apiConstants';
import { languageStore } from '../data/languageStore';
import { getLanguageByCode } from '../data/languages';

export interface LanguagePreferenceResponse {
  success: boolean;
  language: string;
  isFallback?: boolean;
}

export interface LanguageApiResponse {
  success?: boolean;
  language?: string;
  data?: {
    language?: string;
  };
  message?: string;
}

/**
 * Service handling user language preference requests.
 * Connects frontend selection to backend preference endpoint with a clean fallback.
 */
export const languageService = {
  /**
   * Fetches the current user language preference from the API.
   * If the API endpoint is unavailable or network is disconnected,
   * falls back to the locally cached language preference.
   */
  async getCurrentLanguage(): Promise<string> {
    try {
      const response = await apiClient.get<LanguageApiResponse>(
        ApiPaths.languagePreference,
      );

      const code =
        response?.language ||
        response?.data?.language ||
        languageStore.getLanguageCode();

      const validLanguage = getLanguageByCode(code);
      await languageStore.setLanguageCode(validLanguage.code);
      return validLanguage.code;
    } catch {
      // Backend language endpoint may not be implemented yet; use locally stored preference
      return languageStore.getLanguageCode();
    }
  },

  /**
   * Updates the user's language preference on the backend.
   * Payload: { language: string } (e.g. "te", "hi", "en")
   */
  async updateLanguage(languageCode: string): Promise<LanguagePreferenceResponse> {
    const validLanguage = getLanguageByCode(languageCode);

    try {
      const response = await apiClient.put<LanguageApiResponse>(
        ApiPaths.languagePreference,
        { language: validLanguage.code },
      );

      const updatedCode =
        response?.language ||
        response?.data?.language ||
        validLanguage.code;

      await languageStore.setLanguageCode(updatedCode);

      return {
        success: true,
        language: updatedCode,
      };
    } catch (error: any) {
      // If endpoint is not found (404/NetworkException during offline/dev mode without backend),
      // we support a clean development fallback to allow testing the UI state transition
      const isEndpointMissing =
        error?.statusCode === 404 ||
        error?.message?.includes('404') ||
        error?.message?.includes('Network error') ||
        error?.name === 'NetworkException';

      if (isEndpointMissing) {
        // Apply preference locally in dev fallback mode
        await languageStore.setLanguageCode(validLanguage.code);
        return {
          success: true,
          language: validLanguage.code,
          isFallback: true,
        };
      }

      // Propagate actual backend errors (e.g. 400 Bad Request, 500 Server Error)
      throw error;
    }
  },
};
