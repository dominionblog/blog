import React, {useState, useEffect, useRef} from 'react'
import {Button, Alert, Spinner} from 'react-bootstrap'
import axios from 'axios'

const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop) 

let NewUser = props => {
    let errorRef = useRef(null)
    useEffect(() => {
        console.log('Hello World');
        return () => {
            console.log('Do some cleanup');
        }
    }, [])
    let [user, setUser] = useState({
        username: '',
        password: '',
        name: '',
        email: '',
        admin: false,
        bio: ''
    })
    let [isInvalid, setInvalid] = useState(false)
    let [error, setError] = useState({
        iserr: false,
        msg: ''
    })
    let [isLoading, setLoading] = useState(false);
    let handleUserInput = ev => {
        setUser({
            ...user,
            [ev.currentTarget.name]: ev.currentTarget.value
        });
        let emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
        let lowerCaseEmail = user.email.toLowerCase();
        setInvalid(
            !emailRegex.test(lowerCaseEmail) ||
            !user.username ||
            !user.password ||
            !user.name ||
            !user.email ||
            !user.bio
        )
    }
    let createUser = () => {
        setLoading(true)
        axios({
            url: "/users/new",
            method: "post",
            data: user
        }).then(res => {
            setLoading(false);
        }).catch(err => {
            if (err.request.status == 400) {
                // Validation error. Display the warning message
                setError({
                    ...error,
                    msg: err.response.data.message,
                    iserr: true
                })
                setLoading(false)
                scrollToRef(errorRef)
            }
        });
    }
    return (<>
        <header>
            <div className="jumbotron" style={{ backgroundColor: 'rgb(63,108,118)' }}>
                <h1 className="text-center" style={{ color: '#FFFFFF' }}>Create a New User</h1>
            </div>
        </header>
        <div className="container">
            <div className="row">
                <div className="clearfix" />
                <div className="col">
                    {isInvalid ? <Alert variant="danger">
                        <h1>Error</h1>
                        One or more of the fields below has been filled out incorrectly. Please
                        correct this mistake and try again.
                    </Alert> : null}
                    {error.iserr ? <Alert ref={errorRef} variant="warning">
                        <h1>Unable to Create User</h1>
                        {error.msg}
                    </Alert> : null}
                    <div className="form-entry">
                        <h1>Full Name</h1><input name="name" value={user.name} onChange={handleUserInput} type="text" className="new-post-in" />
                    </div>
                    <div className="form-entry">
                        <h1>Username</h1><input name="username" value={user.username} onChange={handleUserInput} type="text" className="new-post-in" />
                    </div>
                    <div className="form-entry">
                        <h1>Email</h1><input name="email" value={user.email} onChange={handleUserInput} type="text" className="new-post-in" />
                    </div>
                    <div className="form-entry">
                        <h1>Enter Bio</h1>
                        <p>(supports Markdown)</p>
                        <textarea className="md-text" name="bio" defaultValue={user.bio} onChange={handleUserInput} />
                    </div>
                    <div className="form-entry">
                        <h1>Password</h1><input type="text" name="password" value={user.password} onChange={handleUserInput} className="new-post-in" />
                    </div>
                    <div className="form-entry">
                        <h1>Permission</h1>
                        <select name="admin" value={user.admin} onChange={handleUserInput}>
                            <option value={false}>Regular</option>
                            <option value={true}>Admin</option>
                        </select>
                    </div>
                    <div className="d-flex"><Button onClick={createUser} disabled={isInvalid || isLoading} variant="primary" className="w-100 create-user-btn">{isLoading ? <Spinner animation="border" role="status"></Spinner> : <>Create <i className="fa fa-check" /></>}</Button></div>
                </div>
            </div>
        </div>
    </>)
}

export default NewUser
