import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Text,
    View
} from 'react-native';
import { useAuth } from '../_layout';


type HouseData = {
    id: number;
    year_save: string;
    month_save: string;
    dname: string;
    house_quantity: number;
    adddate: string;
    updatedate: string;
};


export default function HomeScreen() {
    const { session, loading: authLoading } = useAuth();


    const [data, setData] = useState<HouseData[]>([]);
    const [years, setYears] = useState<string[]>([]);
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);


    // Fetch data
    useEffect(() => {
        fetch(
            'https://data.bangkok.go.th/dataset/62cc4966-5733-46b1-bc50-a0bbe74debc7/resource/9b6a2a3b-4e80-4a48-b869-73e3813cd684/download/ard_5ed61ef44d090.json'
        )
            .then((res) => res.json() as Promise<HouseData[]>)
            .then((json) => {
                setData(json);
                // สร้าง list ปี และ sort
                const yrs = Array.from(new Set(json.map((i) => i.year_save)));
                yrs.sort((a, b) => Number(b) - Number(a));
                setYears(yrs);
                // ตั้งปีเริ่มต้นเป็นปีล่าสุด
                if (yrs.length) setSelectedYear(yrs[0]);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);


    // กรองข้อมูลตามปี
    const filtered = data.filter((item) => item.year_save === selectedYear);


    if (authLoading || loading) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }


    return (
        <View className="flex-1 bg-gray-50 dark:bg-gray-900 p-4">
            {/* Header */}
            <View className="flex-row items-center">
                <FontAwesome name="home" size={24} color="#3b82f6" />
                <Text className="ml-2 text-2xl font-bold text-gray-800 dark:text-gray-100">
                    สถิติจำนวนบ้าน
                </Text>
            </View>


            {/* Picker เลือกปี */}
            <View className="mt-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <Picker
                    selectedValue={selectedYear}
                    onValueChange={(val) => setSelectedYear(val)}
                    dropdownIconColor="#3b82f6"
                    style={{}}
                >
                    {years.map((y) => (
                        <Picker.Item key={y} label={y} value={y} />
                    ))}
                </Picker>
            </View>


            {/* List แสดงผล */}
            <FlatList
                className="mt-4"
                data={filtered}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View className="mb-3 bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
                        <Text className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                            {item.dname}
                        </Text>
                        <Text className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                            เดือน: {item.month_save}
                        </Text>
                        <Text className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {item.house_quantity.toLocaleString()} หลัง
                        </Text>
                    </View>
                )}
                ListEmptyComponent={
                    <View className="items-center mt-10">
                        <Text className="text-gray-500 dark:text-gray-400">
                            ไม่มีข้อมูลในปี {selectedYear}
                        </Text>
                    </View>
                }
            />
        </View>
    );
}
