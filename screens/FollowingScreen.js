import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Image, SafeAreaView, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/auth';

const FollowingScreen = ({ route, navigation }) => {
    const { followings } = route.params;
    const [follow, setFollow] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    const fetchFollowing = async () => {
        try {
            const followingDetails = [];

            for (const following of followings) {
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

            setFollow(followingDetails);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching following:', error);
        }
    };

    useEffect(() => {
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

    const renderFollowing = () => {
        if (isLoading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#aaa" />
                </View>
            );
        } else if (followings.length === 0) {
            return (
                <View style={styles.noFollowingsContainer}>
                    <Ionicons name="ellipsis-horizontal" size={100} color="#aaa" style={{ marginBottom: 10 }} />
                    <Text style={styles.noFollowingsText}>apparently that user {"\n"} doesn't follow anyone.</Text>
                </View>
            );
        } else {
            return (
                <FlatList
                    data={follow}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                />
            );
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={{ marginTop: 20 }}>
                {renderFollowing()}
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
    noFollowingsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    noFollowingsText: {
        color: 'grey',
        fontSize: 16,
        fontFamily: 'Helvetica',
        fontWeight: 'regular',
        textAlign: 'center',
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        marginBottom: 10,
    },
});

export default FollowingScreen;
