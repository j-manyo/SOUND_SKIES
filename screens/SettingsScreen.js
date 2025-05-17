import React, { useState } from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useWeather } from '../context/WeatherContext';

const SettingsScreen = () => {
  const { theme, weatherTheme, darkMode, isSystemTheme, toggleDarkMode, useSystemTheme } = useTheme();
  const { getWeatherForLocation } = useWeather();
  const [customLocation, setCustomLocation] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showTemperature, setShowTemperature] = useState(true);
  const [temperatureUnit, setTemperatureUnit] = useState('celsius'); // 'celsius' or 'fahrenheit'
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Handle custom location search
  const handleLocationSearch = () => {
    if (customLocation.trim() === '') {
      Alert.alert('Error', 'Please enter a location');
      return;
    }
    
    getWeatherForLocation(customLocation.trim());
    Alert.alert('Success', `Weather updated for ${customLocation}`);
  };

  // Toggle temperature unit
  const toggleTemperatureUnit = () => {
    setTemperatureUnit(prev => prev === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  return (
    <LinearGradient
      colors={[weatherTheme.gradientStart, weatherTheme.gradientEnd]}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Display</Text>
        
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={styles.settingRow}>
            <Text style={[styles.settingText, { color: theme.text }]}>Dark Mode</Text>
            <Switch
              trackColor={{ false: theme.lightGray, true: theme.primary }}
              thumbColor={darkMode ? '#fff' : '#f4f3f4'}
              onValueChange={toggleDarkMode}
              value={darkMode}
              disabled={isSystemTheme}
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={[styles.settingText, { color: theme.text }]}>Use Device Settings</Text>
            <Switch
              trackColor={{ false: theme.lightGray, true: theme.primary }}
              thumbColor={isSystemTheme ? '#fff' : '#f4f3f4'}
              onValueChange={useSystemTheme}
              value={isSystemTheme}
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={[styles.settingText, { color: theme.text }]}>Show Temperature</Text>
            <Switch
              trackColor={{ false: theme.lightGray, true: theme.primary }}
              thumbColor={showTemperature ? '#fff' : '#f4f3f4'}
              onValueChange={setShowTemperature}
              value={showTemperature}
            />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Weather</Text>
        
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={styles.settingRow}>
            <Text style={[styles.settingText, { color: theme.text }]}>Temperature Unit</Text>
            <TouchableOpacity 
              style={[
                styles.toggleButton, 
                { backgroundColor: theme.background, borderColor: theme.border }
              ]}
              onPress={toggleTemperatureUnit}
            >
              <Text style={{ color: theme.text }}>
                {temperatureUnit === 'celsius' ? '°C' : '°F'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.settingRow}>
            <Text style={[styles.settingText, { color: theme.text }]}>Auto Refresh</Text>
            <Switch
              trackColor={{ false: theme.lightGray, true: theme.primary }}
              thumbColor={autoRefresh ? '#fff' : '#f4f3f4'}
              onValueChange={setAutoRefresh}
              value={autoRefresh}
            />
          </View>
          
          <View style={styles.locationContainer}>
            <Text style={[styles.settingText, { color: theme.text, marginBottom: 10 }]}>Custom Location</Text>
            <View style={styles.searchContainer}>
              <TextInput
                style={[
                  styles.locationInput, 
                  { 
                    backgroundColor: theme.background, 
                    color: theme.text,
                    borderColor: theme.border
                  }
                ]}
                placeholder="Enter city name"
                placeholderTextColor={theme.darkGray}
                value={customLocation}
                onChangeText={setCustomLocation}
              />
              <TouchableOpacity 
                style={[styles.searchButton, { backgroundColor: theme.primary }]}
                onPress={handleLocationSearch}
              >
                <Ionicons name="search" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Notifications</Text>
        
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={styles.settingRow}>
            <Text style={[styles.settingText, { color: theme.text }]}>Enable Notifications</Text>
            <Switch
              trackColor={{ false: theme.lightGray, true: theme.primary }}
              thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
              onValueChange={setNotificationsEnabled}
              value={notificationsEnabled}
            />
          </View>
        </View>

        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: theme.text }]}>Sound Skies v1.0.0</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingText: {
    fontSize: 16,
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  locationContainer: {
    paddingVertical: 12,
  },
  searchContainer: {
    flexDirection: 'row',
  },
  locationInput: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  searchButton: {
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  versionContainer: {
    marginTop: 30,
    alignItems: 'center',
    paddingBottom: 30,
  },
  versionText: {
    fontSize: 14,
    opacity: 0.7,
  },
});

export default SettingsScreen;
