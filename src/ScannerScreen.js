import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useFocusEffect } from '@react-navigation/native';

export default function ScannerScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(scanAnim, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [scanAnim]);

  useEffect(() => {
    if (!permission || !permission.granted) requestPermission();
  }, [permission, requestPermission]);

  useFocusEffect(
    React.useCallback(() => {
      setScanned(false);
      setTorchOn(false);
      scanAnim.setValue(0);
    }, [scanAnim])
  );

  if (!permission) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionScreen}>
        <View style={styles.permissionCard}>
          <Image
            source={require('../assets/newlogo.png')}
            style={styles.permissionLogo}
            resizeMode="contain"
          />
          <Text style={styles.permissionTitle}>Camera access required</Text>
          <Text style={styles.permissionText}>
            Enable camera permission to scan product barcodes in real time.
          </Text>
          <Pressable style={styles.ctaButton} onPress={requestPermission}>
            <Text style={styles.ctaButtonText}>Enable Camera</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const handleBarcodeScanned = ({ data }) => {
    if (scanned || !data) return;
    setScanned(true);
    navigation.navigate('Results', { barcode: data });
  };

  const scanLineTranslate = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 150],
  });

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        enableTorch={torchOn}
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'qr'],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />

      <SafeAreaView style={styles.overlay}>
        {/* Top panel */}
        <View style={styles.topPanel}>
          <Image
            source={require('../assets/newlogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.topText}>
            <Text style={styles.title}>Center barcode in frame</Text>
            <Text style={styles.subtitle}>UPC · EAN · QR supported</Text>
          </View>
        </View>

        {/* Scan frame */}
        <View style={styles.scanFrameWrap}>
          <View style={styles.scanFrame}>
            {!scanned && (
              <Animated.View
                style={[styles.scanLine, { transform: [{ translateY: scanLineTranslate }] }]}
              />
            )}
          </View>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>

        {/* Bottom panel */}
        <View style={styles.bottomPanel}>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, scanned && styles.statusDotScanned]} />
            <Text style={styles.statusText}>
              {scanned ? 'Captured — loading prices' : 'Ready to scan'}
            </Text>
          </View>
          <View style={styles.bottomActions}>
            <Pressable
              style={[styles.actionBtn, torchOn && styles.actionBtnActive]}
              onPress={() => setTorchOn((v) => !v)}
            >
              <Text style={styles.actionBtnText}>{torchOn ? '🔦 On' : '🔦 Off'}</Text>
            </Pressable>
            {scanned && (
              <Pressable style={[styles.actionBtn, styles.actionBtnOrange]} onPress={() => setScanned(false)}>
                <Text style={[styles.actionBtnText, { color: '#f97316' }]}>Scan Again</Text>
              </Pressable>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#07091e' },
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#07091e',
  },

  // Permission screen
  permissionScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#07091e',
  },
  permissionCard: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    backgroundColor: '#0d1135',
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e2354',
  },
  permissionLogo: {
    width: 140,
    height: 90,
    marginBottom: 16,
    borderRadius: 12,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#64748b',
    marginBottom: 20,
    textAlign: 'center',
  },
  ctaButton: {
    width: '100%',
    backgroundColor: '#f97316',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#f97316',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  ctaButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },

  // Camera overlay
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingBottom: 16,
  },

  // Top panel
  topPanel: {
    marginTop: 4,
    backgroundColor: 'rgba(7, 9, 30, 0.88)',
    borderRadius: 20,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.15)',
  },
  logo: {
    width: 70,
    height: 50,
    borderRadius: 10,
  },
  topText: { flex: 1 },
  title: { color: '#f1f5f9', fontSize: 16, fontWeight: '700', marginBottom: 2 },
  subtitle: { color: '#475569', fontSize: 12 },

  // Scan frame
  scanFrameWrap: {
    alignSelf: 'center',
    width: '80%',
    maxWidth: 320,
    aspectRatio: 1.35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    borderColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    backgroundColor: 'rgba(7, 9, 30, 0.18)',
    overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    height: 2,
    backgroundColor: '#f97316',
    borderRadius: 2,
    shadowColor: '#f97316',
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  corner: { position: 'absolute', width: 26, height: 26, borderColor: '#f97316' },
  topLeft:    { top: 0, left: 0,     borderTopWidth: 3, borderLeftWidth: 3,   borderTopLeftRadius: 10 },
  topRight:   { top: 0, right: 0,    borderTopWidth: 3, borderRightWidth: 3,  borderTopRightRadius: 10 },
  bottomLeft: { bottom: 0, left: 0,  borderBottomWidth: 3, borderLeftWidth: 3,  borderBottomLeftRadius: 10 },
  bottomRight:{ bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 10 },

  // Bottom panel
  bottomPanel: {
    backgroundColor: 'rgba(7, 9, 30, 0.88)',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.15)',
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#f97316' },
  statusDotScanned: { backgroundColor: '#fbbf24' },
  statusText: { color: '#cbd5e1', fontWeight: '600', fontSize: 14 },
  bottomActions: { flexDirection: 'row', gap: 10 },
  actionBtn: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 16,
    paddingVertical: 9,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  actionBtnActive: {
    borderColor: '#f97316',
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
  },
  actionBtnOrange: { borderColor: '#f97316' },
  actionBtnText: { color: '#94a3b8', fontWeight: '600', fontSize: 13 },
});
