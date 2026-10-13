import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const { VoiceRecognitionModule } = NativeModules;
const voiceEmitter = new NativeEventEmitter(VoiceRecognitionModule);

export interface SpeechError {
  code: number;
  message: string;
}

export type VoiceStateCallback = (isListening: boolean) => void;
export type VoiceResultsCallback = (results: string[]) => void;
export type VoiceErrorCallback = (error: SpeechError) => void;
export type SpeechLatencyCallback = (latencyMs: number, transcript: string) => void;

class VoiceRecognitionService {
  private _isListening = false;
  private _isContinuous = true;
  private _locale = 'en-US';
  private _restartTimeout: ReturnType<typeof setTimeout> | null = null;
  private _isDestroyed = false;

  private onStateChangeCallbacks: VoiceStateCallback[] = [];
  private onResultsCallbacks: VoiceResultsCallback[] = [];
  private onPartialResultsCallbacks: VoiceResultsCallback[] = [];
  private onErrorCallbacks: VoiceErrorCallback[] = [];
  private onSpeechLatencyCallbacks: SpeechLatencyCallback[] = [];
  private speechStartedAt: number | null = null;

  constructor() {
    this.setupListeners();
  }

  private setupListeners() {
    if (Platform.OS !== 'android') return;

    voiceEmitter.addListener('onSpeechStart', () => {
      this.speechStartedAt = Date.now();
      this._isListening = true;
      this.notifyStateChange();
    });

    voiceEmitter.addListener('onSpeechEnd', () => {
      // Do not clear speechStartedAt here: Android emits speech-end before final results.
      this._isListening = false;
      this.notifyStateChange();
      this.handleContinuousRestart();
    });

    voiceEmitter.addListener('onSpeechResults', (e: { value: string[] }) => {
      const transcript = e.value?.[0] || '';
      if (this.speechStartedAt !== null) {
        const latencyMs = Date.now() - this.speechStartedAt;
        this.onSpeechLatencyCallbacks.forEach(cb => cb(latencyMs, transcript));
      }
      this.speechStartedAt = null;
      this._isListening = false;
      this.notifyStateChange();
      this.notifyResults(e.value);
      this.handleContinuousRestart();
    });

    voiceEmitter.addListener('onSpeechPartialResults', (e: { value: string[] }) => {
      this.notifyPartialResults(e.value);
    });

    voiceEmitter.addListener('onSpeechError', (e: { error: SpeechError }) => {
      this._isListening = false;
      this.notifyStateChange();
      this.notifyError(e.error);
      this.handleContinuousRestart();
    });
  }

  private handleContinuousRestart() {
    if (this._isDestroyed || !this._isContinuous) return;

    if (this._restartTimeout) {
      clearTimeout(this._restartTimeout);
    }
    
    // Add a slight delay to avoid rapid looping or microphone locking issues
    this._restartTimeout = setTimeout(() => {
      if (!this._isDestroyed && this._isContinuous && !this._isListening) {
        this.restartListening();
      }
    }, 500);
  }

  public async startListening(locale: string = 'en-US'): Promise<void> {
    if (Platform.OS !== 'android') return;
    
    this._isDestroyed = false;
    this._isContinuous = true;
    this._locale = locale;

    if (this._restartTimeout) {
      clearTimeout(this._restartTimeout);
    }

    try {
      await VoiceRecognitionModule.startListening(this._locale);
    } catch (e) {
      console.error('Failed to start listening:', e);
    }
  }

  public async stopListening(): Promise<void> {
    if (Platform.OS !== 'android') return;

    this._isContinuous = false;
    if (this._restartTimeout) {
      clearTimeout(this._restartTimeout);
    }

    try {
      await VoiceRecognitionModule.stopListening();
    } catch (e) {
      console.error('Failed to stop listening:', e);
    }
  }

  public async restartListening(): Promise<void> {
    await this.stopListening();
    // Re-enable continuous mode as this was a manual restart
    this._isContinuous = true; 
    try {
      await VoiceRecognitionModule.startListening(this._locale);
    } catch (e) {
      console.error('Failed to restart listening:', e);
    }
  }

  public async destroy(): Promise<void> {
    if (Platform.OS !== 'android') return;

    this._isDestroyed = true;
    this._isContinuous = false;
    
    if (this._restartTimeout) {
      clearTimeout(this._restartTimeout);
    }

    try {
      await VoiceRecognitionModule.destroy();
    } catch (e) {
      console.error('Failed to destroy voice service:', e);
    }
  }

  public isListening(): boolean {
    return this._isListening;
  }

  // Subscription Methods
  public onStateChange(callback: VoiceStateCallback) {
    this.onStateChangeCallbacks.push(callback);
    return () => {
      this.onStateChangeCallbacks = this.onStateChangeCallbacks.filter(c => c !== callback);
    };
  }

  public onResults(callback: VoiceResultsCallback) {
    this.onResultsCallbacks.push(callback);
    return () => {
      this.onResultsCallbacks = this.onResultsCallbacks.filter(c => c !== callback);
    };
  }

  public onPartialResults(callback: VoiceResultsCallback) {
    this.onPartialResultsCallbacks.push(callback);
    return () => {
      this.onPartialResultsCallbacks = this.onPartialResultsCallbacks.filter(c => c !== callback);
    };
  }

  public onError(callback: VoiceErrorCallback) {
    this.onErrorCallbacks.push(callback);
    return () => {
      this.onErrorCallbacks = this.onErrorCallbacks.filter(c => c !== callback);
    };
  }

  /** Measures actual time from native speech-start to finalized transcript. */
  public onSpeechLatency(callback: SpeechLatencyCallback) {
    this.onSpeechLatencyCallbacks.push(callback);
    return () => {
      this.onSpeechLatencyCallbacks = this.onSpeechLatencyCallbacks.filter(c => c !== callback);
    };
  }

  // Notification Helpers
  private notifyStateChange() {
    this.onStateChangeCallbacks.forEach(cb => cb(this._isListening));
  }

  private notifyResults(results: string[]) {
    this.onResultsCallbacks.forEach(cb => cb(results));
  }

  private notifyPartialResults(results: string[]) {
    this.onPartialResultsCallbacks.forEach(cb => cb(results));
  }

  private notifyError(error: SpeechError) {
    this.onErrorCallbacks.forEach(cb => cb(error));
  }
}

export const VoiceService = new VoiceRecognitionService();
