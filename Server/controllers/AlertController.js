'use strict'
var Alert  = require('../models/Alert'),
    Promise  = require('promise'),
    dateFormat  = require('dateformat');

class AlertController{

    getAllAlerts() {
        return new Promise((resolve, reject) => {
            Alert.find({}, '-id', (err, result) => {
                if (err) reject(err);
                else resolve(result);
            })
        })
    }

    addNewAlert(soldier,alertType){

        return new Promise((resolve, reject) => {

            //setting type of emergency
            let alert = new Alert({
                meshID: soldier.meshID,
                MessageID: soldier.msgID,
                type: alertType,
                date:dateFormat(new Date(), "d/m/yy HH:MM:ss")
            })
            //save new emergency alert
            alert.save(
                (err) => {
                    if( err )
                        console.log(err);
                    else {
                        resolve(JSON.stringify(soldier)); 
                    }
                }
            )
        })
    }
}

module.exports = () => {
    var alert = new AlertController();
    return alert;
}