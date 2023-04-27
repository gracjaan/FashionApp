import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/auth';

const ArticlesScreen = ({ navigation }) => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Fetch articles from Firebase Firestore
    const fetchArticles = async () => {
      try {
        const snapshot = await firebase.firestore().collection('articles').get();
        const articlesData = snapshot.docs.map((doc) => {
          const data = doc.data();
          data.id = doc.id; // Include the document ID as part of the article data
          return data;
        });
        setArticles(articlesData);
        console.log(articles);
      } catch (error) {
        console.log('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ArticleScreen', { articleId: item.id })}>
      <View style={styles.articleContainer}>
        <Image source={{ uri: item.postPicture }} style={styles.articleImage} />
        <View style={styles.articleInfo}>
          <Text style={styles.articleTitle}>{item.title}</Text>
          <Text style={styles.articleAuthor}>{item.author}</Text>
          <Text style={styles.articleDate}>12.04.2023</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={articles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default ArticlesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  articleContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#1F1F1F',
    borderRadius: 10,
    padding: 10,
  },
  articleImage: {
    width: 80,
    height: 80,
    marginRight: 16,
    borderRadius: 10,
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
    color: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
});

