import { PermissionsAndroid, Platform } from 'react-native';
export const permission = {
  async getCoasreLocation(callback) {
    if (Platform.OS == 'ios') {
      callback && callback();
      return true;
    }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: 'App',
          message: 'We need the location for connecting to bluetooth devices.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // permission granted
        // do code get location here.
        // navigator.geolocation.getCurrentPosition(pos => {
        //   console.log(pos.coords.longitude, pos.coords.latitude);
        // });
        callback && callback();
      } else {
        // permission denied
        console.log('GPS permission denied');
      }
    } catch (err) {
      console.warn('Get CoarseLocation', err);
    }
  },
  async getLocation() {
    if (Platform.OS == 'ios') {
      return true;
    }
    try {
      //console.log("dfgdfg");
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'App',
          message: 'We need the location for connecting to bluetooth devices.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // permission granted
        // do code get location here.
        // navigator.geolocation.getCurrentPosition(pos => {
        //   console.log(pos.coords.longitude, pos.coords.latitude);
        // });
      } else {
        // permission denied
        console.log('GPS permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  },

  async check() {
    return new Promise(async (res, rej) => {
      if (Platform.OS == 'ios') {
        res(true);
      } else {
        let check =
          (await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          )) &&
          (await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ));

        console.log('permission', check);
        res(check);
      }
    });
  },
};
