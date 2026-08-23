import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from '@react-native-vector-icons/material-icons';
import { Header } from '../components/Header';
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

const ManualControlScreen = ({ navigation }: any) => {
  const { connectionState } = useBluetooth();
  const robotStatus = useRobotStatus();

  const isConnected = connectionState === ConnectionState.CONNECTED;

  const handleCommand = (command: RobotCommand) => {
    if (!isConnected) return;
    CommandService.sendCommand(command);
  };

  const getStatusText = () => {
    if (!isConnected) return 'Disconnected';
    if (robotStatus.moving) return `Moving ${robotStatus.direction}`;
    return 'Idle';
  };

  const isDirectionActive = (dir: 'F' | 'B' | 'L' | 'R') => {
    return robotStatus.moving && robotStatus.direction === dir;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <IconButton 
          iconName="arrow-back" 
          onPress={() => navigation.goBack()} 
          style={styles.backBtn} 
        />
        <Text style={styles.headerTitle}>Manual Control</Text>
        <View style={{ width: 48 }} /> {/* Spacer */}
      </View>

      <View style={styles.content}>
        {!isConnected ? (
          <FadeIn style={styles.disconnectedContainer}>
            <Icon name="bluetooth-disabled" size={64} color={colors.error} />
            <Text style={styles.disconnectedTitle}>Connection Lost</Text>
            <Text style={styles.disconnectedText}>
              Bluetooth is disconnected. Please reconnect to continue manual control.
            </Text>
            <PrimaryButton 
              title="Go to Bluetooth Settings" 
              iconName="bluetooth-searching"
              onPress={() => navigation.navigate('Bluetooth')}
            />
          </FadeIn>
        ) : (
          <FadeIn style={styles.controlContainer}>
            {/* Status indicator */}
            <View style={styles.statusBox}>
              <Pulse maxScale={1.2} duration={1500}>
                <View style={[styles.statusDot, { backgroundColor: robotStatus.moving ? colors.primary : colors.tertiaryFixedDim }]} />
              </Pulse>
              <Text style={styles.statusText}>Robot: {getStatusText()}</Text>
            </View>

            {/* D-Pad */}
            <View style={styles.dpadContainer}>
              <View style={styles.dpadRow}>
                <TouchableOpacity 
                  style={[styles.dpadBtn, isDirectionActive('F') && styles.dpadBtnActive]} 
                  onPress={() => handleCommand(RobotCommand.Forward)}
                  disabled={!isConnected}
                >
                  <Icon name="arrow-drop-up" size={48} color={isDirectionActive('F') ? colors.primaryFixedDim : colors.onSurface} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.dpadRowMiddle}>
                <TouchableOpacity 
                  style={[styles.dpadBtn, isDirectionActive('L') && styles.dpadBtnActive]} 
                  onPress={() => handleCommand(RobotCommand.Left)}
                  disabled={!isConnected}
                >
                  <Icon name="arrow-left" size={48} color={isDirectionActive('L') ? colors.primaryFixedDim : colors.onSurface} />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.stopBtn} 
                  onPress={() => handleCommand(RobotCommand.Stop)}
                  disabled={!isConnected}
                >
                  <Text style={styles.stopBtnText}>STOP</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.dpadBtn, isDirectionActive('R') && styles.dpadBtnActive]} 
                  onPress={() => handleCommand(RobotCommand.Right)}
                  disabled={!isConnected}
                >
                  <Icon name="arrow-right" size={48} color={isDirectionActive('R') ? colors.primaryFixedDim : colors.onSurface} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.dpadRow}>
                <TouchableOpacity 
                  style={[styles.dpadBtn, isDirectionActive('B') && styles.dpadBtnActive]} 
                  onPress={() => handleCommand(RobotCommand.Backward)}
                  disabled={!isConnected}
                >
                  <Icon name="arrow-drop-down" size={48} color={isDirectionActive('B') ? colors.primaryFixedDim : colors.onSurface} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Bento Controls */}
            <View style={styles.bentoContainer}>
              <View style={styles.bentoBox}>
                <Icon name="speed" size={32} color={colors.primary} />
                <Text style={styles.bentoText}>Speed: Normal</Text>
              </View>
              <View style={styles.bentoBox}>
                <Icon name="lightbulb" size={32} color={colors.secondary} />
                <Text style={styles.bentoText}>Headlights: Off</Text>
              </View>
            </View>
          </FadeIn>
        )}
      </View>
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
  },
  backBtn: {
    marginLeft: -12,
  },
  headerTitle: {
    ...typography.titleLg,
    color: colors.onSurface,
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
  controlContainer: {
    width: '100%',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingBottom: spacing.xl,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(194, 198, 214, 0.3)', // outlineVariant/30
    ...shadows.sm,
    marginBottom: spacing.xl,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  statusText: {
    ...typography.bodyLg,
    fontWeight: '500',
    color: colors.onSurface,
  },
  dpadContainer: {
    width: 300,
    aspectRatio: 1,
    justifyContent: 'space-between',
    marginVertical: spacing.lg,
  },
  dpadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dpadRowMiddle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dpadBtn: {
    width: 72,
    height: 72,
    backgroundColor: colors.surfaceContainer,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  dpadBtnActive: {
    backgroundColor: colors.primaryFixed,
  },
  stopBtn: {
    width: 88,
    height: 88,
    backgroundColor: colors.error,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  stopBtnText: {
    ...typography.labelLg,
    color: colors.onError,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  bentoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: spacing.xl,
  },
  bentoBox: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.xl,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(194, 198, 214, 0.3)',
    ...shadows.sm,
    marginHorizontal: spacing.xs,
  },
  bentoText: {
    ...typography.labelLg,
    color: colors.onSurface,
    marginTop: spacing.xs,
  }
});

export default ManualControlScreen;
