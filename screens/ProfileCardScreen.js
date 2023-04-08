import { View, Text, StyleSheet, useWindowDimensions, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Header, Avatar } from 'react-native-elements';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/auth';

const FirstRoute = () => (
    <View style={{ flex: 1, backgroundColor: 'black' }} />
);

const SecondRoute = () => (
    <View style={{ flex: 1, backgroundColor: 'grey' }} />
);

const ThirdRoute = () => (
    <View style={{ flex: 1, backgroundColor: 'black' }} />
);

const FourthRoute = () => (
    <View style={{ flex: 1, backgroundColor: 'grey' }} />
);

const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
    fourth: FourthRoute
});

const ProfileCardScreen = () => {
    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'first', title: 'FITS' },
        { key: 'second', title: 'GRMNTS' },
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

    const [profilePicture, setProfilePicture] = useState('');
    const [username, setUsername] = useState('');
    const [numPosts, setNumPosts] = useState('');

    useEffect(() => {
        // Fetch the user's profile picture from Firebase
        const fetchProfilePicture = async () => {
            try {
                const user = firebase.auth().currentUser; // Get the current user
                const userDoc = await firebase.firestore().collection('users').doc(user.uid).get(); // Fetch the user's document from the 'users' collection
                if (userDoc.exists) {
                    const userData = userDoc.data(); // Get the data from the user's document
                    const profilePictureUrl = userData.profilePicture; // Get the profile picture URL from the user's data
                    const username = userData.username; // Get the username from the user's data
                    setProfilePicture(profilePictureUrl); // Update the state with the retrieved profile picture URL
                    setUsername(username); // Update the state with the retrieved username

                    const postsSnapshot = await firebase.firestore().collection('posts').where('uid', '==', user.uid).get();
                    const numPosts = postsSnapshot.size; // Get the number of posts
                    setNumPosts(numPosts);
                }
            } catch (error) {
                console.error('Error fetching profile picture:', error);
            }
        };

        fetchProfilePicture(); // Call the fetchProfilePicture function
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            {/* <View style={styles.avatar}>
                <Avatar
                    size='xlarge'
                    rounded
                    source={{ uri: profilePicture }}
                    title="Bj"
                    containerStyle={{ backgroundColor: 'grey' }}
                >
                </Avatar>
            </View>
            <View style={styles.ff}>
                <View>
                    <Text style={styles.text}>Followers</Text>
                    <Text style={styles.text}>46</Text>
                </View>
                <View>
                    <Text style={styles.text}>Followed</Text>
                    <Text style={styles.text}>78</Text>
                </View>
            </View> */}
            <View style={styles.personalcontainer}>
                <View style={styles.avatarcontainer}>
                    <Avatar
                        size='large'
                        rounded
                        source={{ uri: profilePicture }}
                        title="Bj"
                        containerStyle={{ backgroundColor: 'grey' }}
                    >
                    </Avatar>
                </View>
                <View style={styles.textcontainer}>
                    <Text style={styles.text}>{username}</Text>
                </View>
            </View>
            <View style={styles.statscontainer}>
                <View>
                    <Text style={styles.text}>{numPosts}</Text>
                    <Text style={styles.text}>Posts</Text>
                </View>
                <View>
                    <Text style={styles.text}>1.5M</Text>
                    <Text style={styles.text}>Followers</Text>
                </View>
                <View>
                    <Text style={styles.text}>71</Text>
                    <Text style={styles.text}>Following</Text>
                </View>
            </View>
            <TabView
                renderTabBar={renderTabBar}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
            />

        </SafeAreaView>
    )
}

export default ProfileCardScreen

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
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: '#434343',
        borderRadius: 10,
        width: '90%',
        alignSelf: 'center',
        padding: 10
    },
})