import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useWeather } from '../context/WeatherContext';
import { useMusic } from '../context/MusicContext';
import { useTheme } from '../context/ThemeContext';
import SongCard from '../components/SongCard';
import WeatherInfo from '../components/WeatherInfo';

const HomeScreen = ({ navigation }) => {
  const { weather, loading, errorMsg, refreshWeather, getWeatherCondition } = useWeather();
  const { currentPlaylist, loadSong } = useMusic();
  const { theme, weatherTheme, updateWeatherTheme } = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);

  // Update the theme based on current weather
  useEffect(() => {
    if (weather) {
      const condition = getWeatherCondition();
      updateWeatherTheme(condition);
    }
  }, [weather, getWeatherCondition, updateWeatherTheme]);

  // Pull-to-refresh functionality
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refreshWeather();
    setRefreshing(false);
  }, [refreshWeather]);

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.text }]}>Getting your weather-based music...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Ionicons name="cloud-offline" size={64} color={theme.text} />
        <Text style={[styles.errorText, { color: theme.text }]}>{errorMsg}</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: theme.primary }]}
          onPress={refreshWeather}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[weatherTheme.gradientStart, weatherTheme.gradientEnd]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {weather && (
          <>
            <WeatherInfo weather={weather} theme={theme} />
            
            <View style={styles.moodSection}>
              <Text style={[styles.moodText, { color: theme.text }]}>
                {weatherTheme.mood} music for you
              </Text>
            </View>

            {currentPlaylist.length > 0 ? (
              <>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  Recommended for this weather
                </Text>
                <View style={styles.recommendedList}>
                  {currentPlaylist.slice(0, 3).map((song) => (
                    <SongCard
                      key={song.id}
                      song={song}
                      onPress={() => loadSong(song)}
                      theme={theme}
                    />
                  ))}
                </View>
                
                <TouchableOpacity
                  style={[styles.viewAllButton, { backgroundColor: theme.card }]}
                  onPress={() => navigation.navigate('Music')}
                >
                  <Text style={[styles.viewAllText, { color: theme.primary }]}>View All Recommendations</Text>
                  <Ionicons name="arrow-forward" size={16} color={theme.primary} />
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.noSongsContainer}>
                <Ionicons name="musical-notes" size={64} color={theme.text} />
                <Text style={[styles.noSongsText, { color: theme.text }]}>
                  No music recommendations available for this weather.
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  moodSection: {
    marginVertical: 20,
    alignItems: 'center',
  },
  moodText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recommendedList: {
    marginBottom: 20,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 25,
    marginBottom: 20,
  },
  viewAllText: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  noSongsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    padding: 20,
  },
  noSongsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default HomeScreen;
