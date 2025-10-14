import React, { useState } from 'react'
import { useLogin } from '../hooks/useAuth'
import { useAppSelector } from '../store/hooks'

export default function LoginTest() {
  const { login, isLoading } = useLogin()
  const authState = useAppSelector(state => state.auth)
  const [credentials, setCredentials] = useState({
    email: 'arhamsiddiqui97@gmail.com',
    password: ''
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('Attempting login with:', credentials)
    
    try {
      const result = await login(credentials)
      console.log('Login result:', result)
      
      // Check localStorage immediately after login
      const storedToken = localStorage.getItem('accessToken')
      const storedRefreshToken = localStorage.getItem('refreshToken')
      
      console.log('Stored access token:', storedToken ? `${storedToken.substring(0, 20)}...` : 'None')
      console.log('Stored refresh token:', storedRefreshToken ? `${storedRefreshToken.substring(0, 20)}...` : 'None')
      
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Login Test</h2>
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      {/* Debug Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Debug Info:</h3>
        <div className="text-sm space-y-1">
          <p>Authenticated: {authState.isAuthenticated ? 'Yes' : 'No'}</p>
          <p>User: {authState.user ? `${authState.user.firstName} ${authState.user.lastName}` : 'None'}</p>
          <p>Token: {authState.token ? `${authState.token.substring(0, 20)}...` : 'None'}</p>
          <p>Loading: {authState.isLoading ? 'Yes' : 'No'}</p>
          <p>Error: {authState.error || 'None'}</p>
        </div>
        
        <div className="mt-2">
          <button
            onClick={() => {
              const token = localStorage.getItem('accessToken')
              const refreshToken = localStorage.getItem('refreshToken')
              console.log('Current localStorage tokens:')
              console.log('Access:', token ? `${token.substring(0, 20)}...` : 'None')
              console.log('Refresh:', refreshToken ? `${refreshToken.substring(0, 20)}...` : 'None')
            }}
            className="text-xs bg-gray-200 px-2 py-1 rounded"
          >
            Check localStorage
          </button>
        </div>
      </div>
    </div>
  )
}