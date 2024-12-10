import React from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const pages = [
  {name: 'AddBusinessImagesPage', route: 'debug/addBusinessImagesPage'},
  {name: 'AddFavoritePage', route: 'debug/addFavoritePage'},
  {name: 'AddReviewImagesPage', route: 'debug/addReviewImagesPage'},
  {name: 'CancelAppointmentPage', route: 'debug/cancelAppointmentPage'},
  {name: 'ClientHomePage', route: 'debug/clientHomePage'},
  {name: 'ConfirmAppointmentPage', route: 'debug/confirmAppointmentPage'},
  {name: 'CreateAppointmentPage', route: 'debug/createAppointmentPage'},
  {name: 'CreateBusinessPage', route: 'debug/createBusinessPage'},
  {name: 'CreateReviewPage', route: 'debug/createReviewPage'},
  {name: 'ConfigureBusinessPage', route: 'debug/configureBusinessPage'},
  {name: 'DeleteBusinessImagePage', route: 'debug/deleteBusinessImagePage'},
  {name: 'DeleteFavoritePage', route: 'debug/deleteFavoritePage'},
  {name: 'DeleteReviewImagePage', route: 'debug/deleteReviewImagePage'},
  {name: 'DeleteReviewPage', route: 'debug/deleteReviewPage'},
  {name: 'DisownBusinessPage', route: 'debug/disownBusinessPage'},
  {name: 'EditBusinessPage', route: 'debug/editBusinessPage'},
  {name: 'EditReviewPage', route: 'debug/editReviewPage'},
  {name: 'EditServicePage', route: 'debug/editServicePage'},
  {name: 'ModifyBusinessHoursPage', route: 'debug/modifyBusinessHoursPage'},
  {name: 'ViewAllBusinessesPage', route: 'debug/viewAllBusinessesPage'},
  {
    name: 'ViewBusinessAppointmentsPage',
    route: 'debug/viewBusinessAppointmentsPage',
  },
  {name: 'ViewBusinessImagesPage', route: 'debug/viewBusinessImagesPage'},
  {name: 'ViewBusinessPage', route: 'debug/viewBusinessPage'},
  {name: 'ViewBusinessReviewsPage', route: 'debug/viewBusinessReviewsPage'},
  {name: 'ViewBusinessServicesPage', route: 'debug/viewBusinessServicesPage'},
  {name: 'ViewLoggedInUserProfile', route: 'debug/viewLoggedInUserProfile'},
  {name: 'ViewProfiles', route: 'debug/viewProfiles'},
  {name: 'ViewReviewImagesPage', route: 'debug/viewReviewImagesPage'},
  {name: 'ViewServicePage', route: 'debug/viewServicePage'},
  {name: 'ViewUserAppointmentsPage', route: 'debug/viewUserAppointmentsPage'},
  {name: 'ViewUserBusinessesPage', route: 'debug/viewUserBusinessesPage'},
  {name: 'ViewUserFavoritesPage', route: 'debug/viewUserFavoritesPage'},
  {name: 'ViewUserReviewsPage', route: 'debug/viewUserReviewsPage'},
];

export default function AdminDashboard() {
  const navigation = useNavigation();

  const renderItem = ({item}: {item: {name: string; route: string}}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate(item.route as never)}
    >
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={pages}
        keyExtractor={(item) => item.route}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 18,
  },
});
