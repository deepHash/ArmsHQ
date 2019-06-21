var mongoose = require('mongoose'),
    schema   = mongoose.Schema,

    SoldierSchema = new schema({
        meshID: {type: Number, required: true, unique: true},
        name: String,
        bloodType: String,
        forceID: String,
        image: String,
        isCommander: Boolean,
        role: String,
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
        emerg: {type: Boolean, default: false}
    }, {collection: 'Soldier'});

    var Soldier = mongoose.model('Soldier', SoldierSchema);
    module.exports = Soldier;
