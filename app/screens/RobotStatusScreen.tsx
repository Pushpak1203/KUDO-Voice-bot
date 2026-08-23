import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import Icon from '@react-native-vector-icons/material-icons';
import { Header } from '../components/Header';
import { IconButton } from '../components/IconButton';
import { PrimaryButton } from '../components/PrimaryButton';
import { FadeIn } from '../animations/FadeIn';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { radius } from '../theme/radius';
import { shadows } from '../theme/shadows';

import { useBluetooth } from '../hooks/useBluetooth';
import { useRobotStatus } from '../hooks/RobotStatusContext';
import { ConnectionState } from '../models/ConnectionState';

const RobotStatusScreen = ({ navigation }: any) => {
  const { connectionState, connectedDevice } = useBluetooth();
  const robotStatus = useRobotStatus();

  const isConnected = connectionState === ConnectionState.CONNECTED;

  // Placeholder for health if not yet fully implemented in robotStatus hook
  const robotHealth = {
    lastHeartbeat: Date.now() - 500,
    latency: 12
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
              Bluetooth is disconnected. Telemetry is unavailable.
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
          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>Robot Status</Text>
            <Text style={styles.pageSubtitle}>Real-time telemetry and diagnostics.</Text>
          </View>

          <View style={styles.bentoGrid}>
            
            {/* Connection Status */}
            <FadeIn delay={100} style={[styles.bentoCard, styles.bentoFullRow]}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardLabel}>Connection</Text>
                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusBadgeText}>Connected</Text>
                </View>
              </View>
              <View style={styles.cardBodyRow}>
                <View>
                  <Text style={styles.cardValue}>{connectedDevice?.name || 'Unknown Device'}</Text>
                  <Text style={styles.cardSubValue}>Bluetooth: {connectionState}</Text>
                </View>
                <View style={styles.iconCirclePrimary}>
                  <Icon name="bluetooth" size={24} color={colors.primary} />
                </View>
              </View>
            </FadeIn>

            {/* Current State */}
            <FadeIn delay={150} style={[styles.bentoCard, styles.bentoFullRow, styles.activeStateCard]}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardLabel}>Current Task</Text>
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>{robotStatus.connected ? 'Ready' : 'Waiting'}</Text>
                </View>
              </View>
              <View style={styles.cardBodyRow}>
                <View>
                  <Text style={[styles.cardValue, { color: colors.primary }]}>
                    {robotStatus.moving ? 'Moving' : 'Idle'}
                  </Text>
                  <View style={styles.directionRow}>
                    <Icon name={robotStatus.moving ? "arrow-upward" : "stop"} size={16} color={colors.onSurfaceVariant} />
                    <Text style={styles.cardSubValue}>
                      Direction: {robotStatus.direction || 'None'}
                    </Text>
                  </View>
                </View>
                <View style={styles.iconCirclePrimaryContainer}>
                  <Icon name="cloud-download" size={24} color={colors.onPrimary} />
                </View>
              </View>
            </FadeIn>

            {/* Obstacle Sensors */}
            <FadeIn delay={200} style={[styles.bentoCard, styles.bentoFullRow, robotStatus.obstacleDetected && styles.errorStateCard]}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardLabel}>Obstacle Sensors</Text>
                <Text style={[styles.cardSubValue, robotStatus.obstacleDetected && { color: colors.error }]}>
                  {robotStatus.obstacleDetected ? 'Warning' : 'Clear'}
                </Text>
              </View>
              <View style={styles.cardBodyRow}>
                <View>
                  <Text style={styles.cardValue}>
                    {robotStatus.obstacleDetected ? 'Obstacle Detected' : 'None Detected'}
                  </Text>
                  <Text style={[styles.cardSubValue, robotStatus.obstacleDetected && { color: colors.error }]}>
                    {robotStatus.obstacleDetected ? `Distance: ${robotStatus.obstacleDistance} cm` : 'All sectors scanning'}
                  </Text>
                </View>
                <View style={robotStatus.obstacleDetected ? styles.iconCircleError : styles.iconCircleTertiary}>
                  <Icon name="radar" size={24} color={robotStatus.obstacleDetected ? colors.error : colors.tertiary} />
                </View>
              </View>
            </FadeIn>

            {/* Last Update */}
            <FadeIn delay={250} style={styles.bentoCardHalf}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardLabel}>Last Command</Text>
              </View>
              <View style={styles.cardBodyCol}>
                <Text style={styles.cardValueSmall}>{robotStatus.lastCommand || 'None'}</Text>
                <Text style={styles.cardSubValue}>
                  {new Date(robotStatus.lastUpdated).toLocaleTimeString()}
                </Text>
                <View style={styles.iconCircleSurfaceRight}>
                  <Icon name="history" size={24} color={colors.onSurfaceVariant} />
                </View>
              </View>
            </FadeIn>

            {/* Health / Heartbeat */}
            <FadeIn delay={300} style={styles.bentoCardHalf}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardLabel}>Heartbeat</Text>
              </View>
              <View style={styles.cardBodyCol}>
                <Text style={styles.cardValueSmall}>{robotHealth.latency}ms</Text>
                <Text style={styles.cardSubValue}>Latency</Text>
                <View style={styles.iconCircleSurfaceRight}>
                  <Icon name="monitor-heart" size={24} color={colors.onSurfaceVariant} />
                </View>
              </View>
            </FadeIn>

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
  },
  pageHeader: {
    marginBottom: spacing.lg,
  },
  pageTitle: {
    ...typography.headlineLg,
    color: colors.onSurface,
    marginBottom: spacing.base,
  },
  pageSubtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.gutterMobile,
  },
  bentoCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHighest, // #E2E8F0
    ...shadows.sm,
    padding: spacing.md,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  bentoFullRow: {
    width: '100%',
  },
  bentoCardHalf: {
    width: '47%',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHighest,
    ...shadows.sm,
    padding: spacing.md,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  activeStateCard: {
    borderColor: colors.primaryFixed,
    ...shadows.md,
  },
  errorStateCard: {
    borderColor: colors.error,
    backgroundColor: colors.errorContainer,
    ...shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardLabel: {
    ...typography.labelLg,
    color: colors.onSurfaceVariant,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.tertiaryFixed,
  },
  statusBadgeText: {
    ...typography.labelSm,
    color: colors.tertiary,
  },
  activeBadge: {
    backgroundColor: colors.primaryFixed,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  activeBadgeText: {
    ...typography.labelSm,
    color: colors.primary,
  },
  cardBodyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardBodyCol: {
    alignItems: 'flex-start',
    position: 'relative',
    minHeight: 70,
    justifyContent: 'flex-end',
  },
  cardValue: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginBottom: spacing.base,
  },
  cardValueSmall: {
    ...typography.titleLg,
    color: colors.onSurface,
    marginBottom: spacing.base,
  },
  cardSubValue: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
  },
  directionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  iconCirclePrimary: {
    backgroundColor: colors.primaryFixed,
    padding: spacing.sm,
    borderRadius: radius.full,
  },
  iconCirclePrimaryContainer: {
    backgroundColor: colors.primaryContainer,
    padding: spacing.sm,
    borderRadius: radius.full,
    shadowColor: colors.primaryContainer,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  iconCircleTertiary: {
    backgroundColor: colors.tertiaryContainer + '33', // 20% opacity
    padding: spacing.sm,
    borderRadius: radius.full,
  },
  iconCircleError: {
    backgroundColor: colors.error + '33',
    padding: spacing.sm,
    borderRadius: radius.full,
  },
  iconCircleSurfaceRight: {
    backgroundColor: colors.surfaceContainerHighest,
    padding: spacing.sm,
    borderRadius: radius.full,
    position: 'absolute',
    top: 0,
    right: 0,
  },
});

export default RobotStatusScreen;
