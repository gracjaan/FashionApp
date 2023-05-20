import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const PostItem = ({ item, likedPosts, inspoPosts, handleLikeButtonPress, handleInspoButtonPress, navigation }) => {

    const timestamp = item.timestamp.toDate();

    // Format the date as "DD.MM.YYYY"
    const formattedDate = timestamp.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const formattedTime = timestamp.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric'
    });

    return (
        <View style={styles.cardView}>
            <View style={styles.topCard}>
                <TouchableOpacity onPress={() => navigation.navigate('UserScreen', { uid: item.uid })}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={styles.avatar} source={{ uri: item.profilePicture }} />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={styles.nickname}>{item.username}</Text>
                            <Text style={styles.date}>{formattedDate} · {formattedTime}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
            <View>
                <Image style={styles.image} source={{ uri: item.imageUrl }} />
            </View>
            <View style={[styles.topCard, { justifyContent: 'space-between', marginBottom: 5 }]}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={{ marginRight: 10 }} onPress={() => handleLikeButtonPress(item)}>
                        <Ionicons
                            name={likedPosts.includes(item.postId) ? 'heart' : 'heart-outline'}
                            size={28}
                            color={likedPosts.includes(item.postId) ? '#fb3959' : 'white'}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginRight: 10 }} onPress={() => navigation.navigate('CommentsScreen', { postId: item.postId })}>
                        <Ionicons name={'chatbubble-outline'} size={25} color={'white'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginRight: 10 }} onPress={() => handleInspoButtonPress(item)}>
                        <Ionicons
                            name={inspoPosts.includes(item.postId) ? 'bookmark' : 'bookmark-outline'}
                            size={25}
                            color={'white'}
                        />
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity onPress={() => navigation.navigate('GarmentsScreen', { postId: item.postId })}>
                        <Ionicons name={'shirt-outline'} size={25} color={'white'} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ marginHorizontal: 10 }}>
                {item.description && (
                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                        <Text style={styles.nickname}>{item.username}: </Text>
                        <Text style={styles.description}>{item.description}</Text>
                    </View>
                )}
                <Text style={styles.description}>liked by {item.likes.length} fashion icons.</Text>
            </View>
        </View>
    )
}

export default PostItem

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
      },
      image: {
        width: '98%',
        aspectRatio: 1,
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
        marginBottom: 20,
        width: '100%',
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
        fontSize: 15,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        //textAlign: 'center',
      },
      loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        marginBottom: 10,
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
      }
})