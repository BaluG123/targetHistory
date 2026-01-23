import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  X,
  Map as MapIcon,
  Filter,
  Layers,
  Calendar,
  Globe,
  User,
  ChevronDown,
  Info
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown, FadeInUp, SlideInUp, SlideOutDown } from 'react-native-reanimated';
import { Colors, getThemeColors } from '../constants/Colors';

const { width, height } = Dimensions.get('window');

const MapScreen = () => {
  const { history, user } = useSelector((state: RootState) => state);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [mapFilter, setMapFilter] = useState<'all' | 'ancient' | 'medieval' | 'modern'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const isDark = user.preferences.theme === 'dark';
  const themeColors = getThemeColors(isDark);
  const styles = createStyles(isDark, themeColors);

  const filteredEvents = useMemo(() => {
    return history.events.filter(event => {
      const hasCoords = event.latitude && event.longitude;
      if (!hasCoords) return false;
      return mapFilter === 'all' || event.category === mapFilter;
    });
  }, [history.events, mapFilter]);

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
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css" />
        <style>
            body { margin: 0; padding: 0; background: ${isDark ? '#0F1419' : '#FAFBFC'}; }
            #map { height: 100vh; width: 100vw; }
            .custom-popup .leaflet-popup-content-wrapper {
                background: ${isDark ? '#1A1F2E' : '#FFFFFF'};
                color: ${isDark ? '#FFFFFF' : '#2C3E50'};
                border-radius: 12px;
                padding: 4px;
            }
            .popup-container { font-family: -apple-system, sans-serif; }
            .popup-title { font-weight: 800; color: ${Colors.primary}; margin-bottom: 4px; }
            .popup-date { font-size: 11px; font-weight: 600; color: ${isDark ? '#B8BCC8' : '#7F8C8D'}; margin-bottom: 8px; }
            
            /* Custom Cluster Styles */
            .marker-cluster-small { background-color: rgba(255, 107, 53, 0.6); }
            .marker-cluster-small div { background-color: rgba(255, 107, 53, 0.6); color: white; font-weight: bold; }
            .marker-cluster-medium { background-color: rgba(255, 107, 53, 0.8); }
            .marker-cluster-medium div { background-color: rgba(255, 107, 53, 0.8); color: white; font-weight: bold; }
            .marker-cluster-large { background-color: rgba(255, 107, 53, 0.9); }
            .marker-cluster-large div { background-color: rgba(255, 107, 53, 0.9); color: white; font-weight: bold; }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
        <script src="https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js"></script>
        <script>
            var map = L.map('map', { zoomControl: false }).setView([20.5937, 78.9629], 4);
            
            var tileUrl = '${isDark ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'}';
            L.tileLayer(tileUrl, {
                attribution: ''
            }).addTo(map);

            var markers = ${JSON.stringify(markers)};
            var clusterGroup = L.markerClusterGroup({
                showCoverageOnHover: false,
                spiderfyOnMaxZoom: true
            });
            
            var categoryColors = {
                'ancient': '${Colors.ancient}',
                'medieval': '${Colors.medieval}',
                'modern': '${Colors.modern}'
            };

            markers.forEach(function(marker) {
                var color = categoryColors[marker.category] || '${Colors.primary}';
                var customIcon = L.divIcon({
                    className: 'custom-div-icon',
                    html: '<div style="background-color:' + color + '; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                });

                var lMarker = L.marker([marker.lat, marker.lng], { icon: customIcon });
                lMarker.on('click', function() {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'markerClick',
                        eventId: marker.id
                    }));
                });
                clusterGroup.addLayer(lMarker);
            });

            map.addLayer(clusterGroup);

            if (markers.length > 0) {
                map.fitBounds(clusterGroup.getBounds().pad(0.1));
            }

            // Sync interactions
            document.addEventListener('message', function(e) {
                var data = JSON.parse(e.data);
                if (data.type === 'centerOn') {
                    map.setView([data.lat, data.lng], 8);
                }
            });
        </script>
    </body>
    </html>
    `;
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'markerClick') {
        const ev = history.events.find(e => e.id === data.eventId);
        if (ev) setSelectedEvent(ev);
      }
    } catch (e) { console.warn(e); }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />

      {/* Map View */}
      <View style={styles.mapFrame}>
        <WebView
          source={{ html: generateMapHTML() }}
          style={styles.webview}
          onMessage={handleWebViewMessage}
          scrollEnabled={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </View>

      {/* Floating Header */}
      <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
        <LinearGradient
          colors={isDark ? ['#1A1F2E', '#0F1419'] : ['#FFF', '#F8F9FA']}
          style={styles.headerContent}
        >
          <View style={styles.headerTop}>
            <View style={styles.headerTitleGroup}>
              <Globe size={20} color={Colors.primary} />
              <Text style={styles.headerTitle}>Historical Atlas</Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowFilters(!showFilters)}
              style={[styles.filterToggle, showFilters && styles.activeFilterToggle]}
            >
              <Filter size={18} color={showFilters ? '#fff' : Colors.primary} />
            </TouchableOpacity>
          </View>

          {showFilters && (
            <Animated.View entering={FadeInUp} style={styles.filtersRow}>
              {(['all', 'ancient', 'medieval', 'modern'] as const).map(cat => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setMapFilter(cat)}
                  style={[styles.filterChip, mapFilter === cat && styles.activeFilterChip]}
                >
                  <Text style={[styles.filterText, mapFilter === cat && styles.activeFilterText]}>
                    {cat.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </Animated.View>
          )}
        </LinearGradient>
      </Animated.View>

      {/* Event Details Sheet */}
      {selectedEvent && (
        <Animated.View
          entering={SlideInUp}
          exiting={SlideOutDown}
          style={styles.detailSheet}
        >
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <View style={[styles.periodTag, { backgroundColor: `${getCategoryColor(selectedEvent.category)}20` }]}>
              <Text style={[styles.periodTagText, { color: getCategoryColor(selectedEvent.category) }]}>
                {selectedEvent.category.toUpperCase()}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedEvent(null)} style={styles.closeBtn}>
              <X size={20} color={themeColors.textTertiary} />
            </TouchableOpacity>
          </View>

          <View style={styles.sheetBody}>
            <Text style={styles.eventTitle}>{selectedEvent.title}</Text>
            <View style={styles.metaRow}>
              <Calendar size={14} color={Colors.primary} />
              <Text style={styles.eventDate}>{selectedEvent.date}</Text>
              <View style={styles.dot} />
              <Globe size={14} color={Colors.secondary} />
              <Text style={styles.eventRegion}>{selectedEvent.region}</Text>
            </View>

            <Text style={styles.eventDesc}>{selectedEvent.description}</Text>

            {selectedEvent.significance && (
              <View style={styles.significanceBox}>
                <View style={styles.sigHeader}>
                  <Info size={14} color={Colors.primary} />
                  <Text style={styles.sigTitle}>Aspirant's Note</Text>
                </View>
                <Text style={styles.sigText}>{selectedEvent.significance}</Text>
              </View>
            )}

            {selectedEvent.rulers && selectedEvent.rulers.length > 0 && (
              <View style={styles.rulersSection}>
                <View style={styles.sigHeader}>
                  <User size={14} color={Colors.secondary} />
                  <Text style={styles.sigTitle}>Key Figures</Text>
                </View>
                <View style={styles.rulersList}>
                  {selectedEvent.rulers.map((r: string) => (
                    <View key={r} style={styles.rulerChip}>
                      <Text style={styles.rulerText}>{r}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </Animated.View>
      )}

      {/* Legend Overlay */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.ancient }]} />
          <Text style={styles.legendLabel}>Ancient</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.medieval }]} />
          <Text style={styles.legendLabel}>Medieval</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.modern }]} />
          <Text style={styles.legendLabel}>Modern</Text>
        </View>
      </View>
    </View>
  );
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'ancient': return Colors.ancient;
    case 'medieval': return Colors.medieval;
    case 'modern': return Colors.modern;
    default: return Colors.primary;
  }
};

const createStyles = (isDark: boolean, themeColors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.background,
  },
  mapFrame: {
    ...StyleSheet.absoluteFillObject,
  },
  webview: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  headerContent: {
    borderRadius: 20,
    padding: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: isDark ? '#2D3748' : '#EDF2F7',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: themeColors.text,
  },
  filterToggle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: isDark ? '#2D3748' : '#F0F2F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeFilterToggle: {
    backgroundColor: Colors.primary,
  },
  filtersRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: isDark ? '#2D3748' : '#EDF2F7',
  },
  activeFilterChip: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}15`,
  },
  filterText: {
    fontSize: 10,
    fontWeight: '700',
    color: themeColors.textSecondary,
  },
  activeFilterText: {
    color: Colors.primary,
  },
  detailSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: themeColors.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    maxHeight: height * 0.7,
  },
  sheetHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: themeColors.border,
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  periodTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  periodTagText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  closeBtn: {
    padding: 4,
  },
  sheetBody: {
    gap: 12,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: themeColors.text,
    lineHeight: 30,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventDate: {
    fontSize: 14,
    fontWeight: '700',
    color: themeColors.text,
  },
  eventRegion: {
    fontSize: 14,
    fontWeight: '600',
    color: themeColors.textSecondary,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: themeColors.textTertiary,
  },
  eventDesc: {
    fontSize: 15,
    color: themeColors.textSecondary,
    lineHeight: 22,
    marginTop: 4,
  },
  significanceBox: {
    backgroundColor: `${Colors.primary}10`,
    padding: 16,
    borderRadius: 16,
    marginTop: 8,
  },
  sigHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  sigTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: themeColors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sigText: {
    fontSize: 14,
    color: themeColors.textSecondary,
    lineHeight: 20,
  },
  rulersSection: {
    marginTop: 8,
  },
  rulersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  rulerChip: {
    backgroundColor: isDark ? '#2D3748' : '#F0F2F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  rulerText: {
    fontSize: 12,
    fontWeight: '600',
    color: themeColors.text,
  },
  legend: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 80,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 10,
    borderRadius: 12,
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2C3E50',
  },
});

export default MapScreen;