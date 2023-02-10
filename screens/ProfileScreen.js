import { View, SafeAreaView, StyleSheet } from 'react-native'
import { Header } from 'react-native-elements';
import { Text, Divider } from '@rneui/themed';
import React from 'react'

const ProfileScreen = () => {
    return (
        <View style={styles.container}>
            <Header
                backgroundColor='black'
                
                centerComponent={{ text: 'Profile', style: styles.headerCenter }}
                rightComponent={{ text: 'Save', style: styles.headerRight }}
            />
            <SafeAreaView>
                <Text>hey</Text>
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
        alignContent: 'center',
    },

})