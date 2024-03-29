import { View, Text, StyleSheet, useWindowDimensions, SafeAreaView, Image, FlatList, TouchableOpacity, ScrollView, TextInput, RefreshControl, ActivityIndicator } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { Header, Avatar } from 'react-native-elements';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/auth';
import UserContext from '../context/UserContext';
import FirstProfile from '../support/FirstProfile';
import SecondProfile from '../support/SecondProfile';
import ThirdProfile from '../support/ThirdProfile';
import FourthProfile from '../support/FourthProfile';

const ProfileCardScreen = ({ navigation }) => {
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const { currentUser, setCurrentUser } = useContext(UserContext);
    const [refreshing, setRefreshing] = useState(false);

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
        console.log('fetching user');
        try {
            const userDoc = await firebase.firestore().collection('users').doc(currentUser.uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                //change currentUser to userData
                const change = { uid: currentUser.uid, ...userData };
                setCurrentUser(change);
            }
        } catch (error) {
            console.error('Error fetching user', error);
        }
    }

    const onRefresh = () => {
        setRefreshing(true);
        fetchUser();
        setRefreshing(false);
    }

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('EditProfileScreen')}>
                    <Ionicons name="ellipsis-horizontal" size={25} color="white" style={{ marginRight: 10 }} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    return (
        <SafeAreaView style={styles.container} >
            <View>
                <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
                    <View style={styles.personalcontainer}>
                        <View style={styles.avatarcontainer}>
                            <TouchableOpacity onPress={() => navigation.navigate('EditProfileScreen')}>
                                <Avatar
                                    size='large'
                                    rounded
                                    source={{ uri: currentUser.profilePicture }}
                                    title="Bj"
                                    containerStyle={{ backgroundColor: 'grey' }}
                                >
                                </Avatar>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.textcontainer}>
                            <Text style={styles.nickname}>{currentUser.name}</Text>
                            <Text style={[styles.nickname, { fontWeight: 'regular', marginTop: 5 }]}>@{currentUser.username}</Text>
                        </View>
                    </View>
                    <View style={styles.statscontainer}>
                        <View>
                            <Text style={styles.text}>{currentUser.posts.length}</Text>
                            <Text style={styles.text}>posts</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('FollowersScreen', { followers: currentUser.followers })}>
                            <View>
                                <Text style={styles.text}>{currentUser.followers.length}</Text>
                                <Text style={styles.text}>followers</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('FollowingScreen', { followings: currentUser.following })}>
                            <View>
                                <Text style={styles.text}>{currentUser.following.length}</Text>
                                <Text style={styles.text}>following</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
            <TabView
                renderTabBar={renderTabBar}
                navigationState={{ index, routes }}
                renderScene={({ route }) => {
                    switch (route.key) {
                        case 'first':
                            return <FirstProfile navigation={navigation} />;
                        case 'third':
                            return <ThirdProfile />;
                        case 'fourth':
                            return <FourthProfile navigation={navigation} />;
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
})