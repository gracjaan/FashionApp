import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react'
import { Image } from 'expo-image'
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/auth';
import PostItem from '../comp/PostItem';

const PostScreen = ({ route, navigation }) => {
    const { item } = route.params;
    console.log(item)
    return (
        <SafeAreaView style={styles.container}>
            <PostItem
                item={item}
                navigation={navigation}
            />
        </SafeAreaView>
    )
}

export default PostScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    image: {
        width: '98%',
        height: 400,
        resizeMode: 'cover',
        borderRadius: 10,
        alignSelf: 'center'
    },
    avatar: {
        height: 30,
        width: 30,
        resizeMode: 'contain',
        borderRadius: 100
    },
    cardView: {
        marginBottom: 40,
        width: '100%',
        height: 530,
        alignSelf: 'center',
    },
    topCard: {
        flexDirection: 'row',
        margin: 15,
        alignItems: 'center',
        width: '95%',
        alignSelf: 'center',
    },
    nickname: {
        color: 'white',
        fontSize: 17,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        //textAlign: 'center',
        //marginLeft: 10,
    },
    loaderStyle: {
        marginVertical: 16,
        alignItems: "center",
    },
    date: {
        color: 'grey',
        fontSize: 12,
        fontFamily: 'Helvetica',
        fontWeight: 'regular',
        //textAlign: 'center',
    },
    description: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'Helvetica',
        fontWeight: 'regular',
        //textAlign: 'center',
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        marginBottom: 10,
        backgroundColor: 'black',
        flex: 1,
    },
})