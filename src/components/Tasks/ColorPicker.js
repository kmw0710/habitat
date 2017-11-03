import React, {Component} from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';

class ColorPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colors: ['#ff0000', '#ffd700', '#ff7373', '#40e0d0', '#0000ff', '#ffa500', '#6dc066'],
      color: '',
      // usedColors: [],
      render: false
    }
    this.setColor = this.setColor.bind(this);
  }

//'#ff0000', '#ffd700', '#ff7373', '#40e0d0', '#0000ff', '#ffa500', '#6dc066'


  componentWillReceiveProps() {
    this.props.usedColors.forEach(category => {
      let idx = this.state.colors.indexOf(category.Color);
      if(idx !== -1) {
        this.state.colors.splice(idx, 1);
      }
    })
    this.setState({render: true})
  }

  setColor(color) {
    this.setState({color});
    this.props.selectColor(color);
  }

  render() {
    return (
      <View >
        <ScrollView horizontal={true}>
          {this.state.colors.map((color, i) => (
            <TouchableOpacity key={i} onPress={() => this.setColor(color)} >
              <View style={{backgroundColor: color, margin: 10, width: 25, height: 25, borderRadius: 25}}></View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    )
  }
}


export default ColorPicker;
