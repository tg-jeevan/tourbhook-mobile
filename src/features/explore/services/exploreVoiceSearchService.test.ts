import {
  ExploreVoiceSearchService,
  isNativeSpeechRecognitionAvailable,
  VoiceSearchEvent,
} from './exploreVoiceSearchService';
import { searchExploreContent } from '../data/mockExploreData';
import { PermissionsAndroid, Platform } from 'react-native';

describe('ExploreVoiceSearchService', () => {
  let service: ExploreVoiceSearchService;

  beforeEach(() => {
    service = new ExploreVoiceSearchService();
    jest.clearAllMocks();
  });

  afterEach(() => {
    service.reset();
  });

  it('initializes with idle status', () => {
    expect(service.getStatus()).toBe('idle');
  });

  it('checks native speech recognition availability', () => {
    // In standard node/jest environment without @react-native-voice/voice, it returns false
    expect(isNativeSpeechRecognitionAvailable()).toBe(false);
  });

  it('emits permission_denied when microphone access is rejected', async () => {
    Platform.OS = 'android';
    jest.spyOn(PermissionsAndroid, 'check').mockResolvedValue(false);
    jest.spyOn(PermissionsAndroid, 'request').mockResolvedValue(PermissionsAndroid.RESULTS.DENIED as any);

    const events: VoiceSearchEvent[] = [];
    service.subscribe((evt) => events.push(evt));

    await service.startListening();

    expect(events.length).toBe(1);
    expect(events[0].status).toBe('permission_denied');
    expect(events[0].errorMessage).toContain('Microphone permission denied');
    expect(service.getStatus()).toBe('permission_denied');
  });

  it('emits unavailable when speech recognition engine is not installed on device', async () => {
    Platform.OS = 'android';
    jest.spyOn(PermissionsAndroid, 'check').mockResolvedValue(true);

    const events: VoiceSearchEvent[] = [];
    service.subscribe((evt) => events.push(evt));

    await service.startListening();

    expect(events.length).toBe(1);
    expect(events[0].status).toBe('unavailable');
    expect(events[0].errorMessage).toContain('Speech recognition is unavailable');
    expect(service.getStatus()).toBe('unavailable');
  });

  it('processes sample voice query through listening to recognized state', async () => {
    Platform.OS = 'android';
    jest.spyOn(PermissionsAndroid, 'check').mockResolvedValue(true);

    const events: VoiceSearchEvent[] = [];
    service.subscribe((evt) => events.push(evt));

    await service.startListening({ sampleQuery: 'Paris' });

    expect(events[0].status).toBe('listening');
    expect(service.getStatus()).toBe('listening');

    // Wait for the simulated recognition callback
    await new Promise((resolve) => setTimeout(() => resolve(undefined), 450));

    expect(events.length).toBe(2);
    expect(events[1].status).toBe('recognized');
    expect(events[1].query).toBe('Paris');
    expect(service.getStatus()).toBe('recognized');
  });

  it('handles recognized speech results correctly and connects to Explore search flow', () => {
    const events: VoiceSearchEvent[] = [];
    service.subscribe((evt) => events.push(evt));

    service.handleSpeechResults(['Bali']);

    expect(events.length).toBe(1);
    expect(events[0].status).toBe('recognized');
    expect(events[0].query).toBe('Bali');

    // Verify searchExploreContent yields search results for this recognized query
    const results = searchExploreContent(events[0].query!);
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.title.includes('Bali'))).toBe(true);
  });

  it('handles empty speech results with no_speech status', () => {
    const events: VoiceSearchEvent[] = [];
    service.subscribe((evt) => events.push(evt));

    service.handleSpeechResults('');

    expect(events.length).toBe(1);
    expect(events[0].status).toBe('no_speech');
    expect(events[0].errorMessage).toContain('No speech recognized');
  });

  it('handles speech error properly', () => {
    const events: VoiceSearchEvent[] = [];
    service.subscribe((evt) => events.push(evt));

    service.handleSpeechError(new Error('Network speech error'));

    expect(events.length).toBe(1);
    expect(events[0].status).toBe('error');
    expect(events[0].errorMessage).toBe('Network speech error');
  });

  it('stops listening and returns to idle', async () => {
    Platform.OS = 'android';
    jest.spyOn(PermissionsAndroid, 'check').mockResolvedValue(true);

    await service.startListening({ sampleQuery: 'Tokyo' });
    expect(service.getStatus()).toBe('listening');

    service.stopListening();
    expect(service.getStatus()).toBe('idle');
  });
});
