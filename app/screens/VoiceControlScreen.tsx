import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, PermissionsAndroid, Platform } from 'react-native';
import Icon from '@react-native-vector-icons/material-icons';

import { VoiceService } from '../services/voice/VoiceService';
import { Logger, LogCategory } from '../utils/Logger';
import { Logger, LogCategory } from '../utils/Logger';

import { IconButton } from '../components/IconButton';
import { PrimaryButton } from '../components/PrimaryButton';
import { FadeIn } from '../animations/FadeIn';
import { Pulse } from '../animations/Pulse';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { radius } from '../theme/radius';
import { shadows } from '../theme/shadows';

import { useBluetooth } from '../hooks/useBluetooth';
import { useRobotStatus } from '../hooks/RobotStatusContext';
import { CommandService } from '../services/command/CommandService';
import { RobotCommand } from '../models/RobotCommand';
import { ConnectionState } from '../models/ConnectionState';
import { IntentMapper } from '../services/voice/IntentMapper';

const VoiceControlScreen = ({ navigation }: any) => {
  const { connectionState } = useBluetooth();
  const isConnected = connectionState === ConnectionState.CONNECTED;

  const [isListening, setIsListening] = useState(false);
  const [speechText, setSpeechText] = useState('...');
  const [statusText, setStatusText] = useState('Ready to receive instructions');
  const [responseText, setResponseText] = useState('Awaiting Command');

  // Setup Voice listeners
  useEffect(() => {
    const unsubState = VoiceService.onStateChange((listening) => {
      setIsListening(listening);
      if (listening) {
        setSpeechText('Listening...');
        setStatusText('Listening to audio...');
        setResponseText('...');
      } else {
        setStatusText('Processing audio...');
      }
    });

    const unsubResults = VoiceService.onResults((results) => {
      const text = results?.[0] || '';
      if (!text) {
        setSpeechText('...');
        setStatusText('Ready to receive instructions');
        setResponseText('Awaiting Command');
        return;
      }

      setSpeechText(`"${text}"`);
      processCommand(text);
    });

    const unsubLatency = VoiceService.onSpeechLatency((latencyMs, transcript) => {
      const latencySeconds = (latencyMs / 1000).toFixed(2);
      const message = `Speech recognition latency: ${latencySeconds}s for transcript "${transcript}"`;
      if (latencyMs > 3000) Logger.warn(LogCategory.SYSTEM, message);
      else Logger.info(LogCategory.SYSTEM, message);
    });

    const unsubError = VoiceService.onError(() => {
      setSpeechText('...');
      setStatusText('Ready to receive instructions');
      setResponseText('Awaiting Command');
    });

    return () => {
      unsubState();
      unsubResults();
      unsubLatency();
      unsubError();
      VoiceService.destroy();
    };
  }, [isConnected]);

  // Handle BT Disconnect explicitly
  useEffect(() => {
    if (!isConnected && isListening) {
      stopListening();
    }
  }, [isConnected, isListening]);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Audio Permission',
            message: 'App needs access to your microphone to receive voice commands.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const startListening = async () => {
    if (!isConnected) return;
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      setResponseText('Permission Denied');
      return;
    }

    try {
      await VoiceService.startListening('en-US');
    } catch (e) {
      console.error(e);
    }
  };

  const stopListening = async () => {
    try {
      await VoiceService.stopListening();
    } catch (e) {
      console.error(e);
    }
  };

  const processCommand = useCallback((spokenText: string) => {
    if (!isConnected) return;

    const command = IntentMapper.map(spokenText);
    
    if (command) {
      setStatusText('Ready to receive instructions');
      setResponseText('Command accepted');
      CommandService.sendCommand(command);
    } else {
      setStatusText('Ready to receive instructions');
      setResponseText('Unknown command');
    }
  }, [isConnected]);

  const handleEmergencyStop = () => {
    if (!isConnected) return;
    CommandService.sendCommand(RobotCommand.Stop);
    setResponseText('EMERGENCY STOP');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <IconButton 
          iconName="arrow-back" 
          onPress={() => navigation.goBack()} 
          style={styles.backBtn} 
        />
        <View style={styles.headerTitleContainer}>
          <Icon name="robot-2" size={24} color={colors.primary} />
          <Text style={styles.headerTitle}>KUDO VoiceBot</Text>
        </View>
        <IconButton 
          iconName="bluetooth-connected" 
          onPress={() => navigation.navigate('Bluetooth')} 
        />
      </View>

      {!isConnected ? (
        <View style={styles.content}>
          <FadeIn style={styles.disconnectedContainer}>
            <Icon name="bluetooth-disabled" size={64} color={colors.error} />
            <Text style={styles.disconnectedTitle}>Connection Lost</Text>
            <Text style={styles.disconnectedText}>
              Bluetooth is disconnected. Voice control is unavailable.
            </Text>
            <PrimaryButton 
              title="Go to Bluetooth Settings" 
              iconName="bluetooth-searching"
              onPress={() => navigation.navigate('Bluetooth')}
            />
          </FadeIn>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Title Area */}
          <View style={styles.titleArea}>
            <Text style={styles.pageTitle}>Voice Command</Text>
            <Text style={styles.pageSubtitle}>{statusText}</Text>
          </View>

          {/* Microphone */}
          <View style={styles.micContainer}>
            {isListening ? (
              <Pulse maxScale={1.5} duration={1500} style={StyleSheet.absoluteFill}>
                <View style={styles.pulseBg} />
              </Pulse>
            ) : null}
            
            <TouchableOpacity 
              style={[styles.micBtn, isListening && styles.micBtnListening]}
              onPress={isListening ? stopListening : startListening}
              activeOpacity={0.8}
            >
              <Icon name="mic" size={48} color={colors.onPrimary} />
            </TouchableOpacity>
          </View>

          {/* Speech Response Boxes */}
          <View style={styles.responseContainer}>
            <View style={styles.speechBox}>
              <Text style={styles.speechBoxLabel}>RECOGNIZED INPUT</Text>
              <Text style={[styles.speechBoxText, isListening && { color: colors.primary }]}>{speechText}</Text>
            </View>

            <View style={styles.robotResponseBox}>
              <View style={styles.responseIconBox}>
                <Icon name="check-circle" size={20} color={colors.tertiary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.responseLabel}>Robot Status</Text>
                <Text style={styles.responseText}>{responseText}</Text>
              </View>
            </View>
          </View>

          {/* Emergency Stop */}
          <TouchableOpacity 
            style={styles.emergencyStopBtn}
            onPress={handleEmergencyStop}
            activeOpacity={0.9}
          >
            <Icon name="warning" size={24} color={colors.onError} style={{ marginRight: spacing.xs }} />
            <Text style={styles.emergencyStopText}>EMERGENCY STOP</Text>
          </TouchableOpacity>

          {/* Recent Commands (Static for now as per instructions) */}
          <View style={styles.recentContainer}>
            <Text style={styles.recentTitle}>Recent Commands</Text>
            <View style={styles.recentGrid}>
              <View style={styles.recentCard}>
                <View style={styles.recentCardHeader}>
                  <Icon name="arrow-upward" size={20} color={colors.primary} />
                  <Text style={styles.recentTime}>10:05 AM</Text>
                </View>
                <Text style={styles.recentText}>Forward</Text>
              </View>
              <View style={styles.recentCard}>
                <View style={styles.recentCardHeader}>
                  <Icon name="stop-circle" size={20} color={colors.error} />
                  <Text style={styles.recentTime}>10:04 AM</Text>
                </View>
                <Text style={styles.recentText}>Stop</Text>
              </View>
              <View style={styles.recentCard}>
                <View style={styles.recentCardHeader}>
                  <Icon name="turn-left" size={20} color={colors.primary} />
                  <Text style={styles.recentTime}>09:58 AM</Text>
                </View>
                <Text style={styles.recentText}>Rotate Left</Text>
              </View>
              <View style={styles.recentCard}>
                <View style={styles.recentCardHeader}>
                  <Icon name="speed" size={20} color={colors.primary} />
                  <Text style={styles.recentTime}>09:55 AM</Text>
                </View>
                <Text style={styles.recentText}>Speed 50%</Text>
              </View>
            </View>
          </View>

        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    height: 64,
    paddingHorizontal: spacing.marginMobile,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    zIndex: 50,
  },
  backBtn: {
    marginLeft: -12,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  headerTitle: {
    ...typography.titleLg,
    color: colors.primary,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.marginMobile,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disconnectedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.xl,
    ...shadows.md,
    width: '100%',
  },
  disconnectedTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  disconnectedText: {
    ...typography.bodyMd,
    color: colors.outline,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  scrollContent: {
    paddingHorizontal: spacing.marginMobile,
    paddingVertical: spacing.lg,
    paddingBottom: 100,
    alignItems: 'center',
  },
  titleArea: {
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  pageTitle: {
    ...typography.titleLg,
    color: colors.onSurface,
  },
  pageSubtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  micContainer: {
    position: 'relative',
    width: 192, // 48 * 4
    height: 192,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  pulseBg: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: 96,
    backgroundColor: colors.primaryFixedDim,
    opacity: 0.5,
  },
  micBtn: {
    width: 128, // 32 * 4
    height: 128,
    borderRadius: 64,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
    zIndex: 10,
  },
  micBtnListening: {
    backgroundColor: colors.primaryContainer,
    shadowColor: colors.primaryFixedDim,
    shadowOpacity: 1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
  },
  responseContainer: {
    width: '100%',
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  speechBox: {
    backgroundColor: colors.surfaceContainerLowest,
    borderColor: 'rgba(194, 198, 214, 0.3)', // outlineVariant/30
    borderWidth: 1,
    borderRadius: 20,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    ...shadows.sm,
  },
  speechBoxLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  speechBoxText: {
    ...typography.titleLg,
    color: colors.onSurface,
    textAlign: 'center',
  },
  robotResponseBox: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 20,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderColor: 'rgba(194, 198, 214, 0.1)',
    borderWidth: 1,
  },
  responseIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.tertiaryContainer + '33', // 20% opacity
    alignItems: 'center',
    justifyContent: 'center',
  },
  responseLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginBottom: 4,
  },
  responseText: {
    ...typography.bodyMd,
    color: colors.onSurface,
    fontWeight: '500',
  },
  emergencyStopBtn: {
    width: '100%',
    backgroundColor: colors.error,
    borderRadius: 16,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
    marginBottom: spacing.xl,
  },
  emergencyStopText: {
    ...typography.titleMd,
    color: colors.onError,
    fontWeight: 'bold',
  },
  recentContainer: {
    width: '100%',
  },
  recentTitle: {
    ...typography.titleMd,
    color: colors.onSurface,
    marginBottom: spacing.md,
    paddingHorizontal: 8,
  },
  recentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  recentCard: {
    width: '47%',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.xl,
    padding: spacing.sm,
    borderColor: 'rgba(194, 198, 214, 0.2)',
    borderWidth: 1,
    ...shadows.sm,
  },
  recentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  recentTime: {
    ...typography.labelSm,
    color: colors.outline,
  },
  recentText: {
    ...typography.bodyMd,
    color: colors.onSurface,
    fontWeight: '500',
  },
});

export default VoiceControlScreen;
