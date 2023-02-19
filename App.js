import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from './old_screens/RegisterScreen';
import LoginScreen from './old_screens/LoginScreen';
import WelcomeScreen from './old_screens/WelcomeScreen';
import DateInputScreen from './old_screens/DateInputScreen';
import PhoneNumberScreen from './old_screens/PhoneNumberScreen';
import VerificationScreen from './old_screens/VerificationScreen';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import ProfileScreen from './old_screens/ProfileScreen';
import UsernameScreen from './screens/UsernameScreen';
import NewScreen from './screens/NewScreen';
import ProfileCardScreen from './screens/ProfileCardScreen';
import NameScreen from './screens/NameScreen';
import DateScreen from './screens/DateScreen';
import PhoneScreen from './screens/PhoneScreen';
import OtpScreen from './screens/OtpScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const firebaseConfig = {
  apiKey: "AIzaSyC0dquOYSr3_F0hhpIZMct_Vhpxq0-8Ly0",
  authDomain: "fir-auth-13f1b.firebaseapp.com",
  projectId: "fir-auth-13f1b",
  storageBucket: "fir-auth-13f1b.appspot.com",
  messagingSenderId: "494528711848",
  appId: "1:494528711848:web:b6ffdcc3b7e7d4caa4069d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const defaultHeaderOptions = {
  headerTitle: () => (
    <Image
      source={require('/Users/gracjanchmielnicki/newApp/assets/end-logo.png')}
      style={{ width: 80, height: 30, resizeMode: 'contain' }}
    />
  ),
  headerTransparent: true,
  headerTitleStyle: { color: 'white' },
  gestureEnabled: false,
  headerBackVisible: false,
};


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={defaultHeaderOptions}>
        <Stack.Screen name="NameScreen" component={NameScreen} />
        <Stack.Screen name="UsernameScreen" component={UsernameScreen} />
        <Stack.Screen name="DateScreen" component={DateScreen} />
        <Stack.Screen name="PhoneScreen" component={PhoneScreen} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} />
        <Stack.Screen options={{ headerShown: false }} name="NewScreen" component={NewScreen} />
        <Stack.Screen options={{
          headerTitle: 'Gracjan',
          headerTransparent: true,
          headerTitleStyle: { color: 'white' },
          headerLeft: () => (
            <Button
              onPress={() => alert('This is a button!')}
              title="Back"
              color="#fff"
            />
          ),
          headerRight: () => (
            <Button
              onPress={() => alert('This is a button!')}
              title="Info"
              color="#fff"
            />
          )
        }}
          name="ProfileCardScreen"
          component={ProfileCardScreen} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}


