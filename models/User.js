const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt')




const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true, 
        validate: [isEmail, 'please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter an password'],
        minlength: [6, 'minimum password length is 6 characters']
    },
});


//Fire a function after doc saved to db

userSchema.post('save', function(doc, next){
    console.log('New user was created and saved', doc)
    next();
});


// Fire a function after doc saved to db

userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//static method to login user

userSchema.statics.login = async function(email, password){
    const user = await this.findOne({ email });

    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error('Incorrect password');

    } throw Error('Incorrect email')
}

const User = mongoose.model('user', userSchema); //singular of the name in the db



module.exports = User;