import React from 'react'
import {Link} from 'react-router-dom'

function PostCreated() {
    return (<><header>
    <div className="jumbotron" style={{backgroundColor: 'rgb(63,108,118)'}}>
      <h1 className="text-center" style={{color: '#FFFFFF'}}>Success!</h1>
      <div className="text-center"><i className="fa fa-check-circle-o" style={{width: 'auto', fontSize: 80, color: 'white'}} /></div>
    </div>
  </header>
  <div className="container">
    <p>Your post was successfully created. You may now safely go to another page.</p>
    <div className="row">
      <div className="clearfix" />
      <div className="col">
          <Link to="/posts/new" className="btn btn-primary cp-btn" type="button">Create another post</Link>
          <Link to="/" className="btn btn-primary cp-btn" type="button">Go Home</Link>
      </div>
      <div className="col"><Link to="/cp" className="btn btn-primary cp-btn" type="button">Back To Control Panel</Link></div>
    </div>
  </div></>)
}

export default PostCreated