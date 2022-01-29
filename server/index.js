const express = require('express')   //express module 을 가져옴
const app = express()               // express 의 function을 이용해 앱을 만들고

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { User } = require("../models/User");

const config = require('./config/key');     /////
const {auth } = require('./middleware/auth');
//application/ x-www-form-urlencoded 분석해서 가져올 수 있게 함
app.use(bodyParser.urlencoded({extended: true}));     //client에서 오는 정보
//application/json 분석해서 가져올 수 있게
app.use(bodyParser.json());  
app.use(cookieParser());


const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    //useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err))

//mongodb+srv://byounghwa:<password>@boilerplate.yiuhl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority


app.get('/', (req, res) => res.send('Hello World! 새해 복 많이 받으세요 서휘야 안녕!!'))                                  //'/' 루트 디렉토리에 hello world 출력 


app.get('/api/hello', (req,res) => {
  res.send("hello world~~")
})


app.post('/api/users/register', (req, res) => {
  //회원가입 시 필요한 정보들을 client에서 가져오면
  //그것들을 데이터 베이스에 넣어준다.
  const user = new User(req.body)           //req.body에 '이름', '비번'... 이런게 들어있는 상태
   

  ///save 하기전에 비밀번호... 암호화 해주어야 해.. mongoose 의 기능 이용
  user.save((err, userInfo) => {
    if(err) return res.json({success: false, err})
    return res.status(200).json({
      success: true
    })
  })                               //save : mongodb 메소드, 유저에 저장 됨
})



app.post('/api/users/login', (req, res) =>{
  //요청된 이메일을 데터베이스에서 있ㅡ지 찾는다.
    User.findOne({ email: req.body.email}, (err, user) => {
      if(!user) {
        return res.json({
          loginSuccess: false,
          message: "제공된 이메일에 해당하는 유저가 없습니다."
        })
      }
    //요첟된 이일ㅣ 데터 베스 있ㅏㅕㄴ 비ㄹㅓㄴ호가 맞ㅡ 비밀번호인지 확인.
      user.comparePassword(req.body.password, (err,isMatch) => {
        if(!isMatch)
          return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."})

      //비밀번호 까지 맞다면 토큰을 생성하기.
        user.generateToken((err, user)  => {
          if(err) return res.status(400).send(err);
     
          // 토큰을 저장한다. 어디에?  쿠키, 로컬 스토리지
            res.cookie("x_auth", user.token)
              .status(200)
              .json({ loginSuccess: true, userId: user._id})
        })
      })   
  })
})


//role 1 어드민 role 2 특정 부서 어드민
//role 0  --> 일반유저  role 0이 아니면 관리자
app.get('/api/users/auth', auth, (req, res) => {

  //여기까지 미들웨어를 통과해 왔다는 얘기는 authentication이 true 라는 말.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true ,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})


app.get('/api/users/logout', auth, (req, res) => {
  // console.log('req.user', req.user)
  User.findOneAndUpdate({ _id: req.user._id },
    { token: "" }
    , (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true
      })
    })
})


const port = 5000  
app.listen(port, () => { 
  console.log(`Example app listening on port ${port}`)
})
