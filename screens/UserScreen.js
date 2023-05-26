import { View, Text, StyleSheet, useWindowDimensions, SafeAreaView, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Header, Avatar } from 'react-native-elements';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/auth';
import { Image } from 'expo-image';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import FirstUser from '../support/FirstUser';
import SecondUser from '../support/SecondUser';
import ThirdUser from '../support/ThirdUser';
import FourthUser from '../support/FourthUser';

const UserScreen = ({ route, navigation }) => {
    console.log('UserScreen route.params', route.params);
    
    const layout = useWindowDimensions();
    const { uid } = route.params;
    const [user, setUser] = useState(null);
    const [follow, setFollow] = useState(false);

    const [index, setIndex] = React.useState(0);

    const [routes] = React.useState([
        { key: 'first', title: 'FITS' },
        { key: 'third', title: 'WISHLIST' },
        { key: 'fourth', title: 'INSPO' },
    ]);

    const renderTabBar = props => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: 'white' }}
            style={{ backgroundColor: 'black' }}
        />
    );

    const fetchUser = async () => {
        try {
            const userDoc = await firebase.firestore().collection('users').doc(uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                setUser({ uid: uid, ...userData });
            }
        } catch (error) {
            console.error('Error fetching user', error);
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    const addFollow = async ({ currentUserUid, otherUserUid }) => {
        // If no, add the current user's uid to the other user's followers array
        await firebase.firestore().collection('users').doc(otherUserUid).update({
            followers: firebase.firestore.FieldValue.arrayUnion(currentUserUid)
        });

        // Add the other user's uid to the current user's following array
        await firebase.firestore().collection('users').doc(currentUserUid).update({
            following: firebase.firestore.FieldValue.arrayUnion(otherUserUid)
        });

        setFollow(true);
    };

    const removeFollow = async ({ currentUserUid, otherUserUid }) => {
        // If yes, remove the current user's uid from the other user's followers array
        await firebase.firestore().collection('users').doc(otherUserUid).update({
            followers: firebase.firestore.FieldValue.arrayRemove(currentUserUid)
        });

        // Remove the other user's uid from the current user's following array
        await firebase.firestore().collection('users').doc(currentUserUid).update({
            following: firebase.firestore.FieldValue.arrayRemove(otherUserUid)
        });

        setFollow(false);
    };

    const handleFollowButtonPress = async (otherUserUid) => {
        try {
            console.log('Follow button pressed for user:', otherUserUid);
            const currentUserUid = firebase.auth().currentUser.uid;
            const otherUser = (await firebase.firestore().collection('users').doc(otherUserUid).get()).data();

            console.log('otherUser', otherUser);
            // Check if the current user is already following the other user
            if (otherUser.followers.includes(currentUserUid)) {
                // If yes, remove the current user's uid from the other user's followers array
                removeFollow({ currentUserUid, otherUserUid });

            } else {
                // If no, add the current user's uid to the other user's followers array
                addFollow({ currentUserUid, otherUserUid });
            }
        } catch (error) {
            console.error('Error handling follow button press:', error);
        }
    };

    if (!user) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.personalcontainer}>
                <View style={styles.avatarcontainer}>
                    <Avatar
                        size='large'
                        rounded
                        source={{ uri: user.profilePicture }}
                        title="Bj"
                        containerStyle={{ backgroundColor: 'grey' }}
                    >
                    </Avatar>
                </View>
                <View style={styles.textcontainer}>
                    <Text style={styles.nickname}>{user.username}</Text>
                </View>
            </View>
            <View style={styles.statscontainer}>
                <View>
                    <Text style={styles.text}>{user.posts.length}</Text>
                    <Text style={styles.text}>posts</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('FollowersScreen', { followers: user.followers })}>
                    <View>
                        <Text style={styles.text}>{user.followers.length}</Text>
                        <Text style={styles.text}>followers</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('FollowingScreen', { followings: user.following })}>
                    <View>
                        <Text style={styles.text}>{user.following.length}</Text>
                        <Text style={styles.text}>following</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity onPress={() => handleFollowButtonPress(user.uid)} style={{ marginTop: 5 }}>
                    <View style={[styles.followButton, follow ? styles.followingButton : null]}>
                        <Text style={[styles.followText, follow ? styles.textSecond : null]}>
                            {follow ? 'following' : 'follow'}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            <TabView
                renderTabBar={renderTabBar}
                navigationState={{ index, routes }}
                renderScene={({ route }) => {
                    switch (route.key) {
                        case 'first':
                            return <FirstUser user={user} navigation={navigation} />; // Pass uid as a prop to FirstRoute
                        case 'third':
                            return <ThirdUser user={user} />;
                        case 'fourth':
                            return <FourthUser user={user} navigation={navigation} />;
                        default:
                            return null;
                    }
                }}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
            />

        </SafeAreaView>
    )
}

export default UserScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',

    },
    avatar: {
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 20,
    },
    text: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    nickname: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
    },
    ff: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        border: 10,
        marginBottom: 30,
    },
    famount: {
        borderColor: '#434343',
        borderWidth: 2,
        borderRadius: 10,
    },
    personalcontainer: {
        flexDirection: 'row',
        width: '90%',
        alignSelf: 'center',
    },
    textcontainer: {
        justifyContent: 'center',
        marginLeft: 10,
    },
    statscontainer: {
        margin: 20,
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: '#434343',
        borderRadius: 10,
        width: '90%',
        alignSelf: 'center',
        padding: 10
    },
    rowContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginVertical: 5,
    },
    square: {
        width: 50,
        height: 50,
        backgroundColor: '#434343',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
    linkContainer: {
        justifyContent: 'center',
        marginLeft: 20,
    },
    textSecond: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
    },
    followButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        marginHorizontal: 20,
        marginBottom: 10,
    },
    followingButton: {
        backgroundColor: '#1f1f1f',
    },
    followText: {
        color: 'black',
        fontSize: 20,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        textAlign: 'center',
    },
})