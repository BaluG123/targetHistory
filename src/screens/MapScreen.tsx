import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const { height } = Dimensions.get('window');

const MapScreen = () => {
  const { history, user } = useSelector((state: RootState) => state);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [mapFilter, setMapFilter] = useState<'all' | 'ancient' | 'medieval' | 'modern'>('all');
  
  const isDark = user.preferences.theme === 'dark';
  const styles = createStyles(isDark);

  const filteredEvents = history.events.filter(event => {
    if (mapFilter === 'all') return event.latitude && event.longitude;
    return event.category === mapFilter && event.latitude && event.longitude;
  });

  const generateMapHTML = () => {
    const markers = filteredEvents.map(event => ({
      lat: event.latitude,
      lng: event.longitude,
      title: event.title,
      description: event.description,
      date: event.date,
      category: event.category,
      id: event.id,
    }));

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Historical Events Map</title>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
        <style>
            body { margin: 0; padding: 0; }
            #map { height: 100vh; width: 100vw; }
            .custom-popup {
                font-family: Arial, sans-serif;
                max-width: 250px;
            }
            .popup-title {
                font-weight: bold;
                color: #FF6B35;
                margin-bottom: 5px;
                font-size: 14px;
            }
            .popup-date {
                color: #666;
                font-size: 12px;
                margin-bottom: 8px;
            }
            .popup-description {
                font-size: 12px;
                line-height: 1.4;
                color: #333;
            }
            .popup-category {
                display: inline-block;
                background: #FF6B35;
                color: white;
                padding: 2px 8px;
                border-radius: 10px;
                font-size: 10px;
                margin-top: 8px;
                text-transform: capitalize;
            }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
        <script>
            var map = L.map('map').setView([20.5937, 78.9629], 4);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            var markers = ${JSON.stringify(markers)};
            
            var categoryColors = {
                'ancient': '#4CAF50',
                'medieval': '#FF9800',
                'modern': '#2196F3'
            };

            markers.forEach(function(marker) {
                var color = categoryColors[marker.category] || '#FF6B35';
                
                var customIcon = L.divIcon({
                    className: 'custom-div-icon',
                    html: '<div style="background-color:' + color + '; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                });

                var popupContent = 
                    '<div class="custom-popup">' +
                    '<div class="popup-title">' + marker.title + '</div>' +
                    '<div class="popup-date">' + marker.date + '</div>' +
                    '<div class="popup-description">' + marker.description.substring(0, 100) + '...</div>' +
                    '<div class="popup-category">' + marker.category + '</div>' +
                    '</div>';

                L.marker([marker.lat, marker.lng], {icon: customIcon})
                    .addTo(map)
                    .bindPopup(popupContent)
                    .on('click', function() {
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'markerClick',
                            eventId: marker.id
                        }));
                    });
            });

            // Fit map to show all markers
            if (markers.length > 0) {
                var group = new L.featureGroup(map._layers);
                if (Object.keys(group._layers).length > 0) {
                    map.fitBounds(group.getBounds().pad(0.1));
                }
            }
        </script>
    </body>
    </html>
    `;
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'markerClick') {
        const event = history.events.find(e => e.id === data.eventId);
        if (event) {
          setSelectedEvent(event);
          setModalVisible(true);
        }
      }
    } catch (error) {
      console.log('Error parsing WebView message:', error);
    }
  };

  const FilterButton = ({ filter, label }: { filter: 'all' | 'ancient' | 'medieval' | 'modern', label: string }) => (
    <TouchableOpacity
      onPress={() => setMapFilter(filter)}
      style={[
        styles.filterButton,
        mapFilter === filter && styles.activeFilterButton
      ]}
    >
      <Text style={[
        styles.filterButtonText,
        mapFilter === filter && styles.activeFilterButtonText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={isDark ? ['#2C3E50', '#34495E'] : ['#FF6B35', '#F7931E']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Historical Map</Text>
        <Text style={styles.headerSubtitle}>Explore events across time and space</Text>
      </LinearGradient>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <FilterButton filter="all" label="All Periods" />
          <FilterButton filter="ancient" label="Ancient" />
          <FilterButton filter="medieval" label="Medieval" />
          <FilterButton filter="modern" label="Modern" />
        </ScrollView>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <WebView
          source={{ html: generateMapHTML() }}
          style={styles.webview}
          onMessage={handleWebViewMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <Icon name="map" size={50} color="#FF6B35" />
              <Text style={styles.loadingText}>Loading Map...</Text>
            </View>
          )}
        />
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Legend</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.legendText}>Ancient</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FF9800' }]} />
            <Text style={styles.legendText}>Medieval</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#2196F3' }]} />
            <Text style={styles.legendText}>Modern</Text>
          </View>
        </View>
      </View>

      {/* Event Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Event Details</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            {selectedEvent && (
              <ScrollView style={styles.modalBody}>
                <Text style={styles.eventTitle}>{selectedEvent.title}</Text>
                <Text style={styles.eventDate}>{selectedEvent.date}</Text>
                
                <View style={styles.eventTags}>
                  <View style={[styles.tag, { backgroundColor: '#FF6B35' }]}>
                    <Text style={styles.tagText}>{selectedEvent.category}</Text>
                  </View>
                  <View style={[styles.tag, { backgroundColor: '#2196F3' }]}>
                    <Text style={styles.tagText}>{selectedEvent.region}</Text>
                  </View>
                </View>

                <Text style={styles.eventDescription}>{selectedEvent.description}</Text>
                
                {selectedEvent.significance && (
                  <View style={styles.significanceContainer}>
                    <Text style={styles.significanceTitle}>Historical Significance:</Text>
                    <Text style={styles.significanceText}>{selectedEvent.significance}</Text>
                  </View>
                )}

                {selectedEvent.rulers && selectedEvent.rulers.length > 0 && (
                  <View style={styles.rulersContainer}>
                    <Text style={styles.rulersTitle}>Key Figures:</Text>
                    {selectedEvent.rulers.map((ruler: string, index: number) => (
                      <Text key={index} style={styles.rulerText}>• {ruler}</Text>
                    ))}
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#121212' : '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginTop: 5,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: isDark ? '#2C2C2C' : '#e0e0e0',
    marginRight: 10,
  },
  activeFilterButton: {
    backgroundColor: '#FF6B35',
  },
  filterButtonText: {
    fontSize: 14,
    color: isDark ? '#fff' : '#666',
  },
  activeFilterButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: isDark ? '#fff' : '#333',
  },
  legend: {
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#333',
    marginBottom: 10,
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: isDark ? '#ccc' : '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#333' : '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#333',
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#333',
    marginBottom: 10,
  },
  eventDate: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
    marginBottom: 15,
  },
  eventTags: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 10,
  },
  tagText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  eventDescription: {
    fontSize: 16,
    color: isDark ? '#ccc' : '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  significanceContainer: {
    marginBottom: 20,
  },
  significanceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#333',
    marginBottom: 10,
  },
  significanceText: {
    fontSize: 14,
    color: isDark ? '#ccc' : '#666',
    lineHeight: 22,
  },
  rulersContainer: {
    marginBottom: 20,
  },
  rulersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#333',
    marginBottom: 10,
  },
  rulerText: {
    fontSize: 14,
    color: isDark ? '#ccc' : '#666',
    marginBottom: 5,
  },
});

export default MapScreen;