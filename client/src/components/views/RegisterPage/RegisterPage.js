
import React, { useState } from 'react';
import {useDispatch} from 'react-redux';
import {registerUser} from '../../../_actions/user_action';
import Axios from 'axios';
import {withRouter} from 'react-router-dom';


function RegisterPage(props) {
  const dispatch =useDispatch();

  const [Email, setEmail] = useState("")
  const [Name, setName] = useState("")              
  const [Password, setPassword] = useState("")              //ㅅㅓ버에 보내야할 값들을 state에서 가지고 잇음
  const [ConfirmPassword, setConfirmPassword] = useState("")         
  
  const onEmailHandler = (event => {
    setEmail(event.currentTarget.value)
  })

  const onNameHandler = (event) => {
    setName(event.currentTarget.value)
  }

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)

  }
 
  const onConfirmPasswordHandler = (event) => {
    setConfirmPassword(event.currentTarget.value)

  }

  const onSubmitHandler = (event) => { 
    event.preventDefault();           //이거 안하면 버튼 누를때마다 초기화 될것임
    //let navigate = useNavigate();

    if(Password !== ConfirmPassword)
    {
      return alert('비밀번호와 비밀번호 확인은 같아야 합니다.')
    }

    let body = {
      email: Email,
      password: Password  ,
      name: Name
             
    }

    dispatch(registerUser(body))
      .then(response => {
        if(response.payload.success) {
          props.history.push("/login")       //루트페이지로 (landing)
        } else {
          alert('Failed to sign up')

        }
      })
    //navigate('/home');
    
  }


  return (
    <div style={{
      display: 'flex', justifyContent: 'center' , alignItems: 'center'
      , width: '100%', height: '100vh'
    }}>
    <form style={{display: 'flex', flexDirection: 'column' }}
    onSubmit={onSubmitHandler}>
      <label>Email</label>
      <input type="email" value ={Email} onChange={onEmailHandler} />
     
      <label>Name</label>
      <input type="text" value ={Name} onChange ={onNameHandler} />
     
      <label>Password</label>
      <input type="password" value ={Password} onChange ={onPasswordHandler} />
     
      <label>Confirm</label>
      <input type="password" value ={ConfirmPassword} onChange ={onConfirmPasswordHandler} />
     

      <br />
      <button>
        회원가입
      </button>
    </form>
      
    </div>
  )
}

export default withRouter(RegisterPage)
