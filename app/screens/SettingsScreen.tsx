import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import Icon from '@react-native-vector-icons/material-icons';

import { IconButton } from '../components/IconButton';
import { bluetoothConfig } from '../config/bluetooth.config';
import { Logger, LogLevel } from '../utils/Logger';
import { HistoryService } from '../services/history/HistoryService';
import { useBluetooth } from '../hooks/useBluetooth';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { radius } from '../theme/radius';
import { shadows } from '../theme/shadows';

const APP_VERSION = 'v0.0.1 (Build 1)';
const PROTOCOL_VERSION = 'v1.0.0 (RFCOMM)';
const DEVELOPER = 'Stitch KUDO AI';
const ARCHITECTURE = 'State Machine & Pub/Sub';

const getLogLevelString = (level: LogLevel) => {
  switch(level) {
    case LogLevel.DEBUG: return 'DEBUG';
    case LogLevel.INFO: return 'INFO';
    case LogLevel.WARN: return 'WARN';
    case LogLevel.ERROR: return 'ERROR';
    default: return 'UNKNOWN';
  }
};

const SettingsScreen = ({ navigation }: any) => {
  const { connectionState } = useBluetooth();
  
  // Using local state for Mock BT just for UI representation,
  // real implementation would persist to AsyncStorage or env config.
  const [isMockBT, setIsMockBT] = useState(false);

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to permanently delete all command and telemetry logs? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete Forever', 
          style: 'destructive', 
          onPress: () => {
            HistoryService.clearHistory();
            Logger.info('SYSTEM', 'Command history manually cleared by user');
          } 
        }
      ]
    );
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
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
        <IconButton 
          iconName="bluetooth-connected" 
          onPress={() => navigation.navigate('Bluetooth')} 
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Connection Configuration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connection Configuration</Text>
          <View style={styles.card}>
            
            <View style={styles.listItem}>
              <View style={styles.listLeft}>
                <Icon name="bluetooth" size={24} color={colors.secondary} />
                <View style={styles.listTextContainer}>
                  <Text style={styles.listTitle}>Bluetooth Status</Text>
                  <Text style={styles.listSubtitle}>{connectionState}</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={24} color={colors.onSurfaceVariant} />
            </View>

            <View style={[styles.listItem, styles.lastItem]}>
              <View style={styles.listLeft}>
                <Icon name="timer" size={24} color={colors.secondary} />
                <View style={styles.listTextContainer}>
                  <Text style={styles.listTitle}>Connection Timeout</Text>
                  <Text style={styles.listSubtitle}>{bluetoothConfig.connectionTimeoutMs} ms</Text>
                </View>
              </View>
            </View>
            
          </View>
        </View>

        {/* System & Telemetry */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System & Telemetry</Text>
          <View style={styles.card}>
            
            <View style={styles.listItem}>
              <View style={styles.listLeft}>
                <Icon name="fingerprint" size={24} color={colors.secondary} />
                <View style={styles.listTextContainer}>
                  <Text style={styles.listTitle}>Session ID</Text>
                  <Text style={styles.listSubtitle}>{Logger.sessionId}</Text>
                </View>
              </View>
            </View>

            <View style={styles.listItem}>
              <View style={styles.listLeft}>
                <Icon name="bug-report" size={24} color={colors.secondary} />
                <View style={styles.listTextContainer}>
                  <Text style={styles.listTitle}>Log Level</Text>
                  <Text style={styles.listSubtitle}>{getLogLevelString(Logger.level)}</Text>
                </View>
              </View>
            </View>

            <View style={styles.listItem}>
              <View style={styles.listLeft}>
                <Icon name="compare-arrows" size={24} color={colors.secondary} />
                <View style={styles.listTextContainer}>
                  <Text style={styles.listTitle}>Protocol Version</Text>
                  <Text style={styles.listSubtitle}>{PROTOCOL_VERSION}</Text>
                </View>
              </View>
            </View>

            {__DEV__ && (
              <View style={styles.listItem}>
                <View style={styles.listLeft}>
                  <Icon name="science" size={24} color={colors.secondary} />
                  <View style={styles.listTextContainer}>
                    <Text style={styles.listTitle}>Mock Bluetooth (Dev)</Text>
                    <Text style={styles.listSubtitle}>Simulate RFCOMM responses</Text>
                  </View>
                </View>
                <Switch 
                  value={isMockBT}
                  onValueChange={setIsMockBT}
                  trackColor={{ false: colors.surfaceContainerHighest, true: colors.primary }}
                  thumbColor={isMockBT ? colors.onPrimary : colors.outline}
                />
              </View>
            )}

            <TouchableOpacity style={[styles.listItem, styles.lastItem]} onPress={handleClearHistory} activeOpacity={0.7}>
              <View style={styles.listLeft}>
                <Icon name="delete-sweep" size={24} color={colors.error} />
                <View style={styles.listTextContainer}>
                  <Text style={styles.listTitle}>Clear History & Logs</Text>
                  <Text style={styles.listSubtitle}>Delete all stored session telemetry</Text>
                </View>
              </View>
            </TouchableOpacity>

          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            
            <View style={styles.listItem}>
              <View style={styles.listLeft}>
                <Icon name="info" size={24} color={colors.secondary} />
                <View style={styles.listTextContainer}>
                  <Text style={styles.listTitle}>Application Name</Text>
                  <Text style={styles.listSubtitle}>KUDO VoiceBot</Text>
                </View>
              </View>
            </View>

            <View style={styles.listItem}>
              <View style={styles.listLeft}>
                <Icon name="code" size={24} color={colors.secondary} />
                <View style={styles.listTextContainer}>
                  <Text style={styles.listTitle}>Developer</Text>
                  <Text style={styles.listSubtitle}>{DEVELOPER}</Text>
                </View>
              </View>
            </View>

            <View style={styles.listItem}>
              <View style={styles.listLeft}>
                <Icon name="architecture" size={24} color={colors.secondary} />
                <View style={styles.listTextContainer}>
                  <Text style={styles.listTitle}>Architecture</Text>
                  <Text style={styles.listSubtitle}>{ARCHITECTURE}</Text>
                </View>
              </View>
            </View>

            <View style={[styles.listItem, styles.lastItem]}>
              <View style={styles.listLeft}>
                <Icon name="update" size={24} color={colors.secondary} />
                <View style={styles.listTextContainer}>
                  <Text style={styles.listTitle}>Version</Text>
                  <Text style={styles.listSubtitle}>{APP_VERSION}</Text>
                </View>
              </View>
            </View>

          </View>
        </View>

      </ScrollView>
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
    ...typography.headlineMd,
    color: colors.primary,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: spacing.lg,
    paddingBottom: 100,
    gap: spacing.xl,
  },
  section: {},
  sectionTitle: {
    ...typography.titleMd,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.base,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    ...shadows.sm,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    height: 72,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: colors.surfaceContainerLowest,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  listLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  listTextContainer: {
    flex: 1,
  },
  listTitle: {
    ...typography.bodyLg,
    color: colors.onSurface,
  },
  listSubtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
});

export default SettingsScreen;
