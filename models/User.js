const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds =   10               //salt를 이용해서 빕밀번호를암호화 해야함 , 그러려면 salt를 먼저 생성해야한다. saltrounds 가 salt가 몇글자인지 나타냄
const jwt = require('jsonwebtoken');
const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,                 // 스페이스바 없으면 좋지
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})
//user 모델에 유저 정보를 저장하기 전에 뭔가를 하겠다.

userSchema.pre('save', function(next){
    var user = this;

    if(user.isModified('password'))                             //model안의 password가 변경될때만 암호화 하겠다. 다른거 이름.이멜 바뀔땐 안하겠다.
    {
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err)return next(err)
            
            bcrypt.hash(user.password, salt, function(err, hash){                   //hash가 암호화된 비밀번호
                if(err) return next(err)
                user.password = hash                    //성공했으면 패스워드를 해시로 변경해준다. 
                next()
            })
        })

    } else {
        next()
    }
    
})

userSchema.methods.comparePassword = function (plainPassword, cb) {

    //plainPassword 1234567    암호회된 비밀번호 $2b$10$l492vQ0M4s9YUBfwYkkaZOgWHExahjWC
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        //if (err) return cb(err);
        //cb(null, isMatch);
        if(err) return cb(err);
        else cb(null, isMatch);
    })
}


userSchema.methods.generateToken = function(cb) {
    //jsonwebtoken을 이용해서 token을 생성하기
    var user = this;
    var token = jwt.sign(user._id.toHexString(), 'secretToken')                       //user._id와 secretToken을 합쳐서 token을 만들었으니, secretToken으로 아이디가 나온다.
    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err);
        cb(null, user);
    })

}

userSchema.statics.findByToken = function(token ,cb) {
    var user = this;
    //토큰을 decode 한다.
    jwt.verify(token, 'secretToken',function(err, decoded) {
        //유저 아이디를 이용해서 유저를 찾은 다음에 클라이언트에서 가져온
        //토큰과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({ "_id" : decoded, "token": token}, function(err, user){
                if(err) return cb(err);
                cb(null, user)
        })
    })
}
const User = mongoose.model('User',userSchema)

module.exports = { User}        // 다른곳에서도 사용할 수 있도록 함
