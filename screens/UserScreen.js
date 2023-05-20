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

const FirstRoute = ({ uid, navigation }) => {
    const [posts, setPosts] = useState([]);
    const [uidState, setUidState] = useState(uid);

    useEffect(() => {
        setUidState(uid);
    }, [uid]);

    useEffect(() => {
        console.log("performing useeffect")
        // Fetch the user's posts from Firebase
        const fetchPosts = async () => {
            try {
                const user = firebase.auth().currentUser; // Get the current user
                const postsSnapshot = await firebase
                    .firestore()
                    .collection('posts')
                    .where('uid', '==', uidState)
                    .get();
                const postsData = [];
                postsSnapshot.forEach(postDoc => {
                    const postData = postDoc.data(); // Get the data from each post document
                    postsData.push(postData); // Add the post data to the postsData array
                });
                setPosts(postsData); // Update the state with the retrieved posts
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts(); // Call the fetchPosts function
    }, [uidState]);

    return (
        <View style={{ flex: 1, backgroundColor: 'black', }}>
            {/* Render the user's posts in a 3x3 grid */}
            <FlatList
                data={posts}
                numColumns={3}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={{
                            width: '33.33%', // Set a fixed width for each item (3 items in a row)
                            aspectRatio: 1, // Maintain the aspect ratio of the image
                        }}
                        onPress={() => navigation.navigate('PostScreen', { postId: item.postId })}
                    >
                        <Image
                            source={{ uri: item.imageUrl }}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ flexGrow: 1 }}
            />
        </View>
    );
};

const SecondRoute = ({ uid }) => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const querySnapshot = await firebase.firestore()
                .collection('posts')
                .where('uid', '==', uid)
                .get();
            const data = querySnapshot.docs.map((doc) => doc.data());
            setPosts(data);
        };
        fetchPosts();
    }, [uid]);

    // create a Set for each type of link to ensure uniqueness
    const topLinks = new Set();
    const bottomLinks = new Set();
    const accessoryLinks = new Set();
    posts.forEach((post) => {
        if (post.toplink) {
            topLinks.add(post.toplink);
        }
        if (post.bottomlink) {
            bottomLinks.add(post.bottomlink);
        }
        if (post.accessorylink) {
            accessoryLinks.add(post.accessorylink);
        }
    });

    return (
        <View>
            {[...topLinks].map((link) => (
                <View style={styles.rowContainer}>
                    <View style={styles.square}>
                        <Ionicons name={'arrow-up'} size={27} color={'white'} />
                    </View>
                    <View style={styles.linkContainer}>
                        <Text style={styles.textSecond} key={link}>
                            {link}
                        </Text>
                    </View>
                </View>
            ))}
            {[...bottomLinks].map((link) => (
                <View style={styles.rowContainer}>
                    <View style={styles.square}>
                        <Ionicons name={'arrow-down'} size={27} color={'white'} />
                    </View>
                    <View style={styles.linkContainer}>
                        <Text style={styles.textSecond} key={link}>
                            {link}
                        </Text>
                    </View>
                </View>
            ))}
            {[...accessoryLinks].map((link) => (
                <View style={styles.rowContainer}>
                    <View style={styles.square}>
                        <Ionicons name={'arrow-up'} size={27} color={'white'} />
                    </View>
                    <View style={styles.linkContainer}>
                        <Text style={styles.textSecond} key={link}>
                            {link}
                        </Text>
                    </View>
                </View>
            ))}
        </View>
    );
};




