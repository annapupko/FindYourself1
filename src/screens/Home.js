import React, { Component } from 'react';
import { Button, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { countDown, countUp } from '../actions';

class Home extends Component {
  render() {
    const { navigation } = this.props;
    return (
      <View>
        <Button
          title="Go to Home 2"
          onPress={() => navigation.navigate('Home2', { id: '2' })}
        />

        <ShowCounter
          number="1"
          counter={this.props.counter}
          counterUp={this.props.countUp}
          counterDown={this.props.countDown}
        />
      </View>
    );
  }
}
const ShowCounter = ({ counter, counterUp, counterDown, number }) => {
  return (
    <View>
      <Text>
        Hello from Counter{number} {counter}
      </Text>

      <TouchableOpacity
        style={[
          { margin: 10, borderWidth: 1, borderRadius: 10, padding: 10 },
          { backgroundColor: '#fff' },
        ]}
        onPress={() => counterUp()}>
        <Text>Count Up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          { margin: 10, borderWidth: 1, borderRadius: 10, padding: 10 },
          { backgroundColor: '#fff' },
        ]}
        onPress={() => counterDown()}>
        <Text>Count Down</Text>
      </TouchableOpacity>
    </View>
  );
};

const mapStateToProps = state => ({
  counter: state.counters.count1,
});
const mapDispatchToProps = {
  countUp,
  countDown,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
