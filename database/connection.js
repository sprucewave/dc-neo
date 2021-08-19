const Mongoose = require('mongoose')
const { database } = require('../config.json')

module.exports = async () => {
    await Mongoose.connect(database.path, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    return Mongoose
}