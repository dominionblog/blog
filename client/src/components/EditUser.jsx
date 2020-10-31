import React, {useState, useEffect} from 'react'
import {Button, Alert, Spinner} from 'react-bootstrap'
import axios from 'axios'
import {useParams} from 'react-router-dom'

let EditUser = props => {
    let {id} = useParams();
    useEffect(() => {
        axios({
            url: "/users/view",
            params: {
                _id: id
            }
        }).then(res => {
            if (!res.data) {
                // No user found
            }
            // Only need md of bio
            res.data.bio = res.data.bio.md
            setUser({
                user, ...res.data
            })
        })
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
    let [isSaved, setSaved] = useState(false)
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
            !user.name ||
            !user.email ||
            !user.bio
        )
    }
    let saveChanges = () => {
        setLoading(true)
        axios({
            url: "/users/edit",
            method: "put",
            data: user
        }).then(res => {
            setLoading(false);
            setSaved(true);
        }).catch(err => {
            setLoading(false);
            setSaved(false);
            setError({
                ...error,
                iserr: true
            });
        });
    }
    return (<>
        <header>
            <div className="jumbotron" style={{ backgroundColor: 'rgb(63,108,118)' }}>
                <h1 className="text-center" style={{ color: '#FFFFFF' }}>Edit a User</h1>
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
                        <h1>Permission</h1>
                        <select name="admin" value={user.admin} onChange={handleUserInput}>
                            <option value={false}>Regular</option>
                            <option value={true}>Admin</option>
                        </select>
                    </div>
                    {isSaved ? <Alert variant="success">
                        <h1>Saved!</h1>
                        <p>Your changes have been saved!</p>
                    </Alert> : error.iserr ? <Alert variant="warning">
                        <h1>Unable to Save User</h1>
                        <p>Your changes could not be saved.</p>
                    </Alert> : null}
                    <div className="d-flex"><Button onClick={saveChanges} disabled={isInvalid || isLoading} variant="primary" className="w-100 create-user-btn">{isLoading ? <Spinner animation="border" role="status"></Spinner> : <> Save Changes <i className="fa fa-check" /></>}</Button></div>
                </div>
            </div>
        </div>
    </>)
}

export default EditUser
