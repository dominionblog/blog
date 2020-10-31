import React, {useEffect, useState} from 'react'
import { Card, Nav, Tooltip, OverlayTrigger, Alert, Button, Spinner} from 'react-bootstrap'
import axios from 'axios'
import ChangePass from './ChangePass'

let HelpIcon = mainProps => {
    return (<OverlayTrigger
        placement="right"
        delay={{ show: 250, hide: 400 }}
        overlay={props => {
            return (<Tooltip id="help-tooltip" {...props}>
                {mainProps.text}
            </Tooltip>)
        }}
    ><i className="fa fa-question-circle-o help-badge" /></OverlayTrigger>)
}
let ProfileSubmenu = props => {
    if (props.menu == "general") {
        return (<><div className="profile-entry">
            <h1 className="h-100">Name
            <HelpIcon text="Your full name" />
            </h1><input name="name" value={props.user.name} onChange={props.handleUserInput} type="text" className="new-post-in" /></div>
            <div className="profile-entry">
                <h1 className="h-100">Email
                <HelpIcon text="Your main email address" />
                </h1><input name="email" value={props.user.email} onChange={props.handleUserInput} type="text" className="new-post-in" /></div>
            <div className="profile-entry">
                <h1 className="h-100">Username
                <HelpIcon text="The name you will provide when logging in" />
                </h1><input name="username" value={props.user.username} onChange={props.handleUserInput} type="text" className="new-post-in" /></div></>)
    }
    if (props.menu == "description") {
        return (<><div className="form-entry">
            <h1>Bio<HelpIcon text="A short description of yourself" /></h1><textarea name="bio" onChange={props.handleUserInput} defaultValue={props.user.bio} /></div></>)
    }
    if (props.menu == "password") {
        return (<>
            <div className="setting-change-btn"><button onClick={props.startChangePass} className="btn btn-danger w-100" type="button">Change Password<i className="fa fa-question-circle-o help-badge" /></button></div>
        </>)
    }
    return null
}
let ProfilePage = () => {
    let [isSuccess, setSuccess] = useState(false);
    let [isFailed, setFailed] = useState(false);
    let [isLoading, setLoading] = useState(true);
    let [isSubmitting, setSubmitting] = useState(false);
    let [passwordModal, setPasswordModal] = useState(false);
    let [user, setUser] = useState({
        name: '',
        username: '',
        email: '',
        bio: ''
    });
    let saveProfile = () => {
        setSubmitting(true)
        axios({
            url: "/users/self",
            method: "put",
            data: user
        }).then(res => {
            setSuccess(true);
            setFailed(false);
            setSubmitting(false)
        }).catch(err => {
            setSuccess(false);
            setFailed(true);
            setSubmitting(false)
            throw err;
        })
    }
    useEffect(() => {
        setLoading(false)
        axios({
            url: "/users/me",
            method: "get"
        }).then(res => {
            res.data.bio = res.data.bio.md; // don't care about html
            setUser(res.data)
        }).catch(err => {
            throw err;
        })
    }, [])
    let handleUserInput = ev => {
        setUser({
            ...user,
            [ev.currentTarget.name]: ev.currentTarget.value
        })
    }
    let changePass = () => {
        axios({
            url: "/users/password/change",
            method: "put"
        }).then(res => {

        })
    }
    let [openMenu, setOpenMenu] = useState('general')
    let navClicked = ev => {
        setOpenMenu(ev.currentTarget.name)
    }
    return (<div>
        <header>
            <div className="jumbotron" style={{ backgroundColor: 'rgb(63,108,118)' }}>
                <h1 className="text-center" style={{ color: '#FFFFFF' }}>Your Profile</h1>
            </div>
        </header>
        <div className="container">
            {
                isLoading ? <Spinner animation="border"></Spinner> : <Card>
                    <Card.Header>
                        <Nav variant="tabs" activeKey={openMenu}>
                            <Nav.Item>
                                <Nav.Link name="general" eventKey="general" onClick={navClicked}>General</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link name="description" eventKey="description" onClick={navClicked}>Description</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link name="password" eventKey="password" onClick={navClicked}>Password</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </ Card.Header>
                    <Card.Body>
                        <ProfileSubmenu startChangePass={() => {setPasswordModal(true)}} user={user} handleUserInput={handleUserInput} menu={openMenu} />
                        <div className="d-flex"><Button onClick={saveProfile} className="w-100"><i className="fa fa-check-square-o p-1" />{isSubmitting ? <Spinner animation="border"></Spinner> : "Save Changes"}</Button></div>
                        {isSuccess ? <Alert className="profile-status-alert" variant="success">
                            <h1>Changes Saved</h1>
                            <p>Your changes were sucessfully saved!</p>
                        </Alert> : null}
                        {isFailed ? <Alert className="profile-status-alert" variant="danger">
                            <h1>Error</h1>
                            <p>An error occured and your changes could not be saved. Please contact
                            your administrator.</p>
                        </Alert> : null}
                    </Card.Body>
                </Card>
            }
        </div>
        <ChangePass close={() => {setPasswordModal(false)}} show={passwordModal} />
    </div>)
}

export default ProfilePage;