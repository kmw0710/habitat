const express = require('express');
const db = require('../../db/index.js');


const syncCalendar = (req, res) => {
  console.log(req.body, 'REQ BODY')
  let scope = 'https://www.googleapis.com/auth/calendar.readonly';
  
  // axios.get('https://apps-apis.google.com/a/feeds/calendar/resource/')
  //   .then(res => {
  //     console.log(res.data, 'RES.DATA IN SERVER')
  //   })
}

module.exports = syncCalendar;
