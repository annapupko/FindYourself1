import React, { Component, useState } from 'react';
import {
  Button,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
import { permission } from '../utils/permission';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import { getImage } from '../utils/imageHolder';
import { Rating, AirbnbRating } from 'react-native-ratings';

const styles = StyleSheet.create({
  container: {
    minHeight: 200,
    flex: 1,
    borderWidth: 1,
  },
  map: {
    position: 'relative',
    minHeight: 200,
    width: '100%',
  },
});

const reference = database().ref('/users/');
class BusinessScreen extends Component {
  constructor(props) {
    super(props);
    // console.log(props);
    this.state = {
      lat: 31.8,
      lng: 34.65,
      events: [],
      loading: false,
      selectEvent: this.props.route.params.event,
      itemId: this.props.route.params.itemId,
      businessId: this.props.route.params.itemId,
      feedbacks: [],
      menu: [],
      name: '',
      openningHours: '1',
    };
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

    this.refreshBusninessData();
    permission.check().then(res => {
      if (res) {
        this.getCurrentLocation();
      } else {
        permission.getCoasreLocation(() => {
          this.getCurrentLocation();
        });
      }
    });
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    // database().ref('/events').off('value', this.eventListener);
  }
  refreshBusninessData() {
    this.eventListener = database()
      .ref('/Business/' + this.state.businessId + '/')
      .once('value', snapshot => {
        this.intVal = [];
        console.log('User events: ', snapshot.val());
        snapshot.forEach(child => {
          this.setState({ [child.key]: child.val() });
          // console.log('User child: ', child.key, child.val());
        });
      });
  }
  handleBackButton() {
    return true;
  }
  getCurrentLocation() {
    const { user, navigation } = this.props;
    // this.setState({ loading: true });
    Geolocation.getCurrentPosition(
      position => {
        // console.log(position);
        const { latitude: lat, longitude: lng } = position.coords;
        database()
          .ref('/users/' + user.uid)
          .set({ lat, lng });
        this.setState({
          lat,
          lng,
          loading: false,
        });
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
        this.setState({ loading: false });

        // Alert.alert('location not found', '', [
        //   { text: 'ok', onPress: () => navigation.goBack() },
        // ]);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  }

  render() {
    const { navigation } = this.props;
    const { selectEvent, name, openningHours, menu, feedbacks } = this.state;
    return (
      <ScrollView style={{ backgroundColor: '#f0ead6' }}>
        <Image
          source={getImage('logo')}
          resizeMode="contain"
          style={{ width: '100%', height: 50 }}
        />
        <View>
          <Text
            style={{
              textDecorationLine: 'underline',
              color: '#000000',
              alignSelf: 'center',
            }}>
            {name}
          </Text>
          <Text>שעות פתיחה {openningHours}</Text>
          <Text style={{ fontWeight: '700' }}>פרטי האירוע</Text>
          <Text>קטגוריה {this.state.selectEvent.category}</Text>
          <Text>שעות הפעילות {this.state.selectEvent.time}</Text>
          <Text></Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('MenuScreen', { menu });
            }}>
            <Text style={{ color: '#1111ff' }}>הקש לקבלת התפריט</Text>
          </TouchableOpacity>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('FeedbackScreen', {
                  uid: this.props.user.uid,
                  businessId: this.state.businessId,
                  feedbacks,
                  onUpdate: () => {
                    this.refreshBusninessData();
                  },
                });
              }}>
              <Text style={{ color: '#1111ff' }}>הוספת תגובה</Text>
            </TouchableOpacity>
            <Text>תגובות ודירוג</Text>
          </View>
          {feedbacks && (
            <ScrollView>
              <View style={{ flex: 1 }}>
                {feedbacks.map((item, i) => (
                  <View
                    key={i}
                    style={{
                      borderRadius: 7,
                      backgroundColor: '#f5f5f5',
                      borderWidth: 1,
                      padding: 10,
                      margin: 10,
                    }}>
                    <View
                      key={i}
                      style={{
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                      }}>
                      <Rating
                        readonly={true}
                        type="star"
                        ratingCount={5}
                        imageSize={20}
                        startingValue={Number(item.rate)}
                        tintColor="#f5f5f5"
                      />
                      {/* <Stars
                        display={3.67}
                        spacing={8}
                        count={5}
                        starSize={40}
                        fullStar={getImage('starFilled')}
                        emptyStar={getImage('starEmpty')}
                      /> */}

                      <Text>{item.comment}</Text>
                    </View>
                    <Text style={{ color: '#000000' }}>{item.name}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
        </View>
        <View style={styles.container}>
          {this.state.loading && <ActivityIndicator />}
          {!this.state.loading && (
            <MapView
              provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              style={styles.map}
              region={{
                latitude: this.state.lat,
                longitude: this.state.lng,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}>
              <Marker
                coordinate={{
                  latitude: selectEvent.lat,
                  longitude: selectEvent.lng,
                }}
                title={selectEvent.name}
                description={selectEvent.description}
              />
            </MapView>
          )}
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
});
const mapDispatchToProps = {};

export const MenuScreen = ({ navigation, route }) => {
  const { menu } = route.params;
  return (
    <View style={{ flex: 1, backgroundColor: '#f0ead6' }}>
      {menu && (
        <ScrollView style={{}}>
          <View style={{ flex: 1 }}>
            {menu.map((item, i) => (
              <View
                key={i}
                style={{
                  borderWidth: 1,
                  padding: 10,
                  margin: 10,
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}>
                <Text style={{ color: '#000000' }}>{item.name}</Text>
                <Text>{item.price}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export const FeedbackScreen = ({ navigation, route }) => {
  const { uid, businessId, feedbacks, onUpdate } = route.params;
  const [name, setName] = useState('');
  const [stars, setStars] = useState('');
  const [comment, setComment] = useState('');
  return (
    <View>
      <View>
        <View
          style={{
            justifyContent: 'flex-start',
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}>
          <Text>שם</Text>

          <TextInput
            value={name}
            onChangeText={text => setName(text)}
            style={{
              flex: 1,
              borderBottomWidth: 1,
              padding: 0,
              maxWidth: 200,
            }}
          />
        </View>
        <View
          style={{
            marginVertical: 20,
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Rating
            RTL={true}
            onSwipeRating={stars => {
              setStars(stars);
            }}
            type="star"
            ratingCount={5}
            imageSize={20}
            startingValue={3}
            ratingColor="#ff4"
            ratingBackgroundColor="#f5f5f5"
          />
        </View>
        <View
          style={{
            justifyContent: 'flex-start',
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}>
          <Text>תגובה</Text>

          <TextInput
            value={comment}
            onChangeText={text => setComment(text)}
            style={{
              flex: 1,
              borderBottomWidth: 1,
              padding: 0,
              maxWidth: 200,
            }}
          />
        </View>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderRadius: 20,
            color: '#fff',
            alignSelf: 'flex-start',
            backgroundColor: '#44f',
            paddingHorizontal: 20,
            paddingVertical: 5,
            marginTop: 15,
          }}
          onPress={() => {
            database()
              .ref('/Business/' + businessId + '/feedbacks/' + feedbacks.length)
              .set({ name, id: uid, rate: stars, comment }, () => {
                onUpdate();
                navigation.goBack();
              });
          }}>
          <Text style={{ color: '#fff', textAlign: 'left' }}>הוספה</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(BusinessScreen);
