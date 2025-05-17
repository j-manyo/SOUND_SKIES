import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useMusic } from '../context/MusicContext';
import { useTheme } from '../context/ThemeContext';
import { useWeather } from '../context/WeatherContext';
import MusicPlayer from '../components/MusicPlayer';
import SongListItem from '../components/SongListItem';

const MusicScreen = () => {
  const { currentPlaylist, currentSong, loadSong, favorites, isFavorite } = useMusic();
  const { theme, weatherTheme } = useTheme();
  const { weather, getWeatherCondition } = useWeather();
  const [activeTab, setActiveTab] = useState('recommendations');

  // Get weather condition for display
  const weatherCondition = weather ? getWeatherCondition() : null;
  const displayData = activeTab === 'recommendations' ? currentPlaylist : favorites;

  // Filter options
  const filterOptions = ['All', 'Happy', 'Calm', 'Energetic', 'Melancholy'];
  const [activeFilter, setActiveFilter] = useState('All');

  // Filter songs based on selected mood
  const filteredSongs = activeFilter === 'All' 
    ? displayData 
    : displayData.filter(song => song.mood.toLowerCase() === activeFilter.toLowerCase());

  return (
    <LinearGradient
      colors={[weatherTheme.gradientStart, weatherTheme.gradientEnd]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            {activeTab === 'recommendations' 
              ? 'Weather Music' 
              : 'Favorites'}
          </Text>
          {weatherCondition && activeTab === 'recommendations' && (
            <View style={[styles.weatherBadge, { backgroundColor: theme.card }]}>
              <Text style={{ color: theme.text }}>{weatherTheme.icon} {weatherCondition}</Text>
            </View>
          )}
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'recommendations' && { 
                backgroundColor: theme.primary,
                borderColor: theme.primary 
              }
            ]}
            onPress={() => setActiveTab('recommendations')}
          >
            <Text 
              style={[
                styles.tabText, 
                { color: activeTab === 'recommendations' ? 'white' : theme.text }
              ]}
            >
              Recommendations
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'favorites' && { 
                backgroundColor: theme.primary,
                borderColor: theme.primary 
              }
            ]}
            onPress={() => setActiveTab('favorites')}
          >
            <Text 
              style={[
                styles.tabText, 
                { color: activeTab === 'favorites' ? 'white' : theme.text }
              ]}
            >
              Favorites
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filterOptions.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  { 
                    backgroundColor: activeFilter === filter ? theme.primary : theme.card,
                    borderColor: activeFilter === filter ? theme.primary : theme.border,
                  }
                ]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text 
                  style={[
                    styles.filterText, 
                    { color: activeFilter === filter ? 'white' : theme.text }
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {filteredSongs.length > 0 ? (
          <FlatList
            data={filteredSongs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <SongListItem
                song={item}
                isPlaying={currentSong && currentSong.id === item.id}
                isFavorite={isFavorite(item.id)}
                onPress={() => loadSong(item)}
                theme={theme}
              />
            )}
            showsVerticalScrollIndicator={false}
            style={styles.songList}
            contentContainerStyle={styles.songListContent}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons 
              name={activeTab === 'favorites' ? 'heart' : 'musical-notes'} 
              size={64} 
              color={theme.text} 
            />
            <Text style={[styles.emptyText, { color: theme.text }]}>
              {activeTab === 'favorites' 
                ? "You haven't added any favorites yet" 
                : "No songs match your filter"}
            </Text>
          </View>
        )}

        {currentSong && <MusicPlayer theme={theme} />}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  weatherBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  tabText: {
    fontWeight: '500',
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
  },
  songList: {
    flex: 1,
  },
  songListContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Space for player
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default MusicScreen;
