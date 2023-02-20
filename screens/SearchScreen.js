import { View, Text, SafeAreaView, StyleSheet } from 'react-native'
import React from 'react'

const SearchScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>SearchScreen</Text>
    </SafeAreaView>
  )
}

export default SearchScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    }
})