const ThirdRoute = () => {
    const [wishlistData, setWishlistData] = useState([]);

    const fetchWishlist = () => {
        try {
            const userId = firebase.auth().currentUser.uid;
            const wishlistRef = firebase.firestore().collection('users').doc(userId).collection('wishlist');

            wishlistRef.get().then((querySnapshot) => {
                const wishlistData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    imageUrl: doc.data().imageUrl,
                    link: doc.data().link,
                }));
                setWishlistData(wishlistData);
            });
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const renderItem = ({ item }) => {
        return (
            <View style={styles.rowContainer}>
                <Image
                    style={styles.square}
                    source={{ uri: item.imageUrl }}
                />
                <View style={styles.linkContainer}>
                    <Text style={styles.textSecond}>{item.link}</Text>
                </View>
            </View>
        );
    };


    return (
        <View>
            <FlatList
                data={wishlistData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

const FourthRoute = ({ uid, navigation }) => {
    const [inspoPosts, setInspoPosts] = useState([]);

    useEffect(() => {
        // Fetch the current user's data from Firebase
        firebase.firestore().collection('users').doc(uid).get()
            .then(userDoc => {
                const userData = userDoc.data();

                // Loop through the user's "inspo" array
                const inspoPostIds = userData.inspo || [];
                const fetchInspoPosts = async () => {
                    const fetchedInspoPosts = [];
                    for (const postId of inspoPostIds) {
                        // Fetch the corresponding post data from the "posts" collection
                        const postDoc = await firebase.firestore().collection('posts').doc(postId).get();
                        const postData = postDoc.data();
                        if (postData) {
                            fetchedInspoPosts.push(postData);
                        }
                    }
                    setInspoPosts(fetchedInspoPosts);
                };

                fetchInspoPosts();
            })
            .catch(error => console.error('Error fetching user data:', error));
    }, []);

    return (
        <View style={{ flex: 1 }}>
            {/* Render the user's "inspo" posts in a 3x3 grid */}
            <FlatList
                data={inspoPosts}
                numColumns={3}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={{
                            width: '33.33%', // Set a fixed width for each item (3 items in a row)
                            aspectRatio: 1, // Maintain the aspect ratio of the image
                        }}
                        onPress={() => navigation.navigate('PostScreen', { postId: item.postId })}
                    >
                        <Image
                            source={{ uri: item.imageUrl }}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ flexGrow: 1 }}
            />
        </View>
    );
};

const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
    fourth: FourthRoute
});

const UserScreen = ({ route, navigation }) => {
    const layout = useWindowDimensions();
    const { uid } = route.params;

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
    const [numFollowers, setNumFollowers] = useState(0);
    const [numFollowing, setNumFollowing] = useState(0);
    const [follow, setFollow] = useState(false);

    useEffect(() => {
        // Fetch the user's profile picture from Firebase
        const fetchProfilePicture = async () => {
            try {
                const user = firebase.auth().currentUser; // Get the current user
                const userDoc = await firebase.firestore().collection('users').doc(uid).get(); // Fetch the user's document from the 'users' collection
                if (userDoc.exists) {
                    const userData = userDoc.data(); // Get the data from the user's document
                    const profilePictureUrl = userData.profilePicture; // Get the profile picture URL from the user's data
                    const username = userData.username; // Get the username from the user's data
                    setProfilePicture(profilePictureUrl); // Update the state with the retrieved profile picture URL
                    setUsername(username); // Update the state with the retrieved username
                    setNumFollowers(userData.followers.length); // Update the state with the number of followers
                    setNumFollowing(userData.following.length); // Update the state with the number of following
                    console.log('User data:', userData);
                    if (userData.followers.includes(user.uid)) {
                        console.log('User is following');
                        setFollow(true);
                    }

                    const postsSnapshot = await firebase.firestore().collection('posts').where('uid', '==', uid).get();
                    const numPosts = postsSnapshot.size; // Get the number of posts
                    setNumPosts(numPosts);
                }
            } catch (error) {
                console.error('Error fetching profile picture:', error);
            }
        };

        fetchProfilePicture(); // Call the fetchProfilePicture function
    }, [uid]);

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

    return (
        <SafeAreaView style={styles.container}>
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
                    <Text style={styles.nickname}>{username}</Text>
                </View>
            </View>
            <View style={styles.statscontainer}>
                <View>
                    <Text style={styles.text}>{numPosts}</Text>
                    <Text style={styles.text}>posts</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('FollowersScreen', { userId: uid })}>
                    <View>
                        <Text style={styles.text}>{numFollowers}</Text>
                        <Text style={styles.text}>followers</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('FollowingScreen', { userId: uid })}>
                    <View>
                        <Text style={styles.text}>{numFollowing}</Text>
                        <Text style={styles.text}>following</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity onPress={() => handleFollowButtonPress(uid)} style={{ marginTop: 5 }}>
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
                            return <FirstRoute uid={uid} navigation={navigation} />; // Pass uid as a prop to FirstRoute
                        case 'second':
                            return <SecondRoute uid={uid} />;
                        case 'third':
                            return <ThirdRoute />;
                        case 'fourth':
                            return <FourthRoute uid={uid} navigation={navigation} />;
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