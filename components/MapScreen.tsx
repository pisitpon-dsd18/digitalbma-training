import { parse } from 'papaparse';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    Modal, Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView, {
    Marker,
    Polygon,
    Polyline,
    PROVIDER_GOOGLE,
    UrlTile,
} from 'react-native-maps';

const BASE_URL = 'https://raw.githubusercontent.com/Pongpisud1998/bmamap/main/geodata/';
const IMAGE_URL = 'https://raw.githubusercontent.com/Pongpisud1998/bmamap/main/images/';

const AQI_TYPES = ['AQI', 'PM25', 'PM10', 'O3', 'CO', 'NO2', 'SO2'];

const colorMap: any = {
    "0": "#808080", "1": "#00bfff", "2": "#32cd32",
    "3": "#ffa500", "4": "#ff4500", "5": "#800080",
};



const baseMapStyles = [
    {
        name: "GoogleHybrid",
        urlTemplate: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}.png",
    },
    {
        name: "OpenStreetMap",
        urlTemplate: "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
    },
    {
        name: "Carto Dark",
        urlTemplate: "https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
    },
];

const initialLayers = [
    { id: 1, name: 'เขต', name_en: 'district', path: 'district.geojson', type: 'geojson', visible: false },
    { id: 2, name: 'ทางจักรยาน', name_en: 'bike_way', path: 'bike_way.geojson', type: 'geojson', visible: false },
    { id: 3, name: 'โรงเรียน', name_en: 'bma_school', path: 'bma_school.geojson', type: 'geojson', visible: false, icon: 'school.png' },
    { id: 4, name: 'สถานีตรวจวัด', name_en: 'air_pollution', path: 'air_pollution.geojson', type: 'geojson', visible: false, icon: 'station.png' },
    { id: 5, name: 'กล้อง CCTV', name_en: 'bma_cctv', path: 'bma_cctv.csv', type: 'csv', visible: false, icon: 'cctv.png' },
    { id: 6, name: 'Air4Thai', name_en: 'air4thai', path: 'air4thai.json', type: 'api', visible: true, icon: 'air.png' }
];

