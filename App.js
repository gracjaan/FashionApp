import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import UsernameScreen from './screens/UsernameScreen';
import NewScreen from './screens/NewScreen';
import ProfileCardScreen from './screens/ProfileCardScreen';
import NameScreen from './screens/NameScreen';
import DateScreen from './screens/DateScreen';
import PhoneScreen from './screens/PhoneScreen';
import OtpScreen from './screens/OtpScreen';
import FeedScreen from './screens/FeedScreen';
import SearchScreen from './screens/SearchScreen';
import AddPostScreen from './screens/AddPostScreen';
import ArticlesScreen from './screens/ArticlesScreen';
import CommentsScreen from './screens/CommentsScreen';
import UserScreen from './screens/UserScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import FollowersScreen from './screens/FollowersScreen';
import FollowingScreen from './screens/FollowingScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Provider } from 'react-redux';
import store from './redux/store'

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
const db = getFirestore(app);
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
  headerShadowVisible: false

};

function Home() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { display: "flex", backgroundColor: 'black', borderTopColor: 'transparent' },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'FeedScreen') {
            iconName = 'home';
          } else if (route.name === 'ProfileCardScreen') {
            iconName = 'person';
          } else if (route.name === 'SearchScreen') {
            iconName = 'search';
          } else if (route.name === 'AddPostScreen') {
            iconName = 'md-add-circle';
          } else if (route.name === 'ArticlesScreen') {
            iconName = 'md-reorder-four';
          }

          // return the icon component with the appropriate name and style
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        ...defaultHeaderOptions, // add the default header options
        headerTransparent: false,
        headerStyle: {
          backgroundColor: 'black',
        },
        headerRight: () => {
          if (route.name === 'AddPostScreen') {
            return (
              <TouchableOpacity onPress={() => console.log('heyy')}>
                <Text style={{ color: "#434343", marginRight: 10, fontFamily: 'Helvetica', fontSize: 20, fontWeight: 'bold' }}>Reset</Text>
              </TouchableOpacity>
            );
          } else {
            return null;
          }
        }
      })}
    >
      <Tab.Screen name='FeedScreen' component={FeedScreen} />
      <Tab.Screen name='SearchScreen' component={SearchScreen} />
      <Tab.Screen name='AddPostScreen' component={AddPostScreen} />
      <Tab.Screen name='ArticlesScreen' component={ArticlesScreen} />
      <Tab.Screen name='ProfileCardScreen' component={ProfileCardScreen} />
    </Tab.Navigator>
  );
}


export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={defaultHeaderOptions}>
          <Stack.Screen name="NameScreen" component={NameScreen} />
          <Stack.Screen name="UsernameScreen" component={UsernameScreen} />
          <Stack.Screen name="DateScreen" component={DateScreen} />
          <Stack.Screen name="PhoneScreen" component={PhoneScreen} />
          <Stack.Screen name="OtpScreen" component={OtpScreen} />
          <Stack.Screen options={{ headerShown: false }} name="Home" component={Home} />
          <Stack.Screen name="CommentsScreen" component={CommentsScreen} options={{gestureEnabled: true}}/>
          <Stack.Screen name="UserScreen" component={UserScreen} options={{gestureEnabled: true}}/>
          <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} options={{gestureEnabled: true}} />
          <Stack.Screen name="FollowersScreen" component={FollowersScreen} options={{gestureEnabled: true}} />
          <Stack.Screen name="FollowingScreen" component={FollowingScreen} options={{gestureEnabled: true}} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>

  );
}


