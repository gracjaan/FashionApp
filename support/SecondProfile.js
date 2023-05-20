import { View, Text, StyleSheet, useWindowDimensions, SafeAreaView, Image, FlatList, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/auth';


const SecondProfile = () => {
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
            <View style={{ marginLeft: 20 }}>
                <Text style={styles.textSecond}>Tops</Text>
                {[...topLinks].map((link) => (
                    <View >
                        <Text style={styles.link} key={link}>
                            {link}
                        </Text>
                    </View>
                ))}
            </View>
            <View style={{ marginLeft: 20, marginTop: 20 }}>
                <Text style={styles.textSecond}>Bottoms</Text>
                {[...bottomLinks].map((link) => (
                    <View >
                        <Text style={styles.link} key={link}>
                            {link}
                        </Text>
                    </View>
                ))}
            </View>
            <View style={{ marginLeft: 20, marginTop: 20 }}>
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

export default SecondProfile;

const styles = StyleSheet.create({
    textSecond: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
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