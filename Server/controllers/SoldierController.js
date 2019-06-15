'use strict'
var Soldier  = require('../models/Soldier'),
    Promise  = require('promise');

class SoldierController{

    addSoldier(data){
        return new Promise((resolve, reject) => {
            let soldier = new Soldier({
                meshID: data.meshId,
                name: data.name,
                bloodType: data.bloodType,
                forceID: data.forceID,
                isCommander: false,
                role: data.role,
                emerg: false
            })
            
            soldier.save(
                (err) => {
                    if( err )
                        console.log(err);
                    else {
                        resolve(JSON.stringify(soldier)); 
                    }
                }
            )
        });
    }
    
    updateGPS(data) {
        return new Promise((resolve, reject) => {
            Soldier.findOneAndUpdate({ 'meshID': data.meshID }, {$set: { 'gps': data.gps }}, (err, result) =>{
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    updatePulse(data) {
        return new Promise((resolve, reject) => {
            Soldier.findOneAndUpdate({ 'meshID': data.meshID }, {$set: { 'pulse': data.pulse}}, (err, result) =>{
                if (err) reject(err);
                else resolve(result);
            })
        })
    }

    updateAcc(data) {
        return new Promise((resolve, reject) => {
            Soldier.findOneAndUpdate({ 'meshID': data.meshID }, {$set: { 'acc': data.acc}}, (err, result) =>{
                if (err) reject(err);
                else resolve(result);
            })
        })
    }

    getAllSoldiers() {
        return new Promise((resolve, reject) => {
            Soldier.find({}, '-messages', (err, result) => {
                if (err) reject(err);
                else resolve(result);
            })
        })
    }

    getSoldierByID(id) {
        return new Promise((resolve, reject) => {
            Soldier.find({'meshID': id}, (err, result) => {
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