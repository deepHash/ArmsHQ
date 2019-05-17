'use strict'
var Alert  = require('../models/Alert'),
    Promise  = require('promise');

class AlertController{

    getAllAlerts() {
        return new Promise((resolve, reject) => {
            Alert.find({}, '-id', (err, result) => {
                if (err) reject(err);
                else resolve(result);
            })
        })
    }
}

module.exports = () => {
    var alert = new AlertController();
    return alert;
}