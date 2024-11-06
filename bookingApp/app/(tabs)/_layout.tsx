import '~/global.css';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home as HomeIcon, Settings as SettingsIcon, Briefcase as BusinessIcon, Calendar as AppointmentsIcon, User as AccountIcon, FileSliders as ConfigureBusinessIcon, Edit as EditProfileIcon, PlusCircle as CreateBusinessIcon } from 'lucide-react-native';

import HomePage from './homePage';
import SettingsPage from './settingsPage';
import BusinessPage from './businessPage';
import AppointmentsPage from './appointmentsPage';
import AccountPage from './accountPage';
import ConfigureBusinessPage from './configureBusinessPage';
import ViewProfiles from './viewProfiles';
import ViewLoggedInUserProfile from "@/app/(tabs)/viewLoggedInUserProfile";
import EditProfileForm from "@/app/(tabs)/editProfile";
import CreateBusinessPage from "@/app/(tabs)/createBusinessPage";
import ViewUserBusinessesPage from "@/app/(tabs)/viewUserBusinessesPage";
import ViewAllBusinessesPage from "@/app/(tabs)/viewAllBusinessesPage";
import EditBusinessPage from "@/app/(tabs)/editBusinessPage";
import CreateServicePage from "@/app/(tabs)/createServicePage";
import ViewBusinessServicesPage from "@/app/(tabs)/viewBusinessServicesPage";
import ViewServicePage from "@/app/(tabs)/viewServicePage";
import EditServicePage from "@/app/(tabs)/editServicePage";
import ModifyBusinessHoursPage from "@/app/(tabs)/modifyBusinessHoursPage";
import ViewAvailableAppointmentsPage from "@/app/(tabs)/viewAvailableAppointmentsPage";
import AddFavoritePage from "@/app/(tabs)/addFavoritePage";
import ViewUserFavoritesPage from "@/app/(tabs)/viewUserFavoritesPage";
import DeleteFavoritePage from "@/app/(tabs)/deleteFavoritePage";
import ViewBusinessPage from "@/app/(tabs)/viewBusinessPage";


const Tabs = createBottomTabNavigator();

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar style="auto" />
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
                            case 'ViewProfiles':
                                return <AccountIcon color={color} size={size} />;
                            case 'ViewLoggedInUserProfile':
                                return <AccountIcon color={color} size={size} />;
                            case 'EditProfile':
                                return <EditProfileIcon color={color} size={size} />;
                            case 'CreateBusiness':
                                return <CreateBusinessIcon color={color} size={size} />;
                            case 'ViewBusiness':
                                return <BusinessIcon color={color} size={size} />;
                            case 'ViewUserBusinesses':
                                return <BusinessIcon color={color} size={size} />;
                            case 'ViewAllBusinesses':
                                return <BusinessIcon color={color} size={size} />;
                            case 'EditBusiness':
                                return <BusinessIcon color={color} size={size} />;
                            case 'ViewBusinessServices':
                                return <BusinessIcon color={color} size={size} />;
                            case 'CreateService':
                                return <CreateBusinessIcon color={color} size={size} />;
                            case 'ViewService':
                                return <BusinessIcon color={color} size={size} />;
                            case 'EditService':
                                return <BusinessIcon color={color} size={size} />;
                            case 'ModifyBusinessHours':
                                return <BusinessIcon color={color} size={size} />;
                            case 'ViewAvailableAppointments':
                                return <AppointmentsIcon color={color} size={size} />;
                            case 'AddFavorite':
                                return <AccountIcon color={color} size={size} />;
                            case 'ViewUserFavorites':
                                return <AccountIcon color={color} size={size} />;
                            case 'DeleteFavorite':
                                return <AccountIcon color={color} size={size} />;

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
                <Tabs.Screen name="ViewProfiles" component={ViewProfiles} options={{ title: 'View Profiles' }} />
                <Tabs.Screen name="ViewLoggedInUserProfile" component={ViewLoggedInUserProfile} options={{ title: 'View Logged In User Profile' }} />
                <Tabs.Screen name="EditProfile" component={EditProfileForm} options={{ title: 'Edit Profile' }} />
                <Tabs.Screen name="CreateBusiness" component={CreateBusinessPage} options={{ title: 'Create Business' }} />
                <Tabs.Screen name="ViewBusiness" component={ViewBusinessPage} options={{ title: 'View Business' }} />
                <Tabs.Screen name="ViewUserBusinesses" component={ViewUserBusinessesPage} options={{ title: 'View User Businesses' }} />
                <Tabs.Screen name="ViewAllBusinesses" component={ViewAllBusinessesPage} options={{ title: 'View All Businesses' }} />
                <Tabs.Screen name="EditBusiness" component={EditBusinessPage} options={{ title: 'Edit Business' }} />
                <Tabs.Screen name="CreateService" component={CreateServicePage} options={{ title: 'Create Service' }} />
                <Tabs.Screen name="ViewBusinessServices" component={ViewBusinessServicesPage} options={{ title: 'View Business Services' }} />
                <Tabs.Screen name="ViewService" component={ViewServicePage} options={{ title: 'View Service' }} />
                <Tabs.Screen name="EditService" component={EditServicePage} options={{ title: 'Edit Service' }} />
                <Tabs.Screen name="ModifyBusinessHours" component={ModifyBusinessHoursPage} options={{ title: 'Modify Business Hours' }} />
                <Tabs.Screen name="ViewAvailableAppointments" component={ViewAvailableAppointmentsPage} options={{ title: 'View Available Appointments' }} />
                <Tabs.Screen name="AddFavorite" component={AddFavoritePage} options={{ title: 'Add Favorite' }} />
                <Tabs.Screen name="ViewUserFavorites" component={ViewUserFavoritesPage} options={{ title: 'View User Favorites' }} />
                <Tabs.Screen name="DeleteFavorite" component={DeleteFavoritePage} options={{ title: 'Delete Favorite' }} />

            </Tabs.Navigator>
        </GestureHandlerRootView>
    );
}