import React, { Component } from 'react';
import {
  Button,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
import { permission } from '../utils/permission';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const reference = database().ref('/users/');
class Home2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 0,
      lng: 0,
      isManager: false,
    };
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    database()
      .ref('/managers')
      .once('value')
      .then(snapshot => {
        console.log('User data: ', snapshot.val());
        if (
          this.props.user &&
          snapshot.val() &&
          snapshot.val().includes(this.props.user.email)
        ) {
          this.setState({ isManager: true });
        }
      });
    this.eventListener = database()
      .ref('/events')
      .on('value', snapshot => {
        this.intVal = [];
        console.log('User events: ', snapshot.val());
        snapshot.forEach(child => {
          this.intVal.push(child.val());
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
    database().ref('/events').off('value', this.eventListener);
  }
  handleBackButton() {
    return true;
  }
  getCurrentLocation() {
    const { user } = this.props;
    Geolocation.getCurrentPosition(
      position => {
        console.log(position);
        const { latitude: lat, longitude: lng } = position.coords;
        database()
          .ref('/users/' + user.uid)
          .set({ lat, lng });
        this.setState({
          lat,
          lng,
        });
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  }
  getLocationPermission() {}
  render() {
    const { navigation } = this.props;
    return (
      <View>
        <Button
          title="back to Home"
          onPress={() => {
            auth()
              .signOut()
              .then(() => console.log('User signed out!'));
            navigation.goBack();
          }}
        />
        <Text>location</Text>
        <Text>
          lat {this.state.lat} lng {this.state.lng}
        </Text>
        <Text> </Text>
        {/* {this.props.user && (
            <Text>
            email {this.props.user.email}
            user {JSON.stringify(this.props.user)}
          </Text>
        )} */}
        <Text> </Text>
        <Button
          title="go to event map"
          onPress={() => {
            navigation.navigate('Events');
          }}
        />
        {this.state.isManager && (
          <View>
            <Button
              title="Add event"
              onPress={() => {
                navigation.navigate('AddEvent');
              }}
            />
          </View>
        )}
        {this.state.events && (
          <ScrollView>
            <View>
              {this.state.events.map((x, i) => (
                <View key={i}>
                  <Text>{x.name}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Home2);
