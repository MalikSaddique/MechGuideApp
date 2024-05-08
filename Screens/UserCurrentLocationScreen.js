import React, { useState, useEffect, useRef  } from 'react';
import { View, StyleSheet, Dimensions, Platform, Alert, TouchableOpacity, Text,Button, TextInput } from 'react-native';
import MapView, { Marker, Polyline, Heatmap } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Ionicons } from '@expo/vector-icons';
import OptionBottomSheet from './BottomSheet/OptionBottomSheet';
import { DrawerActions } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const UserLocationScreen = ({navigation}) => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [mapRegion, setMapRegion] = useState(null);
  const bottomSheetRef = useRef(null);
  const [customMarkers, setCustomMarkers] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });
      setLocation(currentLocation);
      setMapRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.005, 
        longitudeDelta: 0.005,
      });
    })();
  }, []);

  const handleRegionChange = (region) => {
    if (Math.abs(region.latitude - mapRegion.latitude) > 0.001 ||
    Math.abs(region.longitude - mapRegion.longitude) > 0.001) {
  setMapRegion(region);
}
  }; 

  const openBottomSheet = () => {
    bottomSheetRef.current?.snapToIndex(1); 
  }
  const coordinates = [
    { latitude: 37.78825, longitude: -122.4324 },
    { latitude: 37.75825, longitude: -122.4624 },
    { latitude: 37.76825, longitude: -122.4824 }
  ];
  const heatmapPoints = [
    { latitude: 37.78825, longitude: -122.4324, weight: 10 },
    { latitude: 37.75825, longitude: -122.4624, weight: 10 },
    { latitude: 37.76825, longitude: -122.4824, weight: 10 },
  ];

  //Handle map address
  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setCustomMarkers(currentMarkers => [...currentMarkers, { latitude, longitude }]);
  };

  //Handle Address Search
  const handleAddressSearch = async () => {
    //when we take api key we will put it here
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=YOUR_API_KEY`;
    try {
      const response = await fetch(apiUrl);
      const json = await response.json();
      if (json.results.length > 0) {
        const { lat, lng } = json.results[0].geometry.location;
        setMapRegion({
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
        setCustomMarkers(currentMarkers => [...currentMarkers, { latitude: lat, longitude: lng }]);
      } else {
        Alert.alert('No results found');
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
      Alert.alert('Failed to fetch location');
    }
  };
  
 
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
  <TextInput
    style={styles.searchInput}
    placeholder="Enter an address"
    value={address}
    onChangeText={setAddress}
    placeholderTextColor="#666"
  />
 <TouchableOpacity onPress={handleAddressSearch} style={styles.searchButton}>
        <Ionicons name="ios-search" size={24} color="#fff" />
      </TouchableOpacity>
</View>
      <TouchableOpacity
        style={styles.menuIcon}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      >
        <Ionicons name="md-menu" size={32} color="#000" />
      </TouchableOpacity>
      {mapRegion && (
        <MapView
          style={styles.map}
          region={mapRegion}
          onRegionChangeComplete={handleRegionChange}
          showsUserLocation={true}
          showsMyLocationButton={true}
          onPress={handleMapPress}
        >
           <Heatmap points={heatmapPoints} />
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="My Location"
            description="You are here"
          />  
           <Polyline
    coordinates={coordinates}
    strokeColor="#000" 
    strokeWidth={6}
  />
        </MapView>
      )}
       <TouchableOpacity
        style={styles.grabberWrapper}
        onPress={openBottomSheet}
        activeOpacity={0.8}>
        <View style={styles.grabber} />
      </TouchableOpacity>
      <OptionBottomSheet ref={bottomSheetRef} onOptionPress={openBottomSheet} />
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: width,
    height: height,
  },
  searchContainer: {
    position:'absolute',
    top: Platform.OS === 'ios' ? 100 : 80,
    flexDirection: 'row',
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 7,
    shadowColor: '#000',
    shadowOpacity: 0.9,
    shadowRadius: 10,
   shadowOffset: { width: 0, height: 0 },
   elevation: 60,
   zIndex:5,
    alignItems: 'center', 
    opacity:10
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,  
    fontSize: 16,
    color: '#333',
  },  
  searchButton: {
    padding: 10,
    backgroundColor: '#007BFF', 
    borderRadius: 25,
  },
  optionButton: {
    backgroundColor: '#ffffff', 
    paddingHorizontal: 30, // Horizontal padding
    paddingVertical: 10, // Vertical padding
    borderRadius: 10, // Rounded corners
    marginVertical: 5, // Margin between buttons
    width: '90%', // 90% of container width
    flexDirection: 'row', // Icon and text in a row
    justifyContent: 'space-between', // Space between icon and text
    alignItems: 'center', // Center items vertically
  },
  lastOptionButton: {
    marginBottom: 20, // Additional bottom margin for the last button
  },
  optionText: {
    color: '#000000', // Black color for the text
  },
  menuIcon: {
    position: 'absolute',
    top:  30, 
    left: 10,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    width: 50,  
    height: 50, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 2,
},
grabberWrapper: {
  position: 'absolute',
  bottom: 0,
  width: '100%',
  alignItems: 'center',
  padding: 10,
  borderTopWidth: 5,
  borderTopColor: '#ccc',
},
grabber: {
  width: 100,
  height: 7,
  borderRadius: 5,
  backgroundColor: '#FF7A00',
},
});

export default UserLocationScreen;
