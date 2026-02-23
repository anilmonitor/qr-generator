import { FontAwesome } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { Alert, Dimensions, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function TabOneScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState<string | null>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <FontAwesome name="camera" size={60} color="#7F60F9" style={{ marginBottom: 20 }} />
        <Text style={styles.permissionText}>We need your permission to use the camera</Text>
        <TouchableOpacity style={styles.grantButton} onPress={requestPermission}>
          <Text style={styles.grantButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScannedData(data);
  };

  const copyToClipboard = async () => {
    if (scannedData) {
      await Clipboard.setStringAsync(scannedData);
      Alert.alert('Copied!', 'Data copied to clipboard');
    }
  };

  const openLink = async () => {
    if (scannedData) {
      const supported = await Linking.canOpenURL(scannedData);
      if (supported) {
        await Linking.openURL(scannedData);
      } else {
        Alert.alert('Error', 'Cannot open this URL');
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={scannedData ? undefined : handleBarCodeScanned}
      >
        <View style={styles.overlay}>
          <View style={styles.topOverlay} />
          <View style={styles.middleRow}>
            <View style={styles.sideOverlay} />
            <View style={styles.scanBox}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            <View style={styles.sideOverlay} />
          </View>
          <View style={styles.bottomOverlay}>
            {!scannedData ? (
              <Text style={styles.scanInstructions}>Align QR code within the frame</Text>
            ) : null}
          </View>

          {scannedData && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultLabel}>Scanned Result:</Text>
              <Text style={styles.resultText} numberOfLines={3}>
                {scannedData}
              </Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.actionButton} onPress={copyToClipboard}>
                  <FontAwesome name="copy" size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>Copy</Text>
                </TouchableOpacity>
                {scannedData.startsWith('http') && (
                  <TouchableOpacity style={[styles.actionButton, styles.primaryButton]} onPress={openLink}>
                    <FontAwesome name="external-link" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Open</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.scanAgainButton} onPress={() => setScannedData(null)}>
                  <FontAwesome name="refresh" size={20} color="#7F60F9" />
                  <Text style={styles.scanAgainText}>Scan Again</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </CameraView>
    </View>
  );
}

const scanBoxSize = width * 0.7;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  permissionText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
    fontWeight: '500',
  },
  grantButton: {
    backgroundColor: '#7F60F9',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  grantButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
  },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  middleRow: {
    flexDirection: 'row',
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  scanBox: {
    width: scanBoxSize,
    height: scanBoxSize,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    paddingTop: 30,
  },
  scanInstructions: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#7F60F9',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  resultContainer: {
    position: 'absolute',
    bottom: 100, // Above the bottom tab bar
    left: 20,
    right: 20,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  resultLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  resultText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#333',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#7F60F9',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scanAgainButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  scanAgainText: {
    color: '#7F60F9',
    fontSize: 16,
    fontWeight: '600',
  },
});
