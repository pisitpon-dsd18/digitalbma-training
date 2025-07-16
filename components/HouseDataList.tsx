import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';

interface HouseData {
    id: string;
    year: string;
    [key: string]: any;
}

const DATA_URL = 'https://data.bangkok.go.th/dataset/62cc4966-5733-46b1-bc50-a0bbe74debc7/resource/9b6a2a3b-4e80-4a48-b869-73e3813cd684/download/ard_5ed61ef44d090.json';

export default function HouseDataList() {
    const [data, setData] = useState<HouseData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [years, setYears] = useState<string[]>([]);

    useEffect(() => {
        fetch(DATA_URL)
            .then(res => res.json())
            .then(json => {
                setData(json);
                const yearSet = Array.from(new Set(json.map((item: any) => item.year))) as string[];
                setYears(yearSet.sort((a, b) => b.localeCompare(a)));
                setLoading(false);
            });
    }, []);

    const filteredData = selectedYear ? data.filter(item => item.year === selectedYear) : data;

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="mt-2">กำลังโหลดข้อมูล...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 p-4 bg-gray-50 dark:bg-gray-900">
            <Text className="text-xl font-bold mb-4">ข้อมูลบ้าน (แยกตามปี)</Text>
            <View className="flex-row flex-wrap mb-4">
                <TouchableOpacity
                    className={`px-3 py-1 m-1 rounded-full ${selectedYear === null ? 'bg-blue-600' : 'bg-gray-300'} `}
                    onPress={() => setSelectedYear(null)}
                >
                    <Text className={selectedYear === null ? 'text-white' : 'text-black'}>ทั้งหมด</Text>
                </TouchableOpacity>
                {years.map(year => (
                    <TouchableOpacity
                        key={year}
                        className={`px-3 py-1 m-1 rounded-full ${selectedYear === year ? 'bg-blue-600' : 'bg-gray-300'} `}
                        onPress={() => setSelectedYear(year)}
                    >
                        <Text className={selectedYear === year ? 'text-white' : 'text-black'}>{year}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <FlatList
                data={filteredData}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View className="p-4 mb-2 bg-white rounded-lg shadow border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                        <Text className="font-bold text-lg">{item.house_name || item.id}</Text>
                        <Text>ปี: {item.year}</Text>
                        {/* เพิ่มข้อมูลอื่น ๆ ที่ต้องการแสดง */}
                    </View>
                )}
                ListEmptyComponent={<Text className="text-center text-gray-500">ไม่พบข้อมูล</Text>}
            />
        </View>
    );
}
