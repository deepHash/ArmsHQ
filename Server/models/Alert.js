var mongoose    = require('mongoose'),
    schema      = mongoose.Schema,
    dateFormat  = require('dateformat'),
    now         = new Date();

    AlertSchema = new schema({
        meshID: {type: Number, required: true},
        messageID: String,
        type: String,
        date: {unique:true, type: String, required: true, default: dateFormat(now, "d/m/yy HH:MM:ss")}
    }, {collection: 'Alert'});

    var Alert = mongoose.model('Alert', AlertSchema);
    module.exports = Alert;
