import { View, Text, StyleSheet, useWindowDimensions, SafeAreaView } from 'react-native'
import React from 'react'
import { Header, Avatar } from 'react-native-elements';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const FirstRoute = () => (
    <View style={{ flex: 1, backgroundColor: 'black' }} />
);

const SecondRoute = () => (
    <View style={{ flex: 1, backgroundColor: 'grey' }} />
);

const ThirdRoute = () => (
    <View style={{ flex: 1, backgroundColor: 'black' }} />
);

const FourthRoute = () => (
    <View style={{ flex: 1, backgroundColor: 'grey' }} />
);

const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
    fourth: FourthRoute
});

const ProfileCardScreen = () => {
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

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.avatar}>
                <Avatar
                    size='xlarge'
                    rounded
                    source={{ uri: 'https://cdn.landesa.org/wp-content/uploads/default-user-image.png' }}
                    title="Bj"
                    containerStyle={{ backgroundColor: 'grey' }}
                >
                </Avatar>
            </View>
            <View style={styles.ff}>
                <View>
                    <Text style={styles.text}>Followers</Text>
                    <Text style={styles.text}>46</Text>
                </View>
                <View>
                    <Text style={styles.text}>Followed</Text>
                    <Text style={styles.text}>78</Text>
                </View>
            </View>
            <TabView
                renderTabBar={renderTabBar}
                navigationState={{ index, routes }}
                renderScene={renderScene}
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
        marginTop: 70,
    },
    text: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        textAlign: 'center',
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
    }
})