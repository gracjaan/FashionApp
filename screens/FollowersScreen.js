import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Image, SafeAreaView, Text } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/auth';

const FollowersScreen = ({ route, navigation }) => {
    const { userId } = route.params;
    const [followers, setFollowers] = useState([]);

    useEffect(() => {
        const fetchFollowers = async () => {
            try {
              const followersRef = await firebase.firestore()
                .collection('users')
                .doc(userId)
                .get();
              const followersData = followersRef.data();
              const followersList = followersData.followers;
              const followerDetails = [];
          
              for (const follower of followersList) {
                const followerRef = await firebase.firestore()
                  .collection('users')
                  .doc(follower)
                  .get();
          
                followerDetails.push(followerRef.data());
              }
          
              setFollowers(followerDetails);
            } catch (error) {
              console.error('Error fetching followers:', error);
            }
          };
          

        fetchFollowers();
    }, []);

    const renderItem = ({ item }) => {
        // Render your follower item here
        return (
            <TouchableOpacity onPress={() => navigation.navigate('UserScreen', { uid: item.uid })}>
                <View style={styles.userItem}>
                    {item.profilePicture && (
                        <Image source={{ uri: item.profilePicture }} style={styles.avatar} /> // Render avatar if available
                    )}
                    <Text style={styles.username}>{item.username}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={followers}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    avatar: {
        height: 30,
        width: 30,
        resizeMode: 'contain',
        borderRadius: 100,
        marginRight: 10
    },
    username: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Helvetica',
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#434343',
        marginTop: 10,
    },
});

export default FollowersScreen;