import React from 'react'
import axios from 'axios'
import {Link, useHistory} from 'react-router-dom'

function LogoutConf(props) {
    let history = useHistory();
    function handleLogout() {
        axios({
            method: "get",
            url: "/auth/logout",
        }).then(res => {
            props.setLoggedIn(false);
            history.push("/")
        }).catch(err => {
            throw err;
        })
    }
    return (<div>
        <header>
            <div className="jumbotron" style={{ backgroundColor: 'rgb(63,108,118)' }}>
                <h1 className="text-center" style={{ color: '#FFFFFF' }}>Are you sure you want to log out?</h1>
            </div>
        </header>
        <div className="container">
            <div className="row">
                <div className="clearfix" />
                <div className="col"><button onClick={handleLogout} className="btn btn-danger cp-btn" type="button">Log Out</button></div>
                <div className="col"><Link to="/"><button className="btn btn-primary cp-btn" type="button">Cancel</button></Link></div>
            </div>
        </div>
    </div>)
}
export default LogoutConf