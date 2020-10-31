import React from 'react'
import axios from 'axios'

import {Spinner, Alert} from 'react-bootstrap'
import {useHistory} from 'react-router-dom'

function Login(props) {
    let history = useHistory();
    let [input, setInput] = React.useState({})
    let [loading, setLoading] = React.useState(false)
    let [badPass, setBadPass] = React.useState(false)
    let {isLoggedIn, setLoggedIn} = props;
    function handleInput(e) {
        console.log(e.currentTarget.name)
        console.log(e.currentTarget.value)
        setInput({
            ...input,
            [e.currentTarget.name]: e.currentTarget.value
        })
    }
    function logIn() {
        setLoading(true);
        axios({
            method: "post",
            url: "/auth/login",
            data: {
                username: input.username,
                password: input.password
            }
        }).then(res => {
            setLoading(false);
            setLoggedIn(true);
            history.push("/cp")
        }).catch(err => {
            if (err.response.status == 401) {
                setBadPass(true);
            }
            setLoading(false)
        })
    }
    return (<div>
        <header>
            <div className="jumbotron" style={{ backgroundColor: 'rgb(63,108,118)' }}>
                <h1 className="text-center" style={{ color: '#FFFFFF' }}>Log In</h1>
            </div>
        </header>
        <div className="container">
            {badPass ? <Alert variant="danger" className="d-flex justify-content-center">The Password you have entered is Incorrect</Alert> : null}
            <div className="row">
                <div className="clearfix" />
                <div className="col">
                    <div className="form-entry">
                        <h1>Username</h1><input onChange={handleInput} disabled={loading} name="username" value={input.username} type="text" className="new-post-in" /></div>
                    <div className="form-entry">
                        <h1>Password</h1><input onChange={handleInput} disabled={loading} value={input.password} name="password" type="password" className="new-post-in" /></div>
                    <div className="d-flex justify-content-center"><button onClick={logIn} disabled={loading} className="btn btn-primary d-inline-block w-100" type="button">{loading ? <Spinner animation="border" role="status"> <span className="sr-only">Loading...</span> </Spinner> : "Log In"}</button></div>
                </div>
            </div>
        </div>
    </div>)
}
export default Login