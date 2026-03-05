import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useFocusEffect } from '@react-navigation/native';

export default function ScannerScreen({ navigation }) {
  // Expo hook returns current permission state + a function to ask for permission.
  const [permission, requestPermission] = useCameraPermissions();
  // Locks the scanner after first successful read to prevent duplicate navigations.
  const [scanned, setScanned] = useState(false);

  // Ask for camera permission as soon as this screen loads.
  useEffect(() => {
    if (!permission || !permission.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  // Reset scan lock every time user returns to this screen.
  useFocusEffect(
    React.useCallback(() => {
      setScanned(false);
    }, [])
  );

  if (!permission) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#0f766e" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionScreen}>
        <View style={styles.permissionCard}>
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

  // CameraView sends an object with `data` when a code is detected.
  const handleBarcodeScanned = ({ data }) => {
    if (scanned || !data) return;
    setScanned(true);
    // Pass scanned barcode to Results screen via navigation params.
    navigation.navigate('Results', { barcode: data });
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        barcodeScannerSettings={{
          // Restrict scanner to common barcode formats for better reliability.
          barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'qr'],
        }}
        // Disable callback after first scan until user explicitly resets.
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />

      <SafeAreaView style={styles.overlay}>
        <View style={styles.topPanel}>
          <Text style={styles.kicker}>BARTAR SCANNER</Text>
          <Text style={styles.title}>Center barcode in the frame</Text>
          <Text style={styles.subtitle}>Fast scan for UPC, EAN and QR codes</Text>
        </View>

        <View style={styles.scanFrameWrap}>
          <View style={styles.scanFrame} />
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>

        <View style={styles.bottomPanel}>
          <Text style={styles.statusText}>
            {scanned ? 'Barcode captured' : 'Scanning live'}
          </Text>
          {scanned ? (
            <Pressable style={styles.secondaryButton} onPress={() => setScanned(false)}>
              <Text style={styles.secondaryButtonText}>Scan Again</Text>
            </Pressable>
          ) : null}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  permissionScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f1f5f9',
  },
  permissionCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    padding: 22,
    shadowColor: '#0f172a',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#475569',
    marginBottom: 18,
  },
  ctaButton: {
    backgroundColor: '#0f766e',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  topPanel: {
    marginTop: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.68)',
    borderRadius: 16,
    padding: 14,
  },
  kicker: {
    color: '#5eead4',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 2,
  },
  subtitle: {
    color: '#cbd5e1',
    fontSize: 14,
  },
  scanFrameWrap: {
    alignSelf: 'center',
    width: '78%',
    maxWidth: 340,
    aspectRatio: 1.35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderWidth: 1.5,
    backgroundColor: 'rgba(15, 23, 42, 0.22)',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: '#5eead4',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12,
  },
  bottomPanel: {
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
  },
  statusText: {
    color: '#f8fafc',
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryButton: {
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#5eead4',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  secondaryButtonText: {
    color: '#5eead4',
    fontWeight: '700',
    fontSize: 13,
  },
});
