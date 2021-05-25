import React from 'react'
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom'
import { MainPage } from './pages/MainPage'
import { CreatePage } from './pages/CreatePage'
import { LoginPage } from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import { AuthContext } from './context/AuthContext'
import { useAuth } from './hooks/auth.hook'
import Navbar from './components/Navbar'
import './App.css'
import { ClassifiedPage } from './pages/ClassifiedPage'

function App() {
  //<AuthPage />
  const { login, logout, token, userId, ready } = useAuth()
  const isAuthenticated = !!token

  return (
    <AuthContext.Provider
      value={{ login, logout, token, userId, isAuthenticated }}
    >
      <div className='App'>
        <BrowserRouter>
          <Navbar />
          <Switch>
            <Route path='/main' exact>
              <MainPage />
            </Route>
            <Route path='/login' exact>
              <LoginPage />
            </Route>
            <Route path='/register'>
              <RegisterPage />
            </Route>
            <Route path='/create' exact>
              <CreatePage />
            </Route>
            <Route path='/profile' exact>
              <ProfilePage />
            </Route>
            <Route path='/detail/:id'>
              <ClassifiedPage />
            </Route>

            <Redirect to='/main' />
          </Switch>
        </BrowserRouter>
      </div>
    </AuthContext.Provider>
  )
}

export default App
