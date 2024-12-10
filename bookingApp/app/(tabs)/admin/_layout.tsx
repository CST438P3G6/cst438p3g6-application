import {Stack} from 'expo-router';
import {useEffect} from 'react';
import {useRouter} from 'expo-router';
import {useUser} from '@/context/UserContext';

export default function AdminLayout() {
  const {profile} = useUser();
  const router = useRouter();

  useEffect(() => {
    if (profile && !profile.isadmin) {
      router.replace('/(tabs)/home');
    }
  }, [profile]);

  return (
    <Stack
      screenOptions={{
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Admin Dashboard',
        }}
      />
      <Stack.Screen name="debug/addBusinessImagesPage" />
      <Stack.Screen name="debug/addFavoritePage" />
      <Stack.Screen name="debug/addReviewImagesPage" />
      <Stack.Screen name="debug/cancelAppointmentPage" />
      <Stack.Screen name="debug/clientHomePage" />
      <Stack.Screen name="debug/confirmAppointmentPage" />
      <Stack.Screen name="debug/createAppointmentPage" />
      <Stack.Screen name="debug/createBusinessPage" />
      <Stack.Screen name="debug/createReviewPage" />
      <Stack.Screen name="debug/configureBusinessPage" />
      <Stack.Screen name="debug/deleteBusinessImagePage" />
      <Stack.Screen name="debug/deleteFavoritePage" />
      <Stack.Screen name="debug/deleteReviewImagePage" />
      <Stack.Screen name="debug/deleteReviewPage" />
      <Stack.Screen name="debug/disownBusinessPage" />
      <Stack.Screen name="debug/editBusinessPage" />
      <Stack.Screen name="debug/editReviewPage" />
      <Stack.Screen name="debug/editServicePage" />
      <Stack.Screen name="debug/modifyBusinessHoursPage" />
      <Stack.Screen name="debug/viewAllBusinessesPage" />
      <Stack.Screen name="debug/viewBusinessAppointmentsPage" />
      <Stack.Screen name="debug/viewBusinessImagesPage" />
      <Stack.Screen name="debug/viewBusinessPage" />
      <Stack.Screen name="debug/viewBusinessReviewsPage" />
      <Stack.Screen name="debug/viewBusinessServicesPage" />
      <Stack.Screen name="debug/viewLoggedInUserProfile" />
      <Stack.Screen name="debug/viewProfiles" />
      <Stack.Screen name="debug/viewReviewImagesPage" />
      <Stack.Screen name="debug/viewServicePage" />
      <Stack.Screen name="debug/viewUserAppointmentsPage" />
      <Stack.Screen name="debug/viewUserBusinessesPage" />
      <Stack.Screen name="debug/viewUserFavoritesPage" />
      <Stack.Screen name="debug/viewUserReviewsPage" />
    </Stack>
  );
}
