const Mongoose = require('mongoose')
const PROFILE_SCHEMA = require('./schemas/profile')

const DEFAULT_VALUES = {arribas: 0, muertes: 0, pontos: 0, boosts: {}}
const USER_CACHE = {}

module.exports.GET_VALUES = async(GUILD, USER) => {
   
    if(USER_CACHE[`${GUILD}-${USER}`]) return USER_CACHE[`${GUILD}-${USER}`]

    let RESULT = await PROFILE_SCHEMA.findOne({
        guildId: GUILD,
        userId: USER
    }, {arribas: 1,muertes: 1,pontos: 1, boosts: 1, _id: 0})

    if(!RESULT) {
        await new PROFILE_SCHEMA({ guildId: GUILD, userId: USER, arribas: 0, muertes: 0, pontos: 0}).save()
        RESULT = DEFAULT_VALUES
    }

    USER_CACHE[`${GUILD}-${USER}`] = RESULT
    return RESULT

}

module.exports.ADD_VALUES = async(GUILD, USER, INDEX, AMOUNT) => {
    const RESULT = await PROFILE_SCHEMA.findOneAndUpdate({
        guildId: GUILD,
        userId: USER,
    }, {
        guildId: GUILD,
        userId: USER,
        $inc: {
            [INDEX]: AMOUNT
        }
    }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        projection: { arribas: 1, muertes: 1, pontos: 1, boosts: 1, _id: 0 }
    })

    if (RESULT) {
        USER_CACHE[`${GUILD}-${USER}`] = RESULT
        return RESULT
    }

}

module.exports.REMOVE_VALUES = async(GUILD, USER, INDEX, AMOUNT) => {
    const RESULT = await PROFILE_SCHEMA.findOneAndUpdate({
        guildId: GUILD,
        userId: USER
    }, {
        guildId: GUILD,
        userId: USER,
        $inc: {
            [INDEX]: -AMOUNT
        }
    }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        projection: { arribas: 1, muertes: 1, pontos: 1, boosts: 1, _id: 0 }
    })

    if (RESULT) {
        USER_CACHE[`${GUILD}-${USER}`] = RESULT
        return RESULT
    }
    
}