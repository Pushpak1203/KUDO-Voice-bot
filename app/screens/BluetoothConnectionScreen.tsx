import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Header } from '../components/Header';
import { SectionTitle } from '../components/SectionTitle';
import { DeviceItem } from '../components/DeviceItem';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { IconButton } from '../components/IconButton';
import { Pulse } from '../animations/Pulse';
import { FadeIn } from '../animations/FadeIn';
import Icon from '@react-native-vector-icons/material-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useBluetooth } from '../hooks/useBluetooth';
import { ConnectionState } from '../models/ConnectionState';

const BluetoothConnectionScreen = ({ navigation }: any) => {
  const {
    adapterState,
    devices,
    connectionState,
    isScanning,
    initialize,
    scan,
    connect,
    connectedDevice,
    disconnect,
    cancelConnection,
    cleanup,
  } = useBluetooth();

  useEffect(() => {
    initialize();
    
    // Cleanup when leaving the Bluetooth screen
    return () => {
      cleanup();
    };
  }, [initialize, cleanup]);

  return (
    <ScreenContainer>
      <View style={styles.topBar}>
        <IconButton 
          iconName="arrow-back" 
          onPress={() => navigation.goBack()} 
          style={styles.backBtn} 
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <FadeIn duration={400}>
          <View style={styles.headerIconContainer}>
            <Pulse maxScale={1.1} duration={2000}>
              <View style={styles.iconCircle}>
                <View style={styles.iconCircleBorder} />
                <Icon name="bluetooth" size={48} color={colors.primary} />
              </View>
            </Pulse>
          </View>
          <SectionTitle 
            title="Connect Robot" 
            subtitle="Select a device to establish a connection." 
          />
        </FadeIn>

        <FadeIn duration={400} delay={150}>
          <View style={styles.listContainer}>
            
            {devices.length === 0 && !isScanning && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No devices found.</Text>
              </View>
            )}

            {devices.map((device) => {
              const isTargetDevice = connectedDevice?.id === device.id;
              let statusText: 'Paired' | 'Available' | 'Connecting' | 'Connected' = device.isPaired ? 'Paired' : 'Available';
              if (isTargetDevice && connectionState === ConnectionState.CONNECTING) {
                statusText = 'Connecting';
              } else if (isTargetDevice && connectionState === ConnectionState.CONNECTED) {
                statusText = 'Connected';
              }

              return (
                <DeviceItem 
                  key={device.id}
                  name={device.name}
                  status={statusText}
                  iconName={device.name.toLowerCase().includes('robot') || device.name.toLowerCase().includes('voicebot') ? 'smart-toy' : 'bluetooth'}
                  onPress={() => {
                    if (connectionState === ConnectionState.CONNECTED && isTargetDevice) {
                      disconnect();
                    } else if (connectionState === ConnectionState.CONNECTING) {
                      cancelConnection();
                    } else {
                      connect(device.id);
                    }
                  }}
                />
              );
            })}

            <View style={styles.searchContainer}>
              {isScanning ? (
                <View style={styles.scanningContainer}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text style={styles.scanningText}>Scanning...</Text>
                </View>
              ) : (
                <SecondaryButton 
                  title="Search Nearby Devices"
                  iconName="search"
                  onPress={scan}
                />
              )}
            </View>

          </View>
        </FadeIn>

      </ScrollView>

      {/* Sticky Bottom Actions */}
      <FadeIn duration={400} delay={300} style={styles.bottomActions}>
        {connectionState === ConnectionState.ERROR ? (
          <PrimaryButton 
            title="Connection Failed - Retry" 
            iconName="error-outline"
            onPress={() => connectedDevice ? connect(connectedDevice.id) : null} 
          />
        ) : connectionState === ConnectionState.CONNECTED ? (
          <PrimaryButton 
            title="Continue to Dashboard" 
            iconName="arrow-forward"
            onPress={() => navigation.navigate('HomeDashboard')} 
          />
        ) : (
          <PrimaryButton 
            title={connectionState === ConnectionState.CONNECTING ? "Connecting..." : "Select a Device"} 
            iconName="bluetooth-connected"
            onPress={() => {}} 
            disabled={true}
          />
        )}
      </FadeIn>

    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  topBar: {
    height: 64,
    paddingHorizontal: spacing.marginMobile,
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  backBtn: {
    marginLeft: -12,
  },
  scrollContent: {
    paddingHorizontal: spacing.marginMobile,
    paddingBottom: spacing.xl + 80,
  },
  headerIconContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconCircleBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: colors.primary,
    opacity: 0.2,
  },
  listContainer: {
    marginTop: spacing.md,
  },
  searchContainer: {
    marginTop: spacing.md,
    alignItems: 'center',
    height: 56,
    justifyContent: 'center',
  },
  scanningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanningText: {
    ...typography.labelLg,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  emptyText: {
    ...typography.bodyMd,
    color: colors.outline,
  },
  bottomActions: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.marginMobile,
    right: spacing.marginMobile,
    zIndex: 50,
  },
});

export default BluetoothConnectionScreen;
