import { supabase } from '@/supabaseClient';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
// การตั้งค่า Google Sign-in อาจต้องใช้ไลบรารีเพิ่มเติมเพื่อจัดการ Web-Browser
// แนะนำให้ติดตั้ง: npx expo install expo-web-browser expo-crypto
import * as WebBrowser from 'expo-web-browser';

// จำเป็นสำหรับการทำงานของ Supabase OAuth บนมือถือ
if (Platform.OS !== 'web') {
  WebBrowser.maybeCompleteAuthSession();
}

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      Alert.alert('เข้าสู่ระบบไม่สำเร็จ', error.message);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    // --- ขั้นตอนการตั้งค่าที่จำเป็น ---
    // 1. ไปที่ไฟล์ app.json (หรือ app.config.js)
    // 2. เพิ่ม "scheme": "yourappname" เข้าไปในส่วน "expo"
    //    ตัวอย่าง:
    //    "expo": {
    //      "scheme": "digitalbma",
    //      ...
    //    }
    // 3. นำชื่อ scheme (เช่น "myapp") ไปใส่ใน Redirect URLs ของ Google Provider ใน Supabase Dashboard
    //    URL ควรจะเป็น: myapp://callback
    // ------------------------------------
    
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                // หากคุณตั้งค่า scheme ใน app.json แล้ว ไม่จำเป็นต้องใส่ redirectTo ที่นี่
                // Supabase จะจัดการให้โดยอัตโนมัติ
            },
        });

        if (error) {
            Alert.alert('Google Login Error', error.message);
        }
    } catch (error) {
        // Handle exceptions from the OAuth flow
        if (error instanceof Error) {
            Alert.alert('An unexpected error occurred', error.message);
        }
    }
  };

  return (
    <View className="justify-center flex-1 px-8 bg-gray-50 dark:bg-gray-900">
      <View className="items-center mb-10">
        <FontAwesome name="lock" size={40} color="#3b82f6" />
        <Text className="mt-4 text-3xl font-bold text-center text-blue-600 dark:text-blue-400">
          ยินดีต้อนรับ
        </Text>
        <Text className="text-base text-center text-gray-500 dark:text-gray-400">
          กรุณาเข้าสู่ระบบเพื่อใช้งาน
        </Text>
      </View>

      <TextInput
        className="w-full px-4 py-3 mb-4 text-base bg-white border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        placeholder="อีเมล"
        placeholderTextColor="#9ca3af"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        className="w-full px-4 py-3 mb-6 text-base bg-white border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        placeholder="รหัสผ่าน"
        placeholderTextColor="#9ca3af"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        className="flex-row items-center justify-center w-full py-3 mb-4 bg-blue-600 rounded-lg shadow-md shadow-blue-300 dark:shadow-none"
      >
        {loading ? (
            <ActivityIndicator color="#fff" />
        ) : (
            <Text className="text-lg font-semibold text-center text-white">
                ล็อกอิน
            </Text>
        )}
      </TouchableOpacity>
      
      {/* --- ปุ่ม Google Login ที่เพิ่มเข้ามา --- */}
      <View className="flex-row items-center my-4">
          <View className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
          <Text className="mx-4 text-gray-500 dark:text-gray-400">หรือ</Text>
          <View className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
      </View>

      <TouchableOpacity
        onPress={handleGoogleLogin}
        className="flex-row items-center justify-center w-full py-3 bg-white border border-gray-300 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-600"
      >
        <FontAwesome name="google" size={20} color="#0D75FD" className="mr-3" />
        <Text className="text-lg font-semibold text-center text-gray-700 dark:text-white">
          เข้าสู่ระบบด้วย Google
        </Text>
      </TouchableOpacity>
      {/* ------------------------------------ */}

      <View className="flex-row justify-center mt-6">
        <Text className="text-gray-600 dark:text-gray-400">ยังไม่มีบัญชี? </Text>
        <TouchableOpacity onPress={() => router.push('/auth/signup')}>
            <Text className="font-semibold text-blue-600 dark:text-blue-400">สมัครสมาชิกที่นี่</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
