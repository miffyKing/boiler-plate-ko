const { User } = require("../models/User");


let auth = (req, res, next) => {

        //인증 처리를 하는 곳
        
        //클라이언트 쿠키에서 토큰을 가져온다.
    let token = req.cookies.x_auth;
        //토큰을 복호화 한후 유저를 찾는다.
    User.findByToken(Token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({isAuth: false, error: true })

        req.token = token;
        req.user = user;
        next();             //이거 안하면 middleware에 계속 갇혀있는 것
        

    })
        //유저가 있으면 인증 O
        
        // 유저가 없으면 인증 X

}

module.exports = { auth} ;