import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { store, persistor } from './src/store';
import TransactionListScreen from './src/screens/TransactionListScreen';
import AddTransactionScreen from './src/screens/AddTransactionScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import LoadingScreen from './src/components/LoadingScreen';

const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <NavigationContainer>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={isDarkMode ? '#000' : '#fff'}
          />
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName: string;

                switch (route.name) {
                  case 'Transactions':
                    iconName = 'list';
                    break;
                  case 'Add':
                    iconName = 'add-circle';
                    break;
                  case 'Analytics':
                    iconName = 'analytics';
                    break;
                  case 'Settings':
                    iconName = 'settings';
                    break;
                  default:
                    iconName = 'help';
                }

                return <Icon name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#007AFF',
              tabBarInactiveTintColor: 'gray',
              headerStyle: {
                backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
              },
              headerTintColor: isDarkMode ? '#fff' : '#000',
              tabBarStyle: {
                backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
                borderTopColor: isDarkMode ? '#333' : '#e0e0e0',
              },
            })}
          >
            <Tab.Screen 
              name="Transactions" 
              component={TransactionListScreen}
              options={{ title: 'Transactions' }}
            />
            <Tab.Screen 
              name="Add" 
              component={AddTransactionScreen}
              options={{ title: 'Add Transaction' }}
            />
            <Tab.Screen 
              name="Analytics" 
              component={AnalyticsScreen}
              options={{ title: 'Analytics' }}
            />
            <Tab.Screen 
              name="Settings" 
              component={SettingsScreen}
              options={{ title: 'Settings' }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

export default App;
