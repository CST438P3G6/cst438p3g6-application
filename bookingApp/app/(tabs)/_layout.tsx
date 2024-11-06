import '~/global.css';
import React, {useEffect, useState} from 'react';
import {StatusBar} from 'expo-status-bar';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {supabase} from '@/utils/supabase';
import {
  Home as HomeIcon,
  Settings as SettingsIcon,
  Briefcase as BusinessIcon,
  Calendar as AppointmentsIcon,
  User as AccountIcon,
  FileSliders as ConfigureBusinessIcon,
  Edit as EditProfileIcon,
  PlusCircle as CreateBusinessIcon,
} from 'lucide-react-native';

import HomePage from './homePage';
import SettingsPage from './settingsPage';
import BusinessPage from './businessPage';
import AppointmentsPage from './appointmentsPage';
import AccountPage from './accountPage';
import ConfigureBusinessPage from './configureBusinessPage';
import ViewProfiles from './viewProfiles';
import ViewLoggedInUserProfile from '@/app/(tabs)/viewLoggedInUserProfile';
import EditProfileForm from '@/app/(tabs)/editProfile';
import CreateBusinessPage from '@/app/(tabs)/createBusinessPage';
import ViewUserBusinessesPage from '@/app/(tabs)/viewUserBusinessesPage';
import ViewAllBusinessesPage from '@/app/(tabs)/viewAllBusinessesPage';
import EditBusinessPage from '@/app/(tabs)/editBusinessPage';
import CreateServicePage from '@/app/(tabs)/createServicePage';
import ViewBusinessServicesPage from '@/app/(tabs)/viewBusinessServicesPage';
import ViewServicePage from '@/app/(tabs)/viewServicePage';
import EditServicePage from '@/app/(tabs)/editServicePage';
import AddFavoritePage from "@/app/(tabs)/addFavoritePage";
import CancelAppointmentPage from "@/app/(tabs)/cancelAppointmentPage";
import ConfirmAppointmentPage from "@/app/(tabs)/confirmAppointmentPage";
import CreateAppointmentPage from "@/app/(tabs)/createAppointmentPage";
import DeleteFavoritePage from "@/app/(tabs)/deleteFavoritePage";
import ModifyBusinessHoursPage from "@/app/(tabs)/modifyBusinessHoursPage";
import ViewAvailableAppointmentsPage from "@/app/(tabs)/viewAvailableAppointmentsPage";
import ViewBusinessAppointmentsPage from "@/app/(tabs)/viewBusinessAppointmentsPage";
import ViewBusinessPage from "@/app/(tabs)/viewBusinessPage";
import ViewUserAppointmentsPage from "@/app/(tabs)/viewUserAppointmentsPage";
import ViewUserFavoritesPage from "@/app/(tabs)/viewUserFavoritesPage";
import CreateReviewPage from "@/app/(tabs)/createReviewPage";
import ViewUserReviewsPage from "@/app/(tabs)/viewUserReviewsPage";
import ViewBusinessReviewsPage from "@/app/(tabs)/viewBusinessReviewsPage";
import EditReviewPage from "@/app/(tabs)/editReviewPage";
import DeleteReviewPage from "@/app/(tabs)/deleteReviewPage";


const Tabs = createBottomTabNavigator();

