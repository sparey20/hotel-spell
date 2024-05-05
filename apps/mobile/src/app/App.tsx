/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Reservations } from './Reservations';
import { Guests } from './Guests';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

export const App = () => {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: styles.bottomTabs,
            tabBarLabelStyle: styles.bottomTabLabel,
            tabBarLabelPosition: 'below-icon',
          }}
        >
          <Tab.Screen
            name="Reservations"
            options={{
              tabBarIcon: ({ color, size }) => (
                <Feather name="bell" size={20} color="white" />
              ),
            }}
            component={Reservations}
          />
          <Tab.Screen
            name="Guests"
            options={{
              tabBarIcon: ({ color, size }) => (
                <FontAwesome6 name="user" size={20} color="white" />
              ),
            }}
            component={Guests}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  bottomTabs: {
    backgroundColor: '#064e3b',
    paddingBottom: 25,
    height: 80,
  },
  bottomTabLabel: {
    color: 'white',
  },
});

export default App;
