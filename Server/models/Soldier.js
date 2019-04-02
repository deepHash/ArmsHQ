var mongoose = require('mongoose'),
    schema   = mongoose.Schema,

    SoldierSchema = new schema({
        meshID: {type: Number, required: true, unique: true},
        name: String,
        bloodType: String,
        gps: {
             lan: Number, 
             lat: Number
        },
        acc: {
             x: Number,
             y: Number,
             z: Number
        },
        pulse: Number,
        emerg: Boolean,
        messages: [{
            messageID: Number,
            data: {type: String,
                   value: schema.Types.Mixed}}]
    }, {collection: 'Soldier'});

    var Soldier = mongoose.model('Soldier', SoldierSchema);
    module.exports = Soldier;