export default function MapScreen() {
    const [layers, setLayers] = useState<any[]>([]);
    const [selectedAQI, setSelectedAQI] = useState('AQI');
    const [selectedBaseMap, setSelectedBaseMap] = useState(baseMapStyles[0]);
    const [layerModalVisible, setLayerModalVisible] = useState(false);

    const [region] = useState({
        latitude: 13.7563,
        longitude: 100.5018,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
    });

    useEffect(() => {
        const loadLayers = async () => {
            const enriched = await Promise.all(initialLayers.map(async (layer) => {
                try {
                    if (layer.type === 'geojson') {
                        const res = await fetch(BASE_URL + layer.path);
                        const geojson = await res.json();
                        return { ...layer, geojson };
                    } else if (layer.type === 'csv') {
                        const res = await fetch(BASE_URL + layer.path);
                        const text = await res.text();
                        const parsed = parse(text, { header: true });
                        const features = parsed.data.map((row: any) => ({
                            geometry: { coordinates: [parseFloat(row.long), parseFloat(row.lat)] },
                            properties: row,
                        }));
                        return { ...layer, features };
                    } else if (layer.type === 'api') {
                        const res = await fetch(BASE_URL + layer.path);
                        const json = await res.json();
                        const stations = json.stations || [];
                        const features = stations.map((s: any) => ({
                            geometry: { coordinates: [parseFloat(s.long), parseFloat(s.lat)] },
                            properties: s,
                        }));
                        return { ...layer, features };
                    }
                } catch (err) {
                    console.warn("Failed to load", layer.name, err);
                }
                return layer;
            }));
            setLayers(enriched);
        };
        loadLayers();
    }, []);

    const toggleLayer = (id: number) => {
        setLayers(prev => prev.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
    };

    const renderIconMarker = (coords: number[], icon: string, key: string) => {
        if (!Array.isArray(coords) || coords.length < 2) return null;
        const [lng, lat] = coords;
        if (typeof lng !== 'number' || typeof lat !== 'number') return null;

        return (
            <Marker key={key} coordinate={{ latitude: lat, longitude: lng }}>
                <View style={{ width: 24, height: 24 }}>
                    <Image
                        source={{ uri: IMAGE_URL + icon }}
                        style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                    />
                </View>
            </Marker>
        );
    };

    const renderAQIMarkers = (layer: any) => {
        return layer?.features?.map((f: any, idx: number) => {
            const coords = f.geometry.coordinates;
            if (!Array.isArray(coords) || coords.length < 2) return null;

            let AQILast = f.properties.AQILast;
            try {
                AQILast = typeof AQILast === 'string' ? JSON.parse(AQILast) : AQILast;
            } catch {
                return null;
            }

            const pollutant = AQILast?.[selectedAQI];
            if (!pollutant || pollutant.aqi === '-1' || pollutant.aqi === '-999') return null;

            const color = colorMap[pollutant.color_id] || '#ccc';
            const valueText = selectedAQI === 'AQI' ? pollutant.aqi : pollutant.value;

            return (
                <Marker key={`aqi-${idx}`} coordinate={{ latitude: coords[1], longitude: coords[0] }}>
                    <View style={{ backgroundColor: color, padding: 6, borderRadius: 16, borderColor: '#fff', borderWidth: 2 }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>{valueText}</Text>
                    </View>
                </Marker>
            );
        });
    };

    return (
        <View style={{ flex: 1 }}>
            <MapView provider={PROVIDER_GOOGLE} style={{ flex: 1 }} region={region}>
                <UrlTile
                    key={selectedBaseMap.name}
                    urlTemplate={selectedBaseMap.urlTemplate.replace('{s}', 'a')}
                    zIndex={-1}
                    maximumZ={19}
                />

                {layers.map((layer: any) => {
                    if (!layer.visible) return null;
                    if (!layer.features && !layer.geojson?.features) return null;

                    // Air4Thai
                    if (layer.name_en === 'air4thai') return renderAQIMarkers(layer);

                    // CSV/API features with icon
                    if (layer.features) {
                        return layer.features.map((f: any, i: number) =>
                            renderIconMarker(f.geometry.coordinates, layer.icon, `${layer.id}-${i}`)
                        );
                    }

                    // GeoJSON
                    if (layer.geojson?.features) {
                        return layer.geojson.features.map((f: any, i: number) => {
                            const coords = f.geometry.coordinates;
                            const type = f.geometry.type;

                            if (type === 'Point') {
                                return renderIconMarker(coords, layer.icon, `${layer.id}-pt-${i}`);
                            }

                            if (type === 'LineString') {
                                const lineCoords = coords.map(([lng, lat]: number[]) => ({ latitude: lat, longitude: lng }));
                                return (
                                    <Polyline
                                        key={`${layer.id}-line-${i}`}
                                        coordinates={lineCoords}
                                        strokeColor={layer.name_en === 'road' ? '#ffe53d' : '#ffa200'}
                                        strokeWidth={layer.name_en === 'road' ? 3 : 5}
                                    />
                                );
                            }

                            if (type === 'MultiLineString') {
                                return coords.map((line: number[][], j: number) => {
                                    const lineCoords = line.map(([lng, lat]) => ({ latitude: lat, longitude: lng }));
                                    return (
                                        <Polyline
                                            key={`${layer.id}-ml-${i}-${j}`}
                                            coordinates={lineCoords}
                                            strokeColor={layer.name_en === 'road' ? '#ffe53d' : '#ffa200'}
                                            strokeWidth={layer.name_en === 'road' ? 3 : 5}
                                        />
                                    );
                                });
                            }

                            if (type === 'Polygon') {
                                const polyCoords = coords[0].map(([lng, lat]: number[]) => ({ latitude: lat, longitude: lng }));
                                return (
                                    <Polygon
                                        key={`${layer.id}-poly-${i}`}
                                        coordinates={polyCoords}
                                        strokeColor="#f391d6"
                                        fillColor="rgba(243,145,214,0.2)"
                                        strokeWidth={2}
                                    />
                                );
                            }

                            if (type === 'MultiPolygon') {
                                return coords.map((polygon: number[][][], j: number) => {
                                    const polyCoords = polygon[0].map(([lng, lat]: number[]) => ({ latitude: lat, longitude: lng }));
                                    return (
                                        <Polygon
                                            key={`${layer.id}-mpoly-${i}-${j}`}
                                            coordinates={polyCoords}
                                            strokeColor="#f391d6"
                                            fillColor="rgba(243,145,214,0.2)"
                                            strokeWidth={2}
                                        />
                                    );
                                });
                            }

                            return null;
                        });
                    }

                    return null;
                })}
            </MapView>

            {/* Floating Layers Button */}
            <TouchableOpacity
                onPress={() => setLayerModalVisible(true)}
                style={styles.floatingButton}
            >
                <Text style={{ fontSize: 18 }}>🧭 Layers</Text>
            </TouchableOpacity>

            {/* Modal Layer Panel */}
            <Modal visible={layerModalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalPanel}>
                        <Text style={styles.modalTitle}>🧭 จัดการชั้นข้อมูล</Text>
                        <FlatList
                            data={layers}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.modalRow}>
                                    <Text>{item.name}</Text>
                                    <Switch
                                        value={item.visible}
                                        onValueChange={() => toggleLayer(item.id)}
                                    />
                                </View>
                            )}
                        />
                        <Pressable onPress={() => setLayerModalVisible(false)} style={styles.modalClose}>
                            <Text style={{ color: 'white' }}>ปิด</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* Basemap Selector */}
            <ScrollView horizontal style={styles.baseControl}>
                {baseMapStyles.map((b) => (
                    <TouchableOpacity key={b.name} onPress={() => setSelectedBaseMap(b)} style={styles.baseItem}>
                        <Text style={{ color: selectedBaseMap.name === b.name ? 'blue' : 'black' }}>{b.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* AQI Filter */}
            <ScrollView horizontal style={styles.aqiControl}>
                {AQI_TYPES.map((type) => (
                    <TouchableOpacity key={type} onPress={() => setSelectedAQI(type)} style={styles.aqiItem}>
                        <Text style={{ color: selectedAQI === type ? 'blue' : 'black' }}>{type}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    baseControl: {
        position: 'absolute', top: 40, left: 10,
        backgroundColor: 'white', padding: 6, borderRadius: 8, zIndex: 10,
    },
    baseItem: { marginHorizontal: 6 },
    aqiControl: {
        position: 'absolute', top: 90, left: 10,
        backgroundColor: 'white', padding: 6, borderRadius: 8, zIndex: 10,
    },
    aqiItem: { marginHorizontal: 6 },
    layerControl: {
        position: 'absolute', bottom: 20, left: 10,
        backgroundColor: 'white', padding: 10, borderRadius: 8,
        maxHeight: 250, zIndex: 10,
    },
    layerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 6,
    },

    floatingButton: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 5,
        zIndex: 99,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalPanel: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 16,
        width: '80%',
        maxHeight: '70%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 6,
    },
    modalClose: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 6,
        marginTop: 10,
        alignItems: 'center',
    }

});