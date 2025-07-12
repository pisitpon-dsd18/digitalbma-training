import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <FontAwesome name="compass" size={60} color="#10b981" />
      <Text style={styles.title}>Explore</Text>
      <Text style={styles.subtitle}>ค้นหาสิ่งใหม่ๆ ได้ที่นี่</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0fdf4', // A light green background
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 24,
    color: '#059669',
  },
  subtitle: {
    fontSize: 16,
    color: '#34d399',
    marginTop: 8,
  },
});
