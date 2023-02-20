import { View, Text, SafeAreaView, StyleSheet } from 'react-native'
import React from 'react'

const FeedScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>FeedScreen</Text>
    </SafeAreaView>
  )
}

export default FeedScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    }
})