import { View, SafeAreaView, StyleSheet, Button, Image, Text, TextInput } from 'react-native'
import { Header, Avatar } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useEffect, useRef } from 'react'
import {Divider} from '@rneui/themed'

const ProfileScreen = (navigation, route) => {
    const [fullname, setFullname] = useState('')
    const fullnameInput = useRef(null)
    const [username, setUsername] = useState('')
    const usernameInput = useRef(null)
    const [bio, setBio] = useState('')
    const bioInput = useRef(null)
    const [location, setLocation] = useState('')
    const locationInput = useRef(null)

    const [image, setImage] = useState('https://cdn.landesa.org/wp-content/uploads/default-user-image.png');

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.container}>
            <Header
                backgroundColor='black'
                centerComponent={{ text: 'Profile', style: styles.headerCenter }}
                rightComponent={{ text: 'Save', style: styles.headerRight }}
            />
            <SafeAreaView>
                <View style={styles.tinyImage}>
                    {image && (
                        <Avatar
                            size='xlarge'
                            rounded
                            source={{ uri: image }}
                            title="Bj"
                            containerStyle={{ backgroundColor: 'grey' }}
                            onPress={pickImage}
                        >
                            <Avatar.Accessory size={44} source={{ uri: 'https://www.creativefabrica.com/wp-content/uploads/2019/02/Camera-icon-by-ahlangraphic-8-580x386.jpg' }} />
                        </Avatar>
                    )}
                </View>
                <View>
                <Divider style={{margin: 10, marginTop: 80}}/>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        <Text style={styles.firstColumn}>Full name</Text>
                        <TextInput
                            ref={fullnameInput}
                            style={styles.secondColumn}
                            onChangeText={text => setFullname(text)}
                            value={fullname}
                            placeholder="Full name"
                            placeholderTextColor={'grey'}
                        />
                    </View>
                    <Divider style={{margin: 10,}}/>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        <Text style={styles.firstColumn}>Username</Text>
                        <TextInput
                            ref={usernameInput}
                            style={styles.secondColumn}
                            onChangeText={text => setUsername(text)}
                            value={username}
                            placeholder="Username"
                            placeholderTextColor={'grey'}
                        />
                    </View>
                    <Divider style={{margin: 10,}}/>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        <Text style={styles.firstColumn}>Bio</Text>
                        <TextInput
                            ref={bioInput}
                            style={styles.secondColumn}
                            onChangeText={text => setBio(text)}
                            value={bio}
                            placeholder="Bio"
                            placeholderTextColor={'grey'}
                        />
                    </View>
                    <Divider style={{margin: 10, marginTop: 80}}/>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        <Text style={styles.firstColumn}>Location</Text>
                        <TextInput
                            ref={locationInput}
                            style={styles.secondColumn}
                            onChangeText={text => setLocation(text)}
                            value={location}
                            placeholder="Location"
                            placeholderTextColor={'grey'}
                        />
                    </View>
                    <Divider style={{margin: 10,}}/>
                </View>
            </SafeAreaView>
        </View>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    headerCenter: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    headerRight: {
        color: 'grey',
        fontSize: 20,
        fontFamily: 'Helvetica',
        textAlign: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: 'black',
        //alignContent: 'center',
    },
    tinyImage: {
        marginTop: 40,
        alignSelf: 'center',
    },
    inputPhone: {
        paddingHorizontal: 40,
        color: 'white',
        fontSize: 20,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        //textAlign: 'center',
    },
    firstColumn: {
        marginLeft: 10,
        //marginTop: 40,
        width: '80%',
        color: 'white',
        fontSize: 20,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',

    },
    secondColumn: {
        //marginTop: 40,
        position: 'absolute',
        left: 150,
        color: 'white',
        fontSize: 20,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
    }

})