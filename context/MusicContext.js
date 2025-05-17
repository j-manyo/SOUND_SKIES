import React, { createContext, useState, useContext, useEffect } from 'react';
import { Audio } from 'expo-av';
import { useWeather } from './WeatherContext';

const MusicContext = createContext();

// Mock music data - in a real app, this would come from a music API
const musicLibrary = {
  clear: [
    { id: '1', title: 'Sunny Day', artist: 'Summer Vibes', uri: 'https://example.com/songs/sunny.mp3', mood: 'happy' },
    { id: '2', title: 'Blue Skies', artist: 'Cloud Nine', uri: 'https://example.com/songs/blueskies.mp3', mood: 'relaxed' },
    { id: '3', title: 'Sunshine', artist: 'Solar Beats', uri: 'https://example.com/songs/sunshine.mp3', mood: 'energetic' },
    { id: '4', title: 'Clear Mind', artist: 'Zen Masters', uri: 'https://example.com/songs/clearmind.mp3', mood: 'calm' },
    { id: '5', title: 'Summer Nights', artist: 'Twilight', uri: 'https://example.com/songs/summernights.mp3', mood: 'romantic' },
  ],
  clouds: [
    { id: '6', title: 'Cloud Surfing', artist: 'Sky Riders', uri: 'https://example.com/songs/cloudsurfing.mp3', mood: 'dreamy' },
    { id: '7', title: 'Gray Horizons', artist: 'Nimbus', uri: 'https://example.com/songs/grayhorizons.mp3', mood: 'reflective' },
    { id: '8', title: 'Cloud Cover', artist: 'Ambient Skies', uri: 'https://example.com/songs/cloudcover.mp3', mood: 'calm' },
    { id: '9', title: 'Silver Lining', artist: 'Optimist', uri: 'https://example.com/songs/silverlining.mp3', mood: 'hopeful' },
    { id: '10', title: 'Overcast', artist: 'Soft Shadows', uri: 'https://example.com/songs/overcast.mp3', mood: 'melancholy' },
  ],
  rain: [
    { id: '11', title: 'Gentle Rain', artist: 'Water Sounds', uri: 'https://example.com/songs/gentlerain.mp3', mood: 'peaceful' },
    { id: '12', title: 'Rainy Jazz', artist: 'Blue Notes', uri: 'https://example.com/songs/rainyjazz.mp3', mood: 'sophisticated' },
    { id: '13', title: 'Downpour', artist: 'Storm Chasers', uri: 'https://example.com/songs/downpour.mp3', mood: 'intense' },
    { id: '14', title: 'Rain Dance', artist: 'Tribal Beats', uri: 'https://example.com/songs/raindance.mp3', mood: 'rhythmic' },
    { id: '15', title: 'Raindrops', artist: 'Piano Keys', uri: 'https://example.com/songs/raindrops.mp3', mood: 'melancholy' },
  ],
  thunderstorm: [
    { id: '16', title: 'Thunder Rolls', artist: 'Storm Front', uri: 'https://example.com/songs/thunderrolls.mp3', mood: 'intense' },
    { id: '17', title: 'Electric Sky', artist: 'Lightning Strikes', uri: 'https://example.com/songs/electricsky.mp3', mood: 'energetic' },
    { id: '18', title: 'Storm Warning', artist: 'Weather Alert', uri: 'https://example.com/songs/stormwarning.mp3', mood: 'dramatic' },
    { id: '19', title: 'Tempest', artist: 'Symphony of Thunder', uri: 'https://example.com/songs/tempest.mp3', mood: 'powerful' },
    { id: '20', title: 'Shelter', artist: 'Safe Haven', uri: 'https://example.com/songs/shelter.mp3', mood: 'comforting' },
  ],
  snow: [
    { id: '21', title: 'Winter Wonderland', artist: 'Snow Patrol', uri: 'https://example.com/songs/winterwonderland.mp3', mood: 'magical' },
    { id: '22', title: 'Snowfall', artist: 'Silent Night', uri: 'https://example.com/songs/snowfall.mp3', mood: 'peaceful' },
    { id: '23', title: 'Frosty Morning', artist: 'Winter Chill', uri: 'https://example.com/songs/frostymorning.mp3', mood: 'crisp' },
    { id: '24', title: 'Blizzard', artist: 'Arctic Winds', uri: 'https://example.com/songs/blizzard.mp3', mood: 'intense' },
    { id: '25', title: 'Cozy Fireplace', artist: 'Warm Embrace', uri: 'https://example.com/songs/cozyfireplace.mp3', mood: 'comforting' },
  ],
  atmosphere: [
    { id: '26', title: 'Misty Morning', artist: 'Foggy Dew', uri: 'https://example.com/songs/mistymorning.mp3', mood: 'mysterious' },
    { id: '27', title: 'Hazy Days', artist: 'Blur', uri: 'https://example.com/songs/hazydays.mp3', mood: 'dreamy' },
    { id: '28', title: 'Visibility', artist: 'Clear View', uri: 'https://example.com/songs/visibility.mp3', mood: 'searching' },
    { id: '29', title: 'Suspended', artist: 'Particle', uri: 'https://example.com/songs/suspended.mp3', mood: 'floating' },
    { id: '30', title: 'Air Quality', artist: 'Breath', uri: 'https://example.com/songs/airquality.mp3', mood: 'ethereal' },
  ],
};

export const MusicProvider = ({ children }) => {
  const [currentPlaylist, setCurrentPlaylist] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const { weather, getWeatherCondition } = useWeather();

  // Generate recommendations based on weather
  useEffect(() => {
    if (weather) {
      const condition = getWeatherCondition();
      if (condition && musicLibrary[condition]) {
        setCurrentPlaylist(musicLibrary[condition]);
      }
    }
  }, [weather, getWeatherCondition]);

  // Load a song
  const loadSong = async (song) => {
    // Unload previous sound
    if (sound) {
      await sound.unloadAsync();
    }

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: song.uri },
        { shouldPlay: true }
      );

      setSound(newSound);
      setCurrentSong(song);
      setIsPlaying(true);

      // Listen for completion
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          playNextSong();
        }
      });
    } catch (error) {
      console.error('Failed to load song', error);
    }
  };

  // Play/pause toggle
  const togglePlayback = async () => {
    if (!sound) return;
    
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    
    setIsPlaying(!isPlaying);
  };

  // Play next song
  const playNextSong = () => {
    if (!currentPlaylist.length || !currentSong) return;
    
    const currentIndex = currentPlaylist.findIndex(song => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % currentPlaylist.length;
    loadSong(currentPlaylist[nextIndex]);
  };

  // Play previous song
  const playPreviousSong = () => {
    if (!currentPlaylist.length || !currentSong) return;
    
    const currentIndex = currentPlaylist.findIndex(song => song.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    loadSong(currentPlaylist[prevIndex]);
  };

  // Toggle favorite
  const toggleFavorite = (song) => {
    const isFavorite = favorites.some(fav => fav.id === song.id);
    
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.id !== song.id));
    } else {
      setFavorites([...favorites, song]);
    }
  };

  // Check if song is favorite
  const isFavorite = (songId) => {
    return favorites.some(fav => fav.id === songId);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <MusicContext.Provider
      value={{
        currentPlaylist,
        currentSong,
        isPlaying,
        favorites,
        loadSong,
        togglePlayback,
        playNextSong,
        playPreviousSong,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);

export default MusicContext;
