import '~/global.css';

import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home as HomeIcon, Settings as SettingsIcon, Briefcase as BusinessIcon, Calendar as AppointmentsIcon, User as AccountIcon, FileSliders as ConfigureBusinessIcon } from 'lucide-react-native';
import HomePage from './homePage';
import SettingsPage from './settingsPage';
import BusinessPage from './businessPage';
import AppointmentsPage from './appointmentsPage';
import AccountPage from './accountPage';
import ConfigureBusinessPage from './configureBusinessPage';

const Tabs = createBottomTabNavigator();

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Tabs.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              switch (route.name) {
                case 'Home':
                  return <HomeIcon color={color} size={size} />;
                case 'Settings':
                  return <SettingsIcon color={color} size={size} />;
                case 'Business':
                  return <BusinessIcon color={color} size={size} />;
                case 'Appointments':
                  return <AppointmentsIcon color={color} size={size} />;
                case 'Account':
                  return <AccountIcon color={color} size={size} />;
                case 'ConfigureBusiness':
                  return <ConfigureBusinessIcon color={color} size={size} />;
                default:
                  return null;
              }
            },
            headerShown: false, 
          })}
        >
          <Tabs.Screen name="Home" component={HomePage} options={{ title: 'Home' }} />
          <Tabs.Screen name="Settings" component={SettingsPage} options={{ title: 'Settings' }} />
          <Tabs.Screen name="Business" component={BusinessPage} options={{ title: 'Business' }} />
          <Tabs.Screen name="Appointments" component={AppointmentsPage} options={{ title: 'Appointments' }} />
          <Tabs.Screen name="Account" component={AccountPage} options={{ title: 'Account' }} />
          <Tabs.Screen name="ConfigureBusiness" component={ConfigureBusinessPage} options={{ title: 'Configure Business' }} />
        </Tabs.Navigator>
      </GestureHandlerRootView>
    </>
  );
}