const clientTabs = [
  {name: 'Home', component: HomePage, icon: HomeIcon},
  {name: 'Appointments', component: AppointmentsPage, icon: AppointmentsIcon},
  {name: 'Account', component: AccountPage, icon: AccountIcon},
  {name: 'Settings', component: SettingsPage, icon: SettingsIcon},
    {name: 'DeleteReview', component: DeleteReviewPage, icon: AccountIcon},
    {name: 'EditReview', component: EditReviewPage, icon: AccountIcon},
    {name: 'CreateReview', component: CreateReviewPage, icon: AccountIcon},
    {name: 'ViewBusinessReviews', component: ViewBusinessReviewsPage, icon: AccountIcon},
  {name: 'ViewUserReviews', component: ViewUserReviewsPage, icon: AccountIcon},
  {name: 'editProfile', component: EditProfileForm, icon: EditProfileIcon},
  {
    name: 'ViewAllBusinesses',
    component: ViewAllBusinessesPage,
    icon: BusinessIcon,
  },
  {name: 'ViewService', component: ViewServicePage, icon: BusinessIcon},
  {name: 'ViewLoggedInUserProfile', component: ViewLoggedInUserProfile, icon: AccountIcon},
  {name: 'AddFavorite', component: AddFavoritePage, icon: AccountIcon},
  {name: 'CreateAppointment', component: CreateAppointmentPage, icon: AccountIcon},
  {name: 'CancelAppointment', component: CancelAppointmentPage, icon: AccountIcon},
  {name: 'ConfirmAppointment', component: ConfirmAppointmentPage, icon: AccountIcon},
  {name: 'DeleteFavorite', component: DeleteFavoritePage, icon: AccountIcon},
  {name: 'ModifyBusinessHours', component: ModifyBusinessHoursPage, icon: AccountIcon},
  {name: 'ViewAvailableAppointments', component: ViewAvailableAppointmentsPage, icon: AccountIcon},
    {name: 'ViewBusinessAppointments', component: ViewBusinessAppointmentsPage, icon: AccountIcon},
    {name: 'ViewBusinessPage', component: ViewBusinessPage, icon: AccountIcon},
    {name: 'ViewUserAppointments', component: ViewUserAppointmentsPage, icon: AccountIcon},
    {name: 'ViewUserFavorites', component: ViewUserFavoritesPage, icon: AccountIcon},




];

const providerTabs = [
  {name: 'Business', component: BusinessPage, icon: BusinessIcon},
  {
    name: 'ConfigureBusiness',
    component: ConfigureBusinessPage,
    icon: ConfigureBusinessIcon,
  },
  {
    name: 'CreateBusiness',
    component: CreateBusinessPage,
    icon: CreateBusinessIcon,
  },
  {
    name: 'ViewUserBusinesses',
    component: ViewUserBusinessesPage,
    icon: BusinessIcon,
  },
  {name: 'EditBusiness', component: EditBusinessPage, icon: BusinessIcon},
  {
    name: 'CreateService',
    component: CreateServicePage,
    icon: CreateBusinessIcon,
  },
  {
    name: 'ViewBusinessServices',
    component: ViewBusinessServicesPage,
    icon: BusinessIcon,
  },
  {name: 'EditService', component: EditServicePage, icon: BusinessIcon},
];

const adminTabs = [
  {name: 'Settings', component: SettingsPage, icon: SettingsIcon},
  {name: 'ViewProfiles', component: ViewProfiles, icon: AccountIcon},
];

export default function RootLayout() {
  const [userType, setUserType] = useState({
    isClient: true,
    isProvider: false,
    isAdmin: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserType = async () => {
      const {
        data: {user},
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('Error fetching user:', userError);
        // Handle the error or redirect to login
        setLoading(false);
        return;
      }

      const {data: profile, error: profileError} = await supabase
        .from('profiles')
        .select('isadmin, isprovider')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        console.error('Error fetching profile:', profileError);
        // Handle the error or set default userType
        setLoading(false);
        return;
      }

      setUserType({
        isClient: true,
        isProvider: profile.isprovider ?? false,
        isAdmin: profile.isadmin ?? false,
      });

      setLoading(false);
    };

    fetchUserType();
  }, []);

  // Move useMemo above the conditional return
  const availableTabs = React.useMemo(() => {
    let tabs = [...clientTabs];

    if (userType.isProvider) {
      tabs = [...tabs, ...providerTabs];
    }

    if (userType.isAdmin) {
      tabs = [...tabs, ...adminTabs];
    }

    return tabs;
  }, [userType]);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StatusBar style="auto" />
      <Tabs.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({color, size}) => {
            const tab = availableTabs.find((tab) => tab.name === route.name);
            if (tab) {
              const Icon = tab.icon;
              return <Icon color={color} size={size} />;
            }
            return null;
          },
          headerShown: false,
        })}
      >
        {availableTabs.map((tab) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            component={tab.component}
            options={{
              title: tab.name.replace(/([A-Z])/g, ' $1').trim(),
            }}
          />
        ))}
      </Tabs.Navigator>
    </GestureHandlerRootView>
  );
}
