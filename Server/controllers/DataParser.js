'use strict'
const EventEmitter = require('events'),      
      Updater      = require('./Updater'),
      staticData   = Updater(),
      Soldier      = require('../models/Soldier');

//global shared event emitter
global.emitter = new EventEmitter();

class DataParser {
 
    pipe(data) {
        let soldier = new Soldier;
        let updateData; //what data was updated, i.e: gps, acc

        if(data.includes("<NEW_MSG>")){ // new message received
            data.split(',').forEach((row)=>{
                if(row.includes("<MSG_ID>"))
                    soldier.msgID = parseInt(row.substring(9));
                if(row.includes("<SRC>")){
                    soldier.meshID = parseInt(row.substring(6));
                }
                if(row.includes("<DATA>")){
                    if(row.includes("G:")){
                        updateData = "gps";
                        soldier.gps = {
                            lan: parseFloat(row.split(':')[1]),
                            lat: parseFloat(row.split(':')[2])
                        }
                        if(soldier.gps.lan != 0 && soldier.gps.lan != 0)
                            emitter.emit('GPS', soldier);
                    }
                    if(row.includes("E:True")){
                        updateData = "emerg";
                        soldier.emerg = true
                        staticData.getSoldiers().forEach(_soldier => {
                            if (soldier.meshID == _soldier.meshID){
                                if(_soldier.emerg == false)
                                    //emit only if its false - emitting once
                                    emitter.emit('Emergency', soldier);
                                _soldier.emerg = true;
                            }
                        });
                    }
                    if(row.includes("P:")){
                        updateData = "pulse"
                        soldier.pulse = (row.split(':')[1])
                        emitter.emit('PULSE', soldier);
                    }
                    if(row.includes("A:")){
                        updateData = "acc"
                        soldier.acc = {
                            x: parseFloat(row.split(':')[1]),
                            y: parseFloat(row.split(':')[2]),
                            z: parseFloat(row.split(':')[3])   
                        }
                        emitter.emit('ACC', soldier);
                    }

                    staticData.updateState(soldier,updateData);
                }
            });
        }
    }
}

module.exports = () => {
    var parser = new DataParser();
    return parser;
}