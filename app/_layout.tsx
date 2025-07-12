import { useColorScheme } from '@/hooks/useColorScheme';
import { supabase } from '@/supabaseClient';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Session } from '@supabase/supabase-js';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';
import '../global.css';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Create Authentication Context
const AuthContext = createContext<{ session: Session | null; loading: boolean }>({
  session: null,
  loading: true,
});

// Custom hook to use the Auth Context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Authentication Provider Component
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

function RootLayoutNav() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // FIX 2: Check if the user is in the auth group.
    // Changed from '(auth)' to 'auth' to match the folder name found by the router.
    // It's recommended to rename the 'auth' folder to '(auth)' for consistency.
    const inAuthGroup = segments[0] === 'auth';
    
    // Redirect logic
    if (session && inAuthGroup) {
      // User is signed in, redirect to the main app (home screen)
      router.replace('/');
    } else if (!session && !inAuthGroup) {
      // User is not signed in, redirect to the login screen
      router.replace('/auth/login');
    }
  }, [session, loading, segments]);

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded && !loading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, loading]);

  if (!loaded || loading) {
    return (
        <View className="items-center justify-center flex-1 bg-gray-50 dark:bg-gray-900">
            <ActivityIndicator size="large" color="#3b82f6" />
        </View>
    );
  }

  return (
    <Stack>
        {/* FIX 1: Changed name from '(auth)' to 'auth' to match the route discovered by Expo Router. */}
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
            name="user" 
            options={{ 
                title: 'โปรไฟล์ของฉัน',
                headerBackTitle: 'กลับ',
                presentation: 'modal' 
            }} 
        />
        <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <AuthProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <RootLayoutNav />
            <StatusBar style="auto" />
        </ThemeProvider>
    </AuthProvider>
  );
}