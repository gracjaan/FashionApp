import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/auth';
import { Image } from 'expo-image';


const ThirdUser = ({user}) => {
    const [wishlistData, setWishlistData] = useState([]);

    const fetchWishlist = () => {
        try {
            const wishlistRef = firebase.firestore().collection('users').doc(user.uid).collection('wishlist');

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
    }, [user]);

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

export default ThirdUser;

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