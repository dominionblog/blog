import React, { useState } from 'react'
import {Link} from 'react-router-dom'
import axios from "axios"
import {Container, Navbar, Nav} from 'react-bootstrap'

function Navigation(props) {
    let {isLoggedIn, setLoggedIn} = props;
    if (isLoggedIn == null) {
        axios({
            method: "get",
            url: "/auth/isloggedin",
            withCredentials: true
        }).then(res => {
            if (res.status == 200) {
                setLoggedIn(true)
            }
        }).catch(err => {
            if (err.response.status == 401) {
                setLoggedIn(false);
            }
        })
    }
    return (<Navbar className="justify-content-between" bg="light" variant="light" expand="lg">
        <Navbar.Brand as={Link} to="/">
            Dominion
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Container>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                    <Nav.Link as={Link} className="nav-link" to="/browse">Browse Posts</Nav.Link>
                    <Nav.Link as={Link} className="nav-link" to="/users/view">Our Authors</Nav.Link>
                    {isLoggedIn ? <Nav.Link as={Link} to="/cp">Control Panel</Nav.Link> : null}
                </Nav>
                {isLoggedIn ? <Nav.Link className="btn btn-primary nav-button-primary" as={Link} to="/users/me">Profile</Nav.Link> : null}
                <Nav.Link as={Link} className="btn btn-primary nav-button-primary" to={`/${isLoggedIn ? "logout" : "login"}`}>{isLoggedIn ? "Log Out" : "Log In"}</Nav.Link>
            </Navbar.Collapse>
        </Container>
    </Navbar>
    )
}

export default Navigation