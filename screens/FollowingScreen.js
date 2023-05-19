import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Image, SafeAreaView, Text } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/auth';

const FollowingScreen = ({ route, navigation }) => {
    const { userId } = route.params;
    const [following, setFollowing] = useState([]);

    useEffect(() => {
        const fetchFollowing = async () => {
            try {
                const followingRef = await firebase.firestore()
                    .collection('users')
                    .doc(userId)
                    .get();
                const followingData = followingRef.data();
                const followingList = followingData.following;
                const followingDetails = [];

                for (const following of followingList) {
                    const followingRef = await firebase.firestore()
                        .collection('users')
                        .doc(following)
                        .get();

                    const followingData = followingRef.data();
                    const followingWithUid = {
                        ...followingData,
                        uid: following, // add the uid property to the follower object
                    };
                    followingDetails.push(followingWithUid);
                }

                setFollowing(followingDetails);
            } catch (error) {
                console.error('Error fetching following:', error);
            }
        };



        fetchFollowing();
    }, []);

    const renderItem = ({ item }) => {
        // Render your following item here
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
                    data={following}
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

export default FollowingScreen;
