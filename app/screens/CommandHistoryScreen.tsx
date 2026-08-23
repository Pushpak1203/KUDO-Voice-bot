import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, SectionList, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import Icon from '@react-native-vector-icons/material-icons';

import { IconButton } from '../components/IconButton';
import { useHistory } from '../hooks/useHistory';
import { HistoryService } from '../services/history/HistoryService';
import { LogEntry } from '../utils/Logger';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { radius } from '../theme/radius';
import { shadows } from '../theme/shadows';

const CommandHistoryScreen = ({ navigation }: any) => {
  const logs = useHistory();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and Group logs by Session ID
  const groupedLogs = useMemo(() => {
    let filtered = logs;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = logs.filter(l => 
        l.message.toLowerCase().includes(q) || 
        l.tag.toLowerCase().includes(q)
      );
    }

    const groups: { [key: string]: LogEntry[] } = {};
    filtered.forEach(log => {
      if (!groups[log.sessionId]) {
        groups[log.sessionId] = [];
      }
      groups[log.sessionId].push(log);
    });

    return Object.keys(groups).map(sessionId => ({
      title: `Session: ${sessionId}`,
      data: groups[sessionId]
    }));
  }, [logs, searchQuery]);

  const handleClearHistory = () => {
    Alert.alert('Clear History', 'Are you sure you want to delete all logs?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => HistoryService.clearHistory() }
    ]);
  };

  const handleExport = () => {
    const json = HistoryService.exportLogs();
    // In a real app, use react-native-share to export this file
    Alert.alert('Export Placeholder', `Logs ready for export. Size: ${json.length} bytes.`);
  };

  const renderLogIcon = (log: LogEntry) => {
    if (log.level === 'ERROR') {
      return (
        <View style={[styles.iconCircle, { backgroundColor: colors.errorContainer }]}>
          <Icon name="error" size={24} color={colors.error} />
        </View>
      );
    }

    switch (log.tag) {
      case 'COMMAND':
        return (
          <View style={[styles.iconCircle, { backgroundColor: colors.secondaryContainer }]}>
            <Icon name="arrow-upward" size={24} color={colors.primaryContainer} />
          </View>
        );
      case 'RECEIVED':
        return (
          <View style={[styles.iconCircle, { backgroundColor: colors.tertiaryContainer + '33' }]}>
            <Icon name="download" size={24} color={colors.tertiary} />
          </View>
        );
      case 'CONNECTION':
      case 'BLUETOOTH':
        return (
          <View style={[styles.iconCircle, { backgroundColor: colors.primaryFixedDim }]}>
            <Icon name="bluetooth" size={24} color={colors.primary} />
          </View>
        );
      default:
        return (
          <View style={[styles.iconCircle, { backgroundColor: colors.surfaceContainerHighest }]}>
            <Icon name="info" size={24} color={colors.onSurfaceVariant} />
          </View>
        );
    }
  };

  const renderItem = ({ item }: { item: LogEntry }) => {
    const time = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    return (
      <View style={styles.logItem}>
        {renderLogIcon(item)}
        <View style={styles.logContent}>
          <Text style={styles.logTitle} numberOfLines={1}>{item.message}</Text>
          <Text style={styles.logSubtitle}>{item.tag} • {item.level}</Text>
        </View>
        <View style={styles.logRight}>
          <Text style={styles.logTime}>{time}</Text>
          <Icon name="check-circle" size={16} color={colors.tertiary} style={{ marginTop: 4 }} />
        </View>
      </View>
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
          <Text style={styles.headerTitle}>KUDO VoiceBot</Text>
        </View>
        <IconButton 
          iconName="bluetooth-connected" 
          onPress={() => navigation.navigate('Bluetooth')} 
        />
      </View>

      <View style={styles.content}>
        <View style={styles.pageHeader}>
          <View style={styles.headerRow}>
            <Text style={styles.pageTitle}>History</Text>
            <View style={styles.actionRow}>
              <TouchableOpacity onPress={handleExport} style={styles.actionBtn}>
                <Icon name="ios-share" size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleClearHistory} style={styles.actionBtn}>
                <Icon name="delete-outline" size={20} color={colors.error} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color={colors.onSurfaceVariant} style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search commands..."
              placeholderTextColor={colors.onSurfaceVariant}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <SectionList
          sections={groupedLogs}
          keyExtractor={(item, index) => item.timestamp + index}
          renderItem={renderItem}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{title}</Text>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="history" size={48} color={colors.outlineVariant} />
              <Text style={styles.emptyText}>No history found</Text>
            </View>
          }
        />
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
  },
  pageHeader: {
    marginVertical: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  pageTitle: {
    ...typography.headlineLg,
    color: colors.onSurface,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    padding: spacing.xs,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    height: 48,
    ...shadows.sm,
    marginBottom: spacing.md,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.bodyLg,
    color: colors.onSurface,
  },
  listContent: {
    paddingBottom: 100,
  },
  sectionHeader: {
    backgroundColor: colors.background,
    paddingVertical: spacing.sm,
    marginTop: spacing.md,
  },
  sectionHeaderText: {
    ...typography.labelLg,
    color: colors.primary,
    textTransform: 'uppercase',
  },
  logItem: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.xl,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    borderColor: colors.surfaceContainerHighest,
    borderWidth: 1,
    ...shadows.sm,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  logContent: {
    flex: 1,
    justifyContent: 'center',
  },
  logTitle: {
    ...typography.titleMd,
    color: colors.onSurface,
    marginBottom: 2,
  },
  logSubtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  logRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  logTime: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyText: {
    ...typography.titleMd,
    color: colors.outlineVariant,
    marginTop: spacing.sm,
  },
});

export default CommandHistoryScreen;
