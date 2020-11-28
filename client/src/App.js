import React from 'react';
import Home from "./components/home"
import Navbar from './components/general/navbar'
import Footer from './components/general/footer'
import NotFound from "./components/not-found"
import Login from "./components/login"
import Cp from "./components/cp"
import AllPosts from "./components/all-posts"
import LogoutConf from "./components/log-out-confirmation"
import axios from 'axios'
import Post from './components/Post'
import NewPost from './components/NewPost'
import PostCreated from "./components/PostCreated"
import LoadingOverlay from "./components/general/LoadingOverlay"
import ProtectedRoute from './components/general/ProtectedRoute'
import LostConn from "./components/general/LostConn"
import FatalError from "./components/general/FatalError"
import EditPost from './components/EditPost'
import AllUsers from './components/AllUsers'
import NewUser from './components/NewUser'
import EditUser from "./components/EditUser"
import AllAuthors from "./components/AllAuthors"
import UserPage from "./components/UserPage"
import ProfilePage from "./components/Profile"
import Posts from './components/Posts'
import Browse from './components/Browse'
import Tag from './components/Tag'
import PostInspector from './components/PostInspector'

/* Stylesheets */

import './assets/css/cp.css'
import './assets/bootstrap/css/bootstrap.min.css'
import './assets/css/main.css'
import './assets/css/new-post.css'
import './assets/css/post.css'
import './assets/css/user-accounts.css'
import './assets/fonts/font-awesome.min.css'
import './assets/css/home.css'
import './assets/css/browse.css'
import "./assets/css/conn-lost.css"
import "./assets/css/all-authors.css"
import "./assets/css/view-author.css"
import "./assets/css/profile.css"
import './assets/css/prism.css'

import {
  Switch,
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

function App() {
  let [isLoggedIn, setLoggedIn] = React.useState(null);
  let [isConnected, setIsConnected] = React.useState(true);
  let [isCrashed, setCrashed] = React.useState(false);
  /* TODO: Make admin vs non-admin */
  let [isAdmin, setAdmin] = React.useState(false);
  let [isLoadingOverlay, setLoadingOverlay] = React.useState(false)
  let [inspector, setInspector] = React.useState(null);
  let [showInspector, setShowInspector] = React.useState(false)
  let openInspector = post => {
    setInspector(post)
    if (post) {
      setShowInspector(true)
    } else {
      setShowInspector(false)
    }
  }

  return (
    <div className="App">
      {isConnected ? null : <LostConn />}
      {isLoadingOverlay ? <LoadingOverlay /> : null}
      <Router>
        {isCrashed ? <FatalError setCrashed={setCrashed} /> : null}
        <Navbar isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn}></Navbar>
        <PostInspector showInspector={showInspector} openInspector={openInspector} post={inspector} />
          <Switch>
            <Route exact={true} path="/">
              <Home setIsConnected={setIsConnected}></Home>
            </Route>
            <Route exact={true} path="/browse">
              <Browse inspector={inspector} openInspector={openInspector}></Browse>
            </Route>
            <Route path="/login">
              <Login isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn}></Login>
            </Route>
            <Route path="/logout">
              <LogoutConf isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn}></LogoutConf>
            </Route>
            <ProtectedRoute isLoggedIn={isLoggedIn} path="/cp" render={(props) => (<Cp {...props}/>)} />
            <ProtectedRoute isLoggedIn={isLoggedIn} path="/posts/all" render={props => {
              return (<AllPosts {...props} setLoggedIn={setLoggedIn}></AllPosts>)
            }} />
            <ProtectedRoute isLoggedIn={isLoggedIn} path="/posts/new" render={(props) => {
              return (<NewPost {...props} setLoadingOverlay={setLoadingOverlay}></NewPost>)
            }}/>
            <Route path="/posts/created">
              <PostCreated></PostCreated>
            </Route>
            <Route path="/posts/edit/:id">
              <EditPost setLoadingOverlay={setLoadingOverlay}/>
            </Route>
            <Route path="/posts/:id">
              <Post setCrashed={setCrashed}></Post>
            </Route>
            <ProtectedRoute isLoggedIn={isLoggedIn} path="/users/all" render={props => {
              return (<AllUsers {...props} />)
            }} />
            <ProtectedRoute isLoggedIn={isLoggedIn} path="/users/new" render={props => {
              return (<NewUser {...props} setLoadingOverlay={setLoadingOverlay}/>)
            }} />
            <Route path="/users/view"> 
              <AllAuthors />
            </Route>
            <ProtectedRoute isLoggedIn={isLoggedIn} path="/users/edit/:id" render={props => {
              return (<EditUser {...props} setLoadingOverlay={setLoadingOverlay}/>)
            }} />
            <ProtectedRoute isLoggedIn={isLoggedIn} path="/users/me" render={props => {
              return (<ProfilePage {...props}/>)
            }} />
            <Route path="/users/:id">
              <UserPage />
            </Route>
            {/* Tags */}
            <Route path="/tags/:id">
              <Tag openInspector={openInspector} />
            </Route>
            <Route>
              <NotFound></NotFound>
            </Route>
        </Switch>
        <Footer></Footer>
      </Router>
    </div>
  );
}

export default App;
