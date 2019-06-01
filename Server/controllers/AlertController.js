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

    addNewAlert(soldier){
        return new Promise((resolve, reject) => {
            let alertType;

            //setting type of emergency
            if(soldier.emerg === true)
                alertType = "Emergency";
            else
                alertType = "Other";

            let alert = new Alert({
                meshID: soldier.meshID,
                MessageID: soldier.msgID,
                type: alertType
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