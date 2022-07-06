import React, { Component } from 'react';
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
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
import { permission } from '../utils/permission';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import { getImage } from '../utils/imageHolder';
import moment from 'moment';

const styles = StyleSheet.create({
  container: {
    minHeight: 200,
    flex: 1,
  },
  map: {
    position: 'relative',
    minHeight: 200,
    width: '100%',
  },
});

const reference = database().ref('/users/');
class Events extends Component {
  constructor(props) {
    super(props);
    // console.log(props);
    this.state = {
      lat: 31.8,
      lng: 34.65,
      events: [],
      loading: false,
      selectEvent: null,
      category: this.props.route.params.category,
    };
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

    console.log('this.state.category', this.state.category);
    this.eventListener = database()
      .ref('/events/' + this.state.category + '/')
      .once('value', snapshot => {
        this.intVal = [];
        console.log('User events: ', snapshot.val());
        snapshot.forEach(child => {
          console.log('User child: ', child.key, child.val());
          Object.keys(child.val()).map(subChild => {
            let distance = Number(
              this.getDistanceFromLatLonInKm(
                this.state.lat,
                this.state.lng,
                child.val()[subChild].lat,
                child.val()[subChild].lng,
              ).toFixed(2),
            );
            if (
              child.val()[subChild].endTime > new Date().getTime() &&
              distance <= 10
            ) {
              this.intVal.push({
                ...child.val()[subChild],
                id: child.key,
                distance,
              });
            }
          });
        });
        this.intVal.sort((a, b) => {
          return a.distance - b.distance;
        });
        this.setState({ events: this.intVal });
      });
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
  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = this.toRad(lat2 - lat1);
    var dLon = this.toRad(lon2 - lon1);
    var lat1 = this.toRad(lat1);
    var lat2 = this.toRad(lat2);

    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }
  toRad(Value) {
    return (Value * Math.PI) / 180;
  }
  getLocationPermission() {}
  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1, backgroundColor: '#f0ead6' }}>
        <Image
          source={getImage('logo')}
          resizeMode="contain"
          style={{ width: '100%', height: 50 }}
        />
        {/* <Text>location</Text>
        <Text>
          lat {this.state.lat} lng {this.state.lng}
        </Text> */}
        <View>
          {this.state.events.length == 0 && (
            <View>
              <Text>לא נמצאו אירועים</Text>
            </View>
          )}
          {this.state.events && (
            <ScrollView style={{}}>
              <View style={{ flex: 1 }}>
                {this.state.events.map((item, i) => (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('BusinessScreen', {
                        itemId: item.id,
                        event: { ...item, category: this.state.category },
                      });
                    }}
                    key={i}
                    style={{
                      borderWidth: 1,
                      padding: 10,
                      margin: 10,
                    }}>
                    <View
                      style={{
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                      }}>
                      <Text>{moment(item.startTime).format('DD/MM/YYYY')}</Text>
                      <Text>{item.provider}</Text>
                    </View>
                    <View
                      style={{
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                      }}>
                      <Text style={{ color: '#000000' }}>{item.name}</Text>
                      <Text>{item.distance}km</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}
        </View>
        <View style={styles.container}>
          {this.state.loading && <ActivityIndicator />}
          {!this.state.loading && this.state.events.length > 0 && (
            <MapView
              provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              style={styles.map}
              region={{
                latitude: this.state.lat,
                longitude: this.state.lng,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}>
              {this.state.events.map((x, i) => (
                <Marker
                  key={i}
                  coordinate={{
                    latitude: x.lat,
                    longitude: x.lng,
                  }}
                  title={x.name}
                  description={x.description}
                />
              ))}
            </MapView>
          )}
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Events);
