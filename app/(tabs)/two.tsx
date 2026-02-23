import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CATEGORIES = [
  { id: 'email', name: 'Email', icon: 'envelope' },
  { id: 'website', name: 'Website', icon: 'globe' },
  { id: 'wifi', name: 'Wifi', icon: 'wifi' },
  { id: 'multilinks', name: 'Links', icon: 'link' },
];

export default function TabTwoScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>QR-Generator</Text>
      </View>
      
      <View style={styles.container}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity 
            key={cat.id} 
            style={styles.card} 
            onPress={() => router.push(`/generate/${cat.id}` as any)}
          >
            <View style={styles.iconContainer}>
              <FontAwesome name={cat.icon as any} size={24} color="#7F60F9" />
            </View>
            <Text style={styles.cardText}>{cat.name}</Text>
            <FontAwesome name="chevron-right" size={16} color="#CCCCCC" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F7F5FF',
  },
  header: {
    paddingTop: 80,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
  },
  container: {
    paddingHorizontal: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F0ECFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
});
