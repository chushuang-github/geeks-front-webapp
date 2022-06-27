import React from 'react'
import { Router, Switch, Route, Redirect } from 'react-router-dom'
// 引入自定义的history对象
import { customHistory } from '@/utils/history'
import Layout from '@/pages/Layout'
import Login from '@/pages/Login'
import Edit from '@/pages/Profile/Edit'
import AuthRoute from './components/AuthRoute'
import './App.scss'

function App() {
  return (
    // 这里直接使用Router就行了，不需要在使用BrowserRouter 或者 HashRouter
    // 因为我们的history库里面使用createBrowserHistory创建了一个history对象
    <Router history={customHistory}>
      <div className="app">
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/home/index" />}></Route>
          <Route path="/home" component={Layout} />
          <Route path="/login" component={Login} />
          {/* 使用路由鉴权组件 */}
          <AuthRoute path="/profile/edit">
            <Edit />
          </AuthRoute>
        </Switch>
      </div>
    </Router>
  )
}
export default App
