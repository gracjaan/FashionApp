import { View, Text, StyleSheet, useWindowDimensions, SafeAreaView, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/auth';

const SecondUser = ({ user }) => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const querySnapshot = await firebase.firestore()
                .collection('posts')
                .where('uid', '==', user.uid)
                .get();
            const data = querySnapshot.docs.map((doc) => doc.data());
            setPosts(data);
        };
        fetchPosts();
    }, [user]);

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

export default SecondUser;

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