'use strict'
var mongoose = require('mongoose'),
    Soldier  = require('../models/Soldier'),
    Promise  = require('promise');

class SoldierController{

    addSoldier(data){
        return new Promise((resolve, reject) => {
            let soldier = new Soldier({

            })
        });
    }
    
    updateGPS(data) {
        return new Promise((resolve, reject) => {
            Soldier.findOneAndUpdate({ 'meshID': data.meshID }, {$set: { 'gps': data.data.gps }}, (err, result) =>{
                //console.log(result);
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    getAll() {
        return new Promise((resolve, reject) => {
            Soldier.find({}, '-messages', (err, result) => {
                if (err) reject(err);
                else resolve(result);
            })
        })
    }

}

module.exports = () => {
    var soldier = new SoldierController();
    return soldier;
}