import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const WeatherInfo = ({ weather, theme }) => {
  if (!weather) return null;

  // Get weather icon based on weather condition
  const getWeatherIcon = () => {
    const id = weather.weather[0].id;
    const isNight = weather.weather[0].icon.includes('n');

    // Thunderstorm
    if (id >= 200 && id < 300) {
      return <Ionicons name="thunderstorm" size={64} color={theme.text} />;
    }
    // Drizzle
    if (id >= 300 && id < 400) {
      return <Ionicons name="rainy" size={64} color={theme.text} />;
    }
    // Rain
    if (id >= 500 && id < 600) {
      return <Ionicons name="rainy" size={64} color={theme.text} />;
    }
    // Snow
    if (id >= 600 && id < 700) {
      return <Ionicons name="snow" size={64} color={theme.text} />;
    }
    // Atmosphere (fog, mist, etc)
    if (id >= 700 && id < 800) {
      return <Ionicons name="cloud" size={64} color={theme.text} />;
    }
    // Clear
    if (id === 800) {
      return isNight 
        ? <Ionicons name="moon" size={64} color={theme.text} />
        : <Ionicons name="sunny" size={64} color={theme.text} />;
    }
    // Clouds
    if (id > 800) {
      return isNight
        ? <Ionicons name="cloudy-night" size={64} color={theme.text} />
        : <Ionicons name="partly-sunny" size={64} color={theme.text} />;
    }

    return <Ionicons name="cloud" size={64} color={theme.text} />;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <View style={styles.weatherMain}>
        <View style={styles.tempContainer}>
          <Text style={[styles.temperature, { color: theme.text }]}>
            {Math.round(weather.main.temp)}°C
          </Text>
          <Text style={[styles.feelsLike, { color: theme.text }]}>
            Feels like {Math.round(weather.main.feels_like)}°C
          </Text>
        </View>
        
        <View style={styles.iconContainer}>
          {getWeatherIcon()}
          <Text style={[styles.description, { color: theme.text }]}>
            {weather.weather[0].description}
          </Text>
        </View>
      </View>
      
      <View style={styles.locationContainer}>
        <Ionicons name="location" size={16} color={theme.text} style={styles.locationIcon} />
        <Text style={[styles.location, { color: theme.text }]}>
          {weather.name}, {weather.sys.country}
        </Text>
      </View>
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Ionicons name="water" size={20} color={theme.text} />
          <Text style={[styles.detailText, { color: theme.text }]}>
            {weather.main.humidity}%
          </Text>
          <Text style={[styles.detailLabel, { color: theme.text }]}>
            Humidity
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="speedometer" size={20} color={theme.text} />
          <Text style={[styles.detailText, { color: theme.text }]}>
            {Math.round(weather.main.pressure)} hPa
          </Text>
          <Text style={[styles.detailLabel, { color: theme.text }]}>
            Pressure
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="navigate" size={20} color={theme.text} />
          <Text style={[styles.detailText, { color: theme.text }]}>
            {Math.round(weather.wind.speed)} m/s
          </Text>
          <Text style={[styles.detailLabel, { color: theme.text }]}>
            Wind
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weatherMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  tempContainer: {
    flex: 1,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  feelsLike: {
    fontSize: 14,
    opacity: 0.8,
  },
  iconContainer: {
    alignItems: 'center',
  },
  description: {
    textTransform: 'capitalize',
    marginTop: 5,
    fontSize: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  locationIcon: {
    marginRight: 5,
  },
  location: {
    fontSize: 16,
    fontWeight: '500',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 15,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailText: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: '600',
  },
  detailLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
});

export default WeatherInfo;
