const express = require('express');
const db = require('../../db/index.js');

const checkGoogle = (req, res) => {
  let task = req.query.task;
  task = JSON.parse(task);
  let checkQuery = `SELECT * FROM Tasks WHERE Google = '${task.Google}'`;
  db.query(checkQuery, (err, existence) => {
    if (err) {
      console.error(err)
    } else {
      res.send(existence);
    }
  })
}

module.exports = checkGoogle;