import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useGoogleLogin, useGoogleLogout } from 'react-google-login'
import { refreshTokenSetup } from '../pages/api/refreshToken'
import { User } from '../typing'

function Header({ setUser, user, error, setError }: any) {
  // refresh token

  const clientId =
    '788505629167-v648vgsorglc1gkcu109q5769fuab0rd.apps.googleusercontent.com'

  const onSuccess = (res: any) => {
    setUser(res.profileObj)
    refreshTokenSetup(res)
  }

  const onFailure = (res?: any) => {
    setError(res)
  }
  const onLogoutSuccess = () => {
    setUser({} as User)
    console.log('Logged out Success')
    alert('Logged out Successfully ✌')
  }
  const { signIn } = useGoogleLogin({
    onSuccess,
    onFailure,
    clientId,
    isSignedIn: true,
    accessType: 'offline',
    // responseType: 'code',
    // prompt: 'consent',
  })

  const { signOut } = useGoogleLogout({
    clientId,
    onLogoutSuccess,
    onFailure,
  })

  return (
    <header className="mx-auto flex max-w-7xl justify-between p-5">
      <div className="flex items-center space-x-5">
        <Link href="/">
          <img
            className="w-44 cursor-pointer object-contain"
            // src="https://links.papareact.com/yvf"
            src="/static/cse-logo.png"
            alt=""
          />
        </Link>
        <div className="hidden items-center space-x-5 md:inline-flex">
          <h3>About</h3>
          <h3>Contact</h3>
          <h3 className="rounded-full bg-sky-600 px-4 py-1 text-white">
            Follow
          </h3>
        </div>
      </div>
      <div className="text-grew flex items-center space-x-5 text-sky-600">
        {user?.givenName && <h4>Welcome {user?.givenName}</h4>}
        {error && (
          <h4 className="absolute top-16 text-red-600">{error.details}</h4>
        )}
        <h3 className="rounded-full border border-sky-600 px-4 py-1 hover:cursor-pointer hover:bg-sky-200 hover:underline">
          {!user?.email ? (
            <button onClick={signIn}>Sign in</button>
          ) : (
            <button onClick={signOut}>Sign out</button>
          )}
        </h3>
      </div>
    </header>
  )
}

export default Header
