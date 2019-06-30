'use strict'
const EventEmitter = require('events');
global.emitter = new EventEmitter();

class Updater{
    
    constructor(){
        this.soldiers = new Array();
    }

    getSoldiers(){
        return this.soldiers;
    }

    updateState(soldier, updateData){

        //add and update to dynamic current soldier list
        let found = false;
        let tenSec = 10*1000;
        for(var i = 0; i < this.soldiers.length; i++) {
            if (this.soldiers[i].meshID == soldier.meshID) { 
                found = true;
                switch(updateData){
                    case "gps":
                        this.soldiers[i].gps = soldier.gps
                        break;
                    case "emerg":
                        this.soldiers[i].emerg = soldier.emerg
                        break;
                    case "pulse":
                        this.soldiers[i].pulse = soldier.pulse
                        break;
                    case "acc":
                        this.soldiers[i].acc = soldier.acc
                        break;
                }
                //update message time
                this.soldiers[i].lastMessage = new Date();
                
                //recieved a message after disconnection, setting back to default
                if(this.soldiers[i].disconnect){
                    this.soldiers[i].disconnect = undefined;
                    emitter.emit('RECONNECTED', this.soldiers[i]);
                }
            }

            //if no messages recived for more than 60 seconds, emit to view
            if(new Date() - this.soldiers[i].lastMessage > tenSec && this.soldiers[i].disconnect == undefined){
                emitter.emit('DISCONNECTED', this.soldiers[i]);
                this.soldiers[i].disconnect = true;
            }
                    
        }
        if (!found)
            this.soldiers.push(soldier);
    }
}

module.exports = () => {
    var updater = new Updater();
    return updater;
}