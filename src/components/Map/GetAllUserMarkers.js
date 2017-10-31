import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';

export default GetAllUserMarkers = async () => {

  axios.get('http://10.16.1.233:3000/markers')
    .then(markers => markers)
    .catch(err => err)
}
