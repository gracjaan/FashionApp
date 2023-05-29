import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/auth';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import UserContext from '../context/UserContext';
import { Image } from 'expo-image';

const ThirdProfile = () => {
    const [link, setLink] = useState('');
    const [isImageSelected, setIsImageSelected] = useState(false);
    const [image, setImage] = useState('');
    const storageRef = firebase.storage().ref();
    const [wishlistData, setWishlistData] = useState([]);
    const { currentUser, setCurrentUser } = useContext(UserContext);

    const fetchWishlist = () => {
        try {
            const userId = currentUser.uid;
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


    const addItem = async (uri) => {
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
            const userId = currentUser.uid;

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
            await addItem(image);
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

    const deleteItem = async (wishlistId) => {
        try {
            // Delete the Wishlist item from Firestore
            const userId = currentUser.uid;
            const wishlistRef = firebase.firestore().collection('users').doc(userId).collection('wishlist').doc(wishlistId);
            const wishlistDoc = await wishlistRef.get();

            // Delete the image from Firebase Storage
            const storageRef = firebase.storage().refFromURL(wishlistDoc.data().imageUrl);
            await storageRef.delete();

            await wishlistRef.delete();

            console.log('Wishlist item and image deleted successfully');

            // Refresh the Wishlist data
            fetchWishlist();
        } catch (error) {
            console.error('Error deleting Wishlist item and image:', error);
        }
    };


    const handleDelete = (wishlistId) => {
        Alert.alert(
            'Delete item',
            'Are you sure you want to delete this item?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => deleteItem(wishlistId),
                },
            ],
        );
    };

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity onLongPress={() => handleDelete(item.id)} style={styles.rowContainer}>
                <Image
                    style={styles.square}
                    source={{ uri: item.imageUrl }}
                />
                <View style={styles.linkContainer}>
                    <Text style={styles.textSecond}>{item.link}</Text>
                </View>
            </TouchableOpacity>
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

export default ThirdProfile;

const styles = StyleSheet.create({
    text: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        textAlign: 'center',
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
    },
    cancel: {
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
        textDecorationLine: 'underline',
    }
});