import React from 'react'
import {Route, Redirect, useHistory} from 'react-router-dom'

/**
 * Prevents the user from accessing routes
 * if they do not have the authentication to do
 * so.
 */

function ProtectedRoute({render: Component, isLoggedIn, ...rest}) {
    let history = useHistory();
    // return (<Component></Component>)
    return (isLoggedIn ? <Route {...rest} render={(props) => {
       return (<Component {...props} />)
    }} /> : <Redirect to="/" />)
}

export default ProtectedRoute