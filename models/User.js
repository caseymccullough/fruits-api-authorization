const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    bio: String,
    password: { type: String, required: true },
    fruits: [{ type: Schema.Types.ObjectId, ref:'Fruit' }],
    veggies: [{ type: Schema.Types.ObjectId, ref:'Vegetable'}]
})

module.exports = model('User', userSchema)