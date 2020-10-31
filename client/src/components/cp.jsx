import React from 'react'
import {Link} from 'react-router-dom'
function Cp(props) {
    return (<div>
        <header>
            <div className="jumbotron" style={{ backgroundColor: 'rgb(63,108,118)' }}>
                <h1 className="text-center" style={{ color: '#FFFFFF' }}>Admin Panel</h1>
            </div>
        </header>
        <div className="container">
            <div className="row">
                <div className="clearfix" />
                <div className="col">
                    <Link to="/posts/all"><button className="btn btn-primary cp-btn" type="button">View Your Posts</button></Link>
                    <Link to="/logout"><button className="btn btn-primary cp-btn" type="button">Log Out</button></Link>
                </div>
                <div className="col">
                    <Link to="/users/all"><button className="btn btn-primary cp-btn" type="button">Manage User Accounts</button></Link>
                </div>
            </div>
        </div>
    </div>)}
export default Cp
