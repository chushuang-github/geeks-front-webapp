import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import Layout from '@/pages/Layout'
import Login from '@/pages/Login'
import './App.scss'

function App() {
  return (
    <Router>
      <div className="app">
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/home" />}></Route>
          <Route path="/home" component={Layout} />
          <Route path="/login" component={Login} />
        </Switch>
      </div>
    </Router>
  )
}

export default App
