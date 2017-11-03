const express = require('express');
const db = require('../../db/index.js');

const getTimer = (req, res) => {
  let User_ID = req.query.User_ID;
  let selectTasks = `SELECT * FROM TimerEcosystem WHERE User_ID = '${User_ID}'`;

  db.query(selectTasks, null, (err, results) => {
    if (err) {
      res.status(404).send(`We encountered an error looking up your tasks: ${err}`);
    } else {
      if (results.length === 0) {
        db.query(`INSERT INTO TimerEcosystem (User_ID) VALUES (${User_ID})`, null, (err, user) => {
          if (err) {
            res.status(404).send(`We encountered an error looking up your tasks: ${err}`);
          } else {
            db.query(selectTasks, null, (err, user) => {
              if (err) {
                res.status(404).send(`We encountered an error looking up your tasks: ${err}`);
              } else {
                res.status(201).send(user)
              }
            })
          }
        })
      } else {
        res.status(201).send(results);
      }
    }
  })
}

module.exports = getTimer;
