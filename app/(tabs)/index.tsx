import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useAuth } from '../_layout';

export default function HomeScreen() {
  const { session, loading } = useAuth();
  
  if (loading) {
    return (
      <View className="items-center justify-center flex-1 bg-gray-50 dark:bg-gray-900">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View className="items-center justify-center flex-1 p-6 bg-gray-50 dark:bg-gray-900">
      <FontAwesome name="home" size={60} color="#3b82f6" />
      <Text className="mt-6 text-3xl font-bold text-gray-800 dark:text-gray-100">
        หน้าหลัก
      </Text>
      <Text className="mt-4 text-lg text-center text-gray-600 dark:text-gray-300">
        ยินดีต้อนรับ,
      </Text>
      <Text className="mt-1 text-2xl font-semibold text-center text-blue-600 dark:text-blue-400">
        {session?.user?.user_metadata?.display_name || session?.user?.email}
      </Text>

      <View className="p-4 mt-8 bg-white border border-gray-200 rounded-lg dark:border-gray-700 dark:bg-gray-800">
        <Text className="text-base text-gray-700 dark:text-gray-300">
          <Text className="font-bold">อีเมล:</Text> {session?.user?.email}
        </Text>
        <Text className="mt-2 text-base text-gray-700 dark:text-gray-300">
          <Text className="font-bold">เบอร์โทร:</Text> {session?.user?.user_metadata?.phone || 'ไม่มีข้อมูล'}
        </Text>
      </View>
    </View>
  );
}
