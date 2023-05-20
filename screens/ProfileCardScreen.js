import { View, Text, StyleSheet, useWindowDimensions, SafeAreaView, Image, FlatList, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Header, Avatar } from 'react-native-elements';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/auth';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

const FirstRoute = ({ navigation }) => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // Fetch the user's posts from Firebase
        const fetchPosts = async () => {
            try {
                const user = firebase.auth().currentUser; // Get the current user
                const postsSnapshot = await firebase.firestore().collection('posts').where('uid', '==', user.uid).get(); // Fetch the user's posts from the 'posts' collection
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
    }, []);

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

const SecondRoute = () => {
    const uid = firebase.auth().currentUser.uid;
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
            <View style={{marginLeft: 20}}>
                <Text style={styles.textSecond}>Tops</Text>
                {[...topLinks].map((link) => (
                    <View >
                        <Text style={styles.link} key={link}>
                            {link}
                        </Text>
                    </View>
                ))}
            </View>
            <View style={{marginLeft: 20, marginTop: 20}}>
                <Text style={styles.textSecond}>Bottoms</Text>
                {[...bottomLinks].map((link) => (
                    <View >
                        <Text style={styles.link} key={link}>
                            {link}
                        </Text>
                    </View>
                ))}
            </View>
            <View style={{marginLeft: 20, marginTop: 20}}>
                <Text style={styles.textSecond}>Accesories</Text>
                {[...accessoryLinks].map((link) => (
                    <View >
                        <Text style={styles.link} key={link}>
                            {link}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const ThirdRoute = () => {
    const [link, setLink] = useState('');
    const [isImageSelected, setIsImageSelected] = useState(false);
    const [image, setImage] = useState('');
    const storageRef = firebase.storage().ref();
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


    const uploadImageToFirebase = async (uri) => {
        const compressedUri = await compressAndResizeImage(uri);
        const response = await fetch(compressedUri);
        const blob = await response.blob();
        const filename = Date.now().toString(); // Use a unique filename
        const imageRef = storageRef.child(`images/${filename}`);

        try {
            await imageRef.put(blob);
            const downloadUrl = await imageRef.getDownloadURL();
            console.log(`Image uploaded to Firebase: ${downloadUrl}`);

            // Generate a postId
            const wishlistId = firebase.firestore().collection('users').doc(userId).collection('wishlist').doc().id;
            const userId = firebase.auth().currentUser.uid;

            // Add relevant data to Firestore database
            await firebase.firestore().collection('users').doc(userId).collection('wishlist').doc(wishlistId).set({
                imageUrl: downloadUrl,
                link: link,
            });

            return downloadUrl;
        } catch (error) {
            console.error('Error uploading image to Firebase:', error);
            return null;
        }
    };

    const compressAndResizeImage = async (uri) => {
        try {
            const manipResult = await ImageManipulator.manipulateAsync(
                uri,
                [{ resize: { width: 150, height: 150 } }],
                { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
            );

            return manipResult.uri;
        } catch (error) {
            console.log('Error compressing image:', error);
            throw error;
        }
    };

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setIsImageSelected(true);
        }
    };

    const onPostButtonPress = async () => {
        if (image) {
            await uploadImageToFirebase(image);
            reset();
            fetchWishlist();
        } else {
            console.log('No image selected');
        }
    };

    const reset = () => {
        setImage('');
        setLink('');
        setIsImageSelected(false);
    };

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
        <>
            <View style={styles.rowContainer}>
                <TouchableOpacity onPress={pickImage}>
                    {isImageSelected ? (
                        <Image
                            source={{ uri: image }}
                            style={{ width: 70, height: 70, borderRadius: 15 }} />
                    ) : (
                        <View style={styles.squareThird}>
                            <Ionicons name={'camera-outline'} size={27} color={'white'} />
                        </View>
                    )}
                </TouchableOpacity>
                <View style={styles.linkContainer}>
                    <TextInput
                        style={styles.textSecond}
                        onChangeText={text => setLink(text)}
                        value={link}
                        placeholder="www.example.com"
                        placeholderTextColor={'grey'}
                        keyboardAppearance='dark' />
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={styles.addlink} onPress={onPostButtonPress}>
                            <Text style={styles.textThird}>Add Link</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancel} onPress={reset}>
                            <Text style={styles.text}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={{ marginTop: 20 }}>
                <FlatList
                    data={wishlistData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                />
            </View>
        </>
    );
};

const FourthRoute = ({ navigation }) => {
    const [inspoPosts, setInspoPosts] = useState([]);

    useEffect(() => {
        // Fetch the current user's data from Firebase
        const currentUser = firebase.auth().currentUser;
        firebase.firestore().collection('users').doc(currentUser.uid).get()
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

const ProfileCardScreen = ({ navigation }) => {
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
    const [name, setName] = useState('');
    const [numPosts, setNumPosts] = useState('');
    const [numFollowers, setNumFollowers] = useState(0);
    const [numFollowing, setNumFollowing] = useState(0);

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
                    const name = userData.name; // Get the name from the user's data
                    setProfilePicture(profilePictureUrl); // Update the state with the retrieved profile picture URL
                    setUsername(username); // Update the state with the retrieved username
                    setNumFollowers(userData.followers.length); // Update the state with the number of followers
                    setNumFollowing(userData.following.length); // Update the state with the number of following
                    setName(name); // Update the state with the retrieved name

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
            <View style={styles.personalcontainer}>
                <View style={styles.avatarcontainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('EditProfileScreen')}>
                        <Avatar
                            size='large'
                            rounded
                            source={{ uri: profilePicture }}
                            title="Bj"
                            containerStyle={{ backgroundColor: 'grey' }}
                        >
                        </Avatar>
                    </TouchableOpacity>
                </View>
                <View style={styles.textcontainer}>
                    <Text style={styles.nickname}>{name}</Text>
                    <Text style={[styles.nickname, { fontWeight: 'regular', marginTop: 5 }]}>@{username}</Text>
                </View>
            </View>
            <View style={styles.statscontainer}>
                <View>
                    <Text style={styles.text}>{numPosts}</Text>
                    <Text style={styles.text}>posts</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('FollowersScreen', { userId: firebase.auth().currentUser.uid })}>
                    <View>
                        <Text style={styles.text}>{numFollowers}</Text>
                        <Text style={styles.text}>followers</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('FollowingScreen', { userId: firebase.auth().currentUser.uid })}>
                    <View>
                        <Text style={styles.text}>{numFollowing}</Text>
                        <Text style={styles.text}>following</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <TabView
                renderTabBar={renderTabBar}
                navigationState={{ index, routes }}
                renderScene={({ route }) => {
                    switch (route.key) {
                        case 'first':
                            return <FirstRoute navigation={navigation} />; // Pass uid as a prop to FirstRoute
                        case 'second':
                            return <SecondRoute />;
                        case 'third':
                            return <ThirdRoute />;
                        case 'fourth':
                            return <FourthRoute navigation={navigation} />;
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
        flex: 1,
    },
    textSecond: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
    },
    squareThird: {
        width: 70,
        height: 70,
        backgroundColor: '#434343',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
    textThird: {
        color: 'black',
        fontSize: 20,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    addlink: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 5,
        width: '60%',
        marginTop: 10,
        //alignSelf: 'center',
    },
    cancel: {
        //backgroundColor: '',
        borderRadius: 10,
        padding: 5,
        marginLeft: 10,
        marginTop: 10,
        width: '35%',
    },
    link: {
        color: 'grey',
        fontSize: 16,
        fontFamily: 'Helvetica',
        fontWeight: 'regular',
        //textAlign: 'center',
        textDecorationLine: 'underline',
    }

})