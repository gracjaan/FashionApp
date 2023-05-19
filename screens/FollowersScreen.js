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

                    const followerData = followerRef.data();
                    const followerWithUid = {
                        ...followerData,
                        uid: follower, // add the uid property to the follower object
                    };
                    followerDetails.push(followerWithUid);
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
                <View style={styles.userContainer}>
                    {item.profilePicture && (
                        <Image source={{ uri: item.profilePicture }} style={styles.avatar} /> // Render avatar if available
                    )}
                    <View style={styles.userInfo}>
                        <Text style={styles.username}>{item.username}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ marginTop: 20 }}>
                <FlatList
                    data={followers}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                />
            </View>
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
    userContainer: {
        flexDirection: 'row',
        marginBottom: 8,
        backgroundColor: '#1F1F1F',
        borderRadius: 10,
        padding: 10,
        width: '90%',
        alignSelf: 'center',
    },
    userInfo: {
        flex: 1,
        justifyContent: 'center',
    },
});

export default FollowersScreen;
