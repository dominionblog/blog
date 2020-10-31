import React from 'react'
import {Link, useHistory} from 'react-router-dom'
import {Button} from 'react-bootstrap'

function FatalError(props) {
    let history = useHistory();
    let goHome = () => {
        props.setCrashed(false);
        history.push("/");
    }
    return (<div className="conn-lost-overlay d-flex align-items-center text-center justify-content-center" style={{ backgroundColor: '#dc3545' }}>
        <div className="text-center">
            <h1>Fatal Error</h1>
            <i className="fa fa-chain-broken" style={{ fontSize: 89 }} />
            <p className="text-center">A fatal Error has occured. Please try reloading the page or try again later.</p>
            <Button onClick={() => {window.location.reload();}} variant="light">Reload</Button>
            <Button onClick={goHome} variant="light">Home</Button>
        </div>
    </div>)
}

export default FatalError;