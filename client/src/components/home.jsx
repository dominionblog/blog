import React from 'react'
import {Link} from 'react-router-dom'
import {Button} from 'react-bootstrap'

import welcomeImage from '../assets/img/welcome-image.JPG'
import dominionLogo from "../assets/img/dominion-logo.png"

export default () => {
  return (<div className="welcome-page masthead" style={{ backgroundImage: `url("${welcomeImage}")` }}>
    <div className="overlay" />
    <div className="container">
      <div className="row">
        <div className="col-md-10 col-lg-8 mx-auto">
          <div className="site-heading">
            <div className="welcome-message">
              <span className="subheading">Welcome to the</span>
              <h1>Dominion</h1>
            </div>
              <img className="logo-image" src={dominionLogo} />
            <div className="home-buttons">
              <Button variant="light" className="home-button" as={Link} to="/browse">Browse Posts</Button>
              <Link to="/browse" as={Button}></Link>
              {/* <a className="btn btn-light home-button" role="button">Sign Up</a> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>)
}