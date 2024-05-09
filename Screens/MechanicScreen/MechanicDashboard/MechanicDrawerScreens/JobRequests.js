import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from "../../../../firebase/firebase.config";
import { collection, getDocs,getDoc, query, where, doc, updateDoc } from "firebase/firestore";

const JobRequestsScreen = ({ navigation }) => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from User_Request_of_services collection for current user
        const requestSnapshot = await getDocs(query(collection(db, "User_Request_of_services"), where("mechanicId", "==", auth.currentUser.uid)));
        const requestData = requestSnapshot.docs.map(doc => doc.data());
        console.log("Request data:", requestData);

        setServices(requestData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleAccept = async (userid) => {
    try {
      console.log("Accepting user with userid:", userid);
      const docRef = await doc(db, "User_Request_of_services", userid);
      const docSnapshot = await getDoc(docRef);
  console.log(docSnapshot)
      if (docSnapshot.exists()) {
        // Update the document
        console.log("data is update.....")
        await updateDoc(docRef, {
          status: "accepted",
        });
  
        console.log("Document updated successfully");
      } else {
        console.log("Document does not exist");
      }
    } catch (error) {
      console.error("Error accepting application: ", error);
    }
  };
  

  const handleReject = async (userid) => {
    try {
      // Check if the document exists
      const docRef = doc(db, "User_Request_of_services", userid);
      const docSnapshot = await getDoc(docRef);
  console.log(docSnapshot)
      if (docSnapshot.exists()) {
        // Update the document
        await updateDoc(docRef, {
          status: "rejected",
        });
  
        // Update the local state
        const updatedServices = services.map((item) => {
          if (item.userid === userid) {
            return { ...item, status: "rejected" };
          }
          return item;
        });
  
        setServices(updatedServices); // Update the local state
      } else {
        console.log("Document does not exist");
      }
    } catch (error) {
      console.error("Error rejecting application: ", error);
    }
  };
    const renderServiceItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.detail}>Service Needed: {item.serviceNeed}</Text>
      <Text style={styles.detail}>Email: {item.userid}</Text>
      <Text style={styles.detail}>Phone: {item.phone}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={() => handleAccept(item.userid)}>
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={() => handleReject(item.userid)}>
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User's Requests</Text>
      </View>
      <FlatList
        data={services}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderServiceItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF7A00',
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginTop: 30,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    marginLeft: 20,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default JobRequestsScreen;
