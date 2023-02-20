import { View, Text, SafeAreaView, StyleSheet } from 'react-native'
import React from 'react'

const AddPostScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>AddPostScreen</Text>
    </SafeAreaView>
  )
}

export default AddPostScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    }
})