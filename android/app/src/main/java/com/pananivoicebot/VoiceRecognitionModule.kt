package com.pananivoicebot

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule

class VoiceRecognitionModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), RecognitionListener {

    private var speechRecognizer: SpeechRecognizer? = null
    private val mainHandler = Handler(Looper.getMainLooper())

    override fun getName(): String {
        return "VoiceRecognitionModule"
    }

    private fun sendEvent(eventName: String, params: WritableMap?) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    @ReactMethod
    fun startListening(locale: String, promise: Promise) {
        mainHandler.post {
            try {
                if (speechRecognizer == null) {
                    speechRecognizer = SpeechRecognizer.createSpeechRecognizer(reactApplicationContext)
                    speechRecognizer?.setRecognitionListener(this)
                }

                val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH)
                intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, locale)
                intent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
                intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 5)

                speechRecognizer?.startListening(intent)
                promise.resolve(null)
            } catch (e: Exception) {
                promise.reject("START_ERROR", e)
            }
        }
    }

    @ReactMethod
    fun stopListening(promise: Promise) {
        mainHandler.post {
            try {
                speechRecognizer?.stopListening()
                promise.resolve(null)
            } catch (e: Exception) {
                promise.reject("STOP_ERROR", e)
            }
        }
    }

    @ReactMethod
    fun destroy(promise: Promise) {
        mainHandler.post {
            try {
                speechRecognizer?.cancel()
                speechRecognizer?.destroy()
                speechRecognizer = null
                promise.resolve(null)
            } catch (e: Exception) {
                promise.reject("DESTROY_ERROR", e)
            }
        }
    }

    // React Native Event listeners requirements
    @ReactMethod
    fun addListener(eventName: String) {
        // Required for RN built-in Event Emitter Calls.
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Required for RN built-in Event Emitter Calls.
    }

    // RecognitionListener Implementation

    override fun onReadyForSpeech(params: Bundle?) {
        sendEvent("onSpeechStart", null)
    }

    override fun onBeginningOfSpeech() {
        // Optional
    }

    override fun onRmsChanged(rmsdB: Float) {
        // Optional: Could send onSpeechVolumeChanged event here
    }

    override fun onBufferReceived(buffer: ByteArray?) {
        // Optional
    }

    override fun onEndOfSpeech() {
        sendEvent("onSpeechEnd", null)
    }

    override fun onError(error: Int) {
        val errorMessage = getErrorText(error)
        val errorMap = Arguments.createMap()
        val errorDetails = Arguments.createMap()
        errorDetails.putString("message", errorMessage)
        errorDetails.putInt("code", error)
        errorMap.putMap("error", errorDetails)
        
        sendEvent("onSpeechError", errorMap)
    }

    override fun onResults(results: Bundle?) {
        val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
        if (matches != null) {
            val eventParams = Arguments.createMap()
            val writableArray = Arguments.createArray()
            for (match in matches) {
                writableArray.pushString(match)
            }
            eventParams.putArray("value", writableArray)
            sendEvent("onSpeechResults", eventParams)
        }
    }

    override fun onPartialResults(partialResults: Bundle?) {
        val matches = partialResults?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
        if (matches != null) {
            val eventParams = Arguments.createMap()
            val writableArray = Arguments.createArray()
            for (match in matches) {
                writableArray.pushString(match)
            }
            eventParams.putArray("value", writableArray)
            sendEvent("onSpeechPartialResults", eventParams)
        }
    }

    override fun onEvent(eventType: Int, params: Bundle?) {
        // Optional
    }

    private fun getErrorText(errorCode: Int): String {
        return when (errorCode) {
            SpeechRecognizer.ERROR_AUDIO -> "Audio recording error"
            SpeechRecognizer.ERROR_CLIENT -> "Client side error"
            SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS -> "Insufficient permissions"
            SpeechRecognizer.ERROR_NETWORK -> "Network error"
            SpeechRecognizer.ERROR_NETWORK_TIMEOUT -> "Network timeout"
            SpeechRecognizer.ERROR_NO_MATCH -> "No match"
            SpeechRecognizer.ERROR_RECOGNIZER_BUSY -> "RecognitionService busy"
            SpeechRecognizer.ERROR_SERVER -> "Error from server"
            SpeechRecognizer.ERROR_SPEECH_TIMEOUT -> "No speech input"
            else -> "Didn't understand, please try again."
        }
    }
}
