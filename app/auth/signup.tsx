import { supabase } from '@/supabaseClient';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!displayName.trim() || !phone.trim() || !email.trim() || !password.trim()) {
        Alert.alert('สมัครไม่สำเร็จ', 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
        return;
    }

    if (loading) return;
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          phone: phone,
        },
      },
    });

    if (error) {
      Alert.alert('สมัครไม่สำเร็จ', error.message);
    } else {
      Alert.alert('สมัครสำเร็จ', 'กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชีของคุณ จากนั้นกลับมาล็อกอินอีกครั้ง');
      router.replace('/auth/login');
    }
    setLoading(false);
  };

  return (
    <ScrollView 
        className="flex-1 bg-gray-50 dark:bg-gray-900"
        contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: 32,
        }}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute z-10 p-2 top-16 left-4"
      >
        <FontAwesome name="arrow-left" size={24} color="#3b82f6" />
      </TouchableOpacity>
      
      <View className="items-center mb-10">
        <FontAwesome name="user-plus" size={40} color="#16a34a" />
        <Text className="mt-4 text-3xl font-bold text-center text-green-600 dark:text-green-400">
          สร้างบัญชีใหม่
        </Text>
      </View>

      <TextInput
        className="w-full px-4 py-3 mb-4 text-base bg-white border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        placeholder="ชื่อที่ใช้แสดง"
        placeholderTextColor="#9ca3af"
        value={displayName}
        onChangeText={setDisplayName}
      />

      <TextInput
        className="w-full px-4 py-3 mb-4 text-base bg-white border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        placeholder="เบอร์โทรศัพท์"
        placeholderTextColor="#9ca3af"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

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
        placeholder="รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
        placeholderTextColor="#9ca3af"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        onPress={handleSignUp}
        disabled={loading}
        className="flex-row items-center justify-center w-full py-3 mb-4 bg-green-600 rounded-lg shadow-md shadow-green-300 dark:shadow-none"
      >
        {loading ? (
            <ActivityIndicator color="#fff" />
        ) : (
            <Text className="text-lg font-semibold text-center text-white">
                สมัครสมาชิก
            </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}