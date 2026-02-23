import { FontAwesome, Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useRef, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';

export default function GenerateScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const router = useRouter();

  // Input states depending on type
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');

  const [links, setLinks] = useState('');

  const [generatedValue, setGeneratedValue] = useState<string | null>(null);
  const viewShotRef = useRef<ViewShot>(null);

  const getTitle = () => {
    switch (type) {
      case 'email': return 'Email';
      case 'website': return 'Website';
      case 'wifi': return 'Wifi';
      case 'multilinks': return 'Links';
      default: return 'Generate';
    }
  };

  const handleGenerate = () => {
    let value = '';
    if (type === 'website') {
      value = websiteUrl;
    } else if (type === 'email') {
      value = `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    } else if (type === 'wifi') {
      value = `WIFI:S:${wifiSsid};T:WPA;P:${wifiPassword};;`;
    } else if (type === 'multilinks') {
      value = links;
    }

    if (!value || value.trim() === '') {
      Alert.alert('Error', 'Please enter some data to generate');
      return;
    }
    setGeneratedValue(value);
  };

  const shareQRCode = async () => {
    try {
      if (viewShotRef.current && viewShotRef.current.capture) {
        const uri = await viewShotRef.current.capture();
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        } else {
          Alert.alert('Error', 'Sharing is not available on this device');
        }
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not share the QR code');
    }
  };

  const saveQRCode = async () => {
    try {
      if (viewShotRef.current && viewShotRef.current.capture) {
        const { status } = await MediaLibrary.requestPermissionsAsync(true, ['photo']);
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Please grant permission to save the QR code to your gallery.');
          return;
        }

        const uri = await viewShotRef.current.capture();
        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert('Success', 'QR Code saved to gallery successfully!');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not save the QR code');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Purple Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{getTitle()}</Text>
          <Text style={styles.headerSubtitle}>Your QR Code will be generated automatically.</Text>
        </View>

        {/* Dynamic Inputs or Result */}
        {!generatedValue ? (
          <View style={styles.inputCard}>
            {type === 'website' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Website URL</Text>
                <TextInput
                  style={styles.input}
                  placeholder="https://example.com"
                  placeholderTextColor="#A0A0A0"
                  value={websiteUrl}
                  onChangeText={setWebsiteUrl}
                  autoCapitalize="none"
                  keyboardType="url"
                />
              </View>
            )}

            {type === 'email' && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email Address</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="example@mail.com"
                    placeholderTextColor="#A0A0A0"
                    value={emailTo}
                    onChangeText={setEmailTo}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Subject</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Email Subject"
                    placeholderTextColor="#A0A0A0"
                    value={emailSubject}
                    onChangeText={setEmailSubject}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Message</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Message body..."
                    placeholderTextColor="#A0A0A0"
                    value={emailBody}
                    onChangeText={setEmailBody}
                    multiline
                  />
                </View>
              </>
            )}

            {type === 'wifi' && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Network Name (SSID)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="My Network"
                    placeholderTextColor="#A0A0A0"
                    value={wifiSsid}
                    onChangeText={setWifiSsid}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#A0A0A0"
                    value={wifiPassword}
                    onChangeText={setWifiPassword}
                    secureTextEntry
                  />
                </View>
              </>
            )}

            {type === 'multilinks' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Link</Text>
                <TextInput
                  style={styles.input}
                  placeholder="https://link.com"
                  placeholderTextColor="#A0A0A0"
                  value={links}
                  onChangeText={setLinks}
                  autoCapitalize="none"
                />
              </View>
            )}
          </View>
        ) : (
          <View style={styles.resultContainer}>
            <View style={styles.qrCard}>
              <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
                <View style={styles.qrWrapper}>
                  <QRCode
                    value={generatedValue}
                    size={220}
                    color="#7F60F9" // Figma design showed purple QR code
                    backgroundColor="white"
                  />
                </View>
              </ViewShot>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionBtn} onPress={shareQRCode}>
                  <View style={styles.actionIconContainer}>
                    <Ionicons name="share-social" size={24} color="#7F60F9" />
                  </View>
                  <Text style={styles.actionBtnText}>Share</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionBtn} onPress={saveQRCode}>
                  <View style={styles.actionIconContainer}>
                    <Ionicons name="download" size={24} color="#7F60F9" />
                  </View>
                  <Text style={styles.actionBtnText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity style={styles.redoBtn} onPress={() => setGeneratedValue(null)}>
              <Text style={styles.redoBtnText}>Create Another</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* FAB - Only show if not generated yet */}
      {!generatedValue && (
        <TouchableOpacity style={styles.fab} onPress={handleGenerate}>
          <FontAwesome name="qrcode" size={32} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5FF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Room for FAB
  },
  header: {
    backgroundColor: '#7F60F9',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E0D4FF',
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginHorizontal: 20,
    marginTop: -20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F7F5FF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#EAE5FF',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  resultContainer: {
    alignItems: 'center',
    marginTop: -20,
    paddingHorizontal: 20,
  },
  qrCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 30,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#7F60F9',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 30,
    elevation: 10,
  },
  qrWrapper: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 40,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  actionBtn: {
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0ECFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionBtnText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '600',
  },
  redoBtn: {
    marginTop: 30,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  redoBtnText: {
    color: '#7F60F9',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#7F60F9',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7F60F9',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 10,
  },
});
