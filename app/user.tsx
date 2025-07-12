import { supabase } from '@/supabaseClient';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from './_layout'; // Import the useAuth hook

export default function UserScreen() {
  const { session } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Logout Failed', error.message);
    }
    // The root layout will automatically redirect to login
  };

  return (
    <View className="items-center justify-center flex-1 p-8 bg-gray-100 dark:bg-gray-800">
      <FontAwesome name="user-circle" size={80} color="#3b82f6" className="mb-4" />
      <Text className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-100">สวัสดี!</Text>
      <Text className="mb-8 text-base text-gray-600 dark:text-gray-300">
        {session?.user?.email}
      </Text>
      <TouchableOpacity
        onPress={handleLogout}
        className="flex-row items-center justify-center w-full py-3 bg-red-500 rounded-lg shadow"
      >
        <FontAwesome name="sign-out" size={20} color="white" className="mr-2" />
        <Text className="text-lg font-semibold text-center text-white">
          ออกจากระบบ
        </Text>
      </TouchableOpacity>
    </View>
  );
}