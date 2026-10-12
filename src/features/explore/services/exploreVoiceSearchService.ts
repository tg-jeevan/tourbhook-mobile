import { PermissionsAndroid, Platform, NativeModules } from 'react-native';

export type VoiceSearchStatus =
  | 'idle'
  | 'listening'
  | 'recognized'
  | 'permission_denied'
  | 'unavailable'
  | 'no_speech'
  | 'error';

export interface VoiceSearchEvent {
  status: VoiceSearchStatus;
  query?: string;
  errorMessage?: string;
}

export type VoiceSearchListener = (event: VoiceSearchEvent) => void;

/**
 * Checks if native speech recognition is supported in current runtime.
 * React Native requires native modules such as `@react-native-voice/voice` (NativeModules.Voice)
 * or android.speech.SpeechRecognizer native bridge.
 */
export const isNativeSpeechRecognitionAvailable = (): boolean => {
  const nm = NativeModules as Record<string, any> | undefined;
  if (!nm) return false;
  return Boolean(nm.Voice || nm.RNVoice || nm.SpeechRecognizer || nm.RCTVoice);
};

/**
 * Checks or requests RECORD_AUDIO permission on Android.
 */
export const checkOrRequestAudioPermission = async (): Promise<'granted' | 'denied'> => {
  if (Platform.OS !== 'android') {
    return 'granted';
  }

  try {
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
    );
    if (hasPermission) {
      return 'granted';
    }

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Microphone Permission',
        message:
          'Tourbhook needs microphone access to enable voice search for destinations, places, and travel reels.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      }
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED ? 'granted' : 'denied';
  } catch {
    return 'denied';
  }
};

/**
 * ExploreVoiceSearchService manages the voice-search state lifecycle:
 * - 'idle': Ready to listen
 * - 'listening': Active recording with visual feedback
 * - 'recognized': Speech converted to search query
 * - 'permission_denied': Microphone permission rejected
 * - 'unavailable': Speech recognition engine not installed on device
 * - 'no_speech': No speech detected during listening session
 * - 'error': Recognition failure
 */
export class ExploreVoiceSearchService {
  private status: VoiceSearchStatus = 'idle';
  private listeners: Set<VoiceSearchListener> = new Set();
  private listeningTimer: any = null;

  public subscribe(listener: VoiceSearchListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getStatus(): VoiceSearchStatus {
    return this.status;
  }

  private emit(event: VoiceSearchEvent) {
    this.status = event.status;
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        // Safe emission
      }
    });
  }

  /**
   * Start listening session.
   * If native speech recognition is available, binds to native listeners.
   * If speech recognition is unavailable, transitions to 'unavailable'.
   * Allows simulated sample query in test/demo mode.
   */
  public async startListening(options?: { sampleQuery?: string }): Promise<void> {
    if (this.status === 'listening') {
      this.stopListening();
      return;
    }

    // 1. Verify Microphone Permission
    const permission = await checkOrRequestAudioPermission();
    if (permission !== 'granted') {
      this.emit({
        status: 'permission_denied',
        errorMessage: 'Microphone permission denied. Please allow microphone access to use voice search.',
      });
      return;
    }

    // 2. Check if a native speech engine is installed
    const hasSpeechEngine = isNativeSpeechRecognitionAvailable();

    if (!hasSpeechEngine) {
      if (options?.sampleQuery) {
        // Simulated recognition flow for verification / tests
        this.emit({ status: 'listening' });
        this.listeningTimer = setTimeout(() => {
          this.emit({
            status: 'recognized',
            query: options.sampleQuery,
          });
          this.listeningTimer = null;
        }, 400);
        return;
      }

      this.emit({
        status: 'unavailable',
        errorMessage:
          'Speech recognition is unavailable on this device. (Requires @react-native-voice/voice and RECORD_AUDIO permission).',
      });
      return;
    }

    // 3. Native speech recognition active
    this.emit({ status: 'listening' });

    // Connect to NativeModules.Voice when native package is present
    const VoiceModule = (NativeModules as any)?.Voice || (NativeModules as any)?.RNVoice;
    if (VoiceModule && typeof VoiceModule.start === 'function') {
      try {
        VoiceModule.start('en-US');
      } catch (err: any) {
        this.emit({
          status: 'error',
          errorMessage: err?.message || 'Failed to start speech recognition.',
        });
      }
    }
  }

  public stopListening(): void {
    if (this.listeningTimer) {
      clearTimeout(this.listeningTimer);
      this.listeningTimer = null;
    }

    const VoiceModule = (NativeModules as any)?.Voice || (NativeModules as any)?.RNVoice;
    if (VoiceModule && typeof VoiceModule.stop === 'function') {
      try {
        VoiceModule.stop();
      } catch {
        // Ignore native stop failure
      }
    }

    if (this.status === 'listening') {
      this.emit({ status: 'idle' });
    }
  }

  /**
   * Called when speech transcript is received.
   */
  public handleSpeechResults(results: string[] | string): void {
    const query = Array.isArray(results) ? results[0] : results;
    if (!query || !query.trim()) {
      this.emit({
        status: 'no_speech',
        errorMessage: 'No speech recognized. Tap microphone to try again.',
      });
      return;
    }

    this.emit({
      status: 'recognized',
      query: query.trim(),
    });
  }

  /**
   * Called on recognition error.
   */
  public handleSpeechError(error: any): void {
    const message =
      typeof error === 'string'
        ? error
        : error?.message || 'Speech recognition failed. Please try again.';

    this.emit({
      status: 'error',
      errorMessage: message,
    });
  }

  public reset(): void {
    this.stopListening();
    this.emit({ status: 'idle' });
  }
}

export const exploreVoiceSearchService = new ExploreVoiceSearchService();
