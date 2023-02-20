import { View, Text, SafeAreaView, StyleSheet } from 'react-native'
import React from 'react'

const HighlightsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>HighlightsScreen</Text>
    </SafeAreaView>
  )
}

export default HighlightsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    }
})