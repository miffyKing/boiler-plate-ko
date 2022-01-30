import React, { useState } from 'react';
import {useDispatch} from 'react-redux';
import {loginUser} from '../../../_actions/user_action';
import {withRouter} from 'react-router-dom';

function LoginPage(props) {
  const dispatch =useDispatch();

  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")              //ㅅㅓ버에 보내야할 값들을 state에서 가지고 잇음

  const onEmailHandler = (event => {
    setEmail(event.currentTarget.value)
  })
  

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)

  }

  const onSubmitHandler = (event) => { 
    event.preventDefault();           //이거 안하면 버튼 누를때마다 초기화 될것임
    //let navigate = useNavigate();
    let body = {
      email: Email,
      password: Password            
    }

    dispatch(loginUser(body))
      .then(response => {
        if(response.payload.loginSuccess) {
          props.history.push('/')       //루트페이지로 (landing)
        } else {
          alert('Error')

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
      <label>Password</label>
      <input type="password" value ={Password} onChange ={onPasswordHandler} />

      <br />
      <button>
        Login
      </button>
    </form>
      
    </div>
  )
}

export default withRouter(LoginPage)
