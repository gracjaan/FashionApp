import { View, Text, SafeAreaView, StyleSheet, ActivityIndicator, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/auth';
import { Image } from 'expo-image';

const ArticleScreen = ({ route }) => {
    const { articleId } = route.params;
    const [article, setArticle] = useState(null);

    useEffect(() => {
        // Fetch the specific article from Firebase Firestore
        const fetchArticle = async () => {
            try {
                const doc = await firebase.firestore().collection('articles').doc(articleId).get();
                if (doc.exists) {
                    const articleData = doc.data();
                    setArticle(articleData);
                    console.log(articleData);
                } else {
                    console.log('Article not found');
                }
            } catch (error) {
                console.log('Error fetching article:', error);
            }
        };

        fetchArticle();
    }, [articleId]);

    if (!article) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#aaa" />
            </View>
        );
    }

    const timestamp = article.timestamp.toDate();

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
        <SafeAreaView style={styles.container}>
            {article && (
                <ScrollView>
                    <Image source={{ uri: article.postPicture }} style={styles.articleImage} />
                    <View style={styles.articleContainer}>
                        <Image source={{ uri: article.authorPicture }} style={styles.authorPicture} />
                        <View style={styles.articleInfo}>
                            <Text style={styles.articleTitle}>{article.title}</Text>
                            <Text style={styles.articleAuthor}>{article.author}</Text>
                            <Text style={styles.articleDate}>{formattedDate} · {formattedTime}</Text>
                        </View>
                    </View>
                    <View style={styles.article}>
                        {article.paragraphs && article.paragraphs.length > 0 ? (
                            article.paragraphs.map((paragraph, index) => (
                                <Text key={index} style={styles.articleContent}>{paragraph}</Text>
                            ))
                        ) : (
                            <Text style={styles.noContentText}>No content available for this article.</Text>
                        )}
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    )
}

export default ArticleScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    articleImage: {
        width: '90%',
        height: 300,
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: 20,
    },
    articleContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: '#1F1F1F',
        borderRadius: 10,
        padding: 10,
        margin: 20,
    },
    articleInfo: {
        flex: 1,
    },
    articleTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontFamily: 'Helvetica',
        marginBottom: 4,
    },
    articleAuthor: {
        fontSize: 16,
        color: '#FFFFFF',
        fontFamily: 'Helvetica',
        marginBottom: 4,
    },
    articleDate: {
        fontSize: 14,
        color: 'grey',
        fontFamily: 'Helvetica',
    },
    authorPicture: {
        width: 80,
        height: 80,
        marginRight: 16,
        borderRadius: 10,
    },
    articleContent: {
        fontSize: 16,
        color: '#FFFFFF',
        fontFamily: 'Helvetica',
        marginTop: 8,
        textAlign: 'justify'
    },
    article: {
        marginHorizontal: 20,

    },
    noContentText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontFamily: 'Helvetica',
        marginTop: 8,
        fontStyle: 'italic',
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