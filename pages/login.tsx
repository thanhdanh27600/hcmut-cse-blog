import React from 'react'

import { GoogleLogin } from 'react-google-login'
// refresh token
import { refreshTokenSetup } from './api/refreshToken'

const clientId =
  '788505629167-v648vgsorglc1gkcu109q5769fuab0rd.apps.googleusercontent.com'

const secret = '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'

function Login() {
  const onSuccess = (res: any) => {
    console.log('Login Success: currentUser:', res.profileObj)
    alert(
      `Logged in successfully welcome ${res.profileObj.name} 😍. \n See console for full profile object.`
    )
    refreshTokenSetup(res)
  }

  const onFailure = (res: any) => {
    console.log('Login failed: res:', res)
    alert(
      `Failed to login. 😢 Please ping this to repo owner twitter.com/sivanesh_fiz`
    )
  }

  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        style={{ marginTop: '100px' }}
        isSignedIn={true}
        className="absolute top-1/2 left-1/2"
      />
    </div>
  )
}

export default Login
