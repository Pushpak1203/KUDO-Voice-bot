import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from '@react-native-vector-icons/material-icons';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { QuickActionButton } from '../components/QuickActionButton';
import { FadeIn } from '../animations/FadeIn';
import { Pulse } from '../animations/Pulse';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { radius } from '../theme/radius';
import { shadows } from '../theme/shadows';
import { useBluetooth } from '../hooks/useBluetooth';
import { useRobotStatus } from '../hooks/RobotStatusContext';
import { ConnectionState } from '../models/ConnectionState';

const HomeDashboardScreen = ({ navigation }: any) => {
  const { connectionState, connectedDevice } = useBluetooth();
  const robotStatus = useRobotStatus();

  const isBluetoothConnected = connectionState === ConnectionState.CONNECTED;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header 
        title="KUDO VoiceBot" 
        onSettingsPress={() => navigation.navigate('Settings')} 
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FadeIn duration={400} delay={100}>
          {/* Connection Status */}
          <Card style={styles.statusCard}>
            {isBluetoothConnected ? (
              <View style={styles.telemetryContainer}>
                <View style={styles.statusRow}>
                  <View style={[styles.statusIndicatorError, { backgroundColor: robotStatus.connected ? colors.primary : colors.error }]} />
                  <Text style={styles.statusText}>{connectedDevice?.name || 'Unknown Device'}</Text>
                </View>
                <View style={styles.telemetryData}>
                  <Text style={styles.telemetryText}>BT Status: {connectionState}</Text>
                  <Text style={styles.telemetryText}>Robot: {robotStatus.connected ? 'READY' : 'WAITING'}</Text>
                  <Text style={styles.telemetryText}>Movement: {robotStatus.moving ? `MOVING (${robotStatus.direction})` : 'STOPPED'}</Text>
                  <Text style={styles.telemetryText}>Last Command: {robotStatus.lastCommand || 'None'}</Text>
                  {robotStatus.obstacleDetected && (
                    <Text style={[styles.telemetryText, { color: colors.error, fontWeight: 'bold' }]}>
                      ⚠️ OBSTACLE: {robotStatus.obstacleDistance}cm
                    </Text>
                  )}
                  <Text style={[styles.telemetryText, { fontSize: 10, marginTop: 4, opacity: 0.6 }]}>
                    Last Update: {new Date(robotStatus.lastUpdated).toLocaleTimeString()}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={[styles.connectButton, { marginTop: spacing.sm }]}
                  onPress={() => navigation.navigate('Bluetooth')}
                >
                  <Text style={styles.connectButtonText}>Manage</Text>
                  <Icon name="settings-bluetooth" size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={styles.statusRow}>
                  <View style={styles.statusIndicatorError} />
                  <Text style={styles.statusText}>Not Connected to Robot</Text>
                </View>
                <TouchableOpacity 
                  style={styles.connectButton}
                  onPress={() => navigation.navigate('Bluetooth')}
                >
                  <Text style={styles.connectButtonText}>Reconnect</Text>
                  <Icon name="arrow-forward" size={16} color={colors.primary} />
                </TouchableOpacity>
              </>
            )}
          </Card>
        </FadeIn>

        <FadeIn duration={400} delay={200}>
          {/* Voice Control Primary Action */}
          <TouchableOpacity 
            activeOpacity={0.9} 
            onPress={() => navigation.navigate('VoiceControl')}
            style={styles.voiceControlCard}
          >
            {/* Subtle background circles for design */}
            <View style={styles.voiceCardBg1} />
            <View style={styles.voiceCardBg2} />
            
            <View style={styles.voiceCardHeader}>
              <Text style={styles.voiceCardTitle}>Voice Control</Text>
              <Text style={styles.voiceCardSubtitle}>Tap to start listening</Text>
            </View>
            
            <View style={styles.voiceCardMicContainer}>
              <Pulse maxScale={1.1} duration={2000}>
                <View style={styles.micCircle}>
                  <Icon name="mic" size={48} color={colors.onPrimary} />
                </View>
              </Pulse>
            </View>
          </TouchableOpacity>
        </FadeIn>

        <FadeIn duration={400} delay={300}>
          {/* Quick Actions Grid */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.gridRow}>
            <QuickActionButton 
              title="Manual Control" 
              iconName="sports-esports" 
              onPress={() => navigation.navigate('ManualControl')} 
            />
            <View style={{ width: spacing.md }} />
            <QuickActionButton 
              title="Command History" 
              iconName="history" 
              onPress={() => navigation.navigate('CommandHistory')} 
            />
          </View>

          {/* Emergency Stop */}
          <View style={[styles.gridRow, { marginTop: spacing.md }]}>
            <QuickActionButton 
              title="Emergency Stop" 
              iconName="block" 
              variant="danger"
              onPress={() => { /* Implement Stop */ }} 
            />
          </View>
        </FadeIn>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => {}}>
          <Icon name="home" size={24} color={colors.primary} />
          <Text style={[styles.navText, styles.navTextActive]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Bluetooth')}>
          <Icon name="bluetooth" size={24} color={colors.outline} />
          <Text style={styles.navText}>Connect</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Settings')}>
          <Icon name="person" size={24} color={colors.outline} />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.marginMobile,
    paddingBottom: 100, // Make room for bottom nav
  },
  statusCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicatorError: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.error,
    marginRight: spacing.sm,
  },
  statusText: {
    ...typography.labelLg,
    color: colors.onSurface,
  },
  telemetryContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  telemetryData: {
    marginTop: spacing.sm,
    paddingLeft: spacing.md,
    borderLeftWidth: 2,
    borderLeftColor: colors.primaryContainer,
  },
  telemetryText: {
    ...typography.bodySm,
    color: colors.onSurface,
    marginBottom: 2,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectButtonText: {
    ...typography.labelSm,
    color: colors.primary,
    marginRight: 4,
  },
  voiceControlCard: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: colors.primaryContainer,
    borderRadius: radius.xl,
    padding: spacing.lg,
    minHeight: 180,
    marginBottom: spacing.xl,
    ...shadows.md,
  },
  voiceCardBg1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#ffffff',
    opacity: 0.1,
  },
  voiceCardBg2: {
    position: 'absolute',
    bottom: -20,
    left: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ffffff',
    opacity: 0.1,
  },
  voiceCardHeader: {
    zIndex: 1,
  },
  voiceCardTitle: {
    ...typography.headlineMd,
    color: colors.onPrimaryContainer,
  },
  voiceCardSubtitle: {
    ...typography.bodyMd,
    color: colors.onPrimaryContainer,
    opacity: 0.8,
  },
  voiceCardMicContainer: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
  },
  micCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  sectionTitle: {
    ...typography.headlineMd,
    fontSize: 20, // slightly smaller than main headline
    color: colors.onBackground,
    marginBottom: spacing.md,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceContainerHighest,
    paddingBottom: 24, // safe area padding fallback
    paddingTop: spacing.xs,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xs,
    minWidth: 64,
  },
  navText: {
    ...typography.labelSm,
    color: colors.outline,
    marginTop: 4,
  },
  navTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
});

export default HomeDashboardScreen;
