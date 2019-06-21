'use strict'

class Updater{

    updateState(){

        //add and update to dynamic current soldier list
        let found = false;
        let minute = 60 * 1000;
        for(var i = 0; i < soldiers.length; i++) {
            if (soldiers[i].meshID == soldier.meshID) { 
                found = true;
                switch(updateData){
                    case "gps":
                        soldiers[i].gps = soldier.gps
                        break;
                    case "emerg":
                        soldiers[i].emerg = soldier.emerg
                        break;
                    case "pulse":
                        soldiers[i].pulse = soldier.pulse
                        break;
                    case "acc":
                        soldiers[i].acc = soldier.acc
                        break;
                }
                //update message time
                soldiers[i].lastMessage = new Date();
            }
            //if no messages recived for more than 10 seconds, emit to view
            if(new Date() - soldiers[i].lastMessage > minute)
                universalEmitter.emit('DISCONNECTED', soldier[i]);
                    
        }
        if (!found)
            soldiers.push(soldier);
    }
}