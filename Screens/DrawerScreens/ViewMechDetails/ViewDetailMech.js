import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { mockMechanics } from '../mockMechanics';
import { Ionicons } from '@expo/vector-icons'; 

const { width } = Dimensions.get('window');

const MechanicDetailsScreen = ({ route, navigation }) => {
  const { mechanicId } = route.params;
  const [mechanic, setMechanic] = useState(null);

  useEffect(() => {
    const foundMechanic = mockMechanics.find(m => m.id === mechanicId); //here useMechanic in space of mockMechanics for backend
    setMechanic(foundMechanic);
  }, [mechanicId]);

  if (!mechanic) {
    return <Text>Loading...</Text>; 
  }

//   Handle Request
  const handleRequest=()=>{
   Alert.alert('Your request have been submitted', 'You will be notify soon about request approval!');
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{mechanic.name}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.shopName}>{mechanic.shopName}</Text>
        <Text style={styles.info}>Services: {mechanic.servicesOffered.join(', ')}</Text>
        <Text style={styles.info}>Location: {mechanic.location}</Text>
        <Text style={styles.info}>Pricing: {mechanic.pricing}</Text>
         <TouchableOpacity style={styles.button} onPress={handleRequest} >
            <Text style={styles.buttonText}>Request a Service</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    marginTop:25,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF7A00',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  backButton: {
    marginRight: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    width: '100%',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    marginVertical: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: width * 0.05,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default MechanicDetailsScreen;
