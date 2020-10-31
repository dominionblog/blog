import React from 'react'
import {Spinner} from 'react-bootstrap'

function LoadingOverlay() {
    return (<div id="loading-overlay" onclick="off()">
        <div className="w-100 d-flex justify-content-center align-items-center">
            <Spinner style={{ width: "100px", height: "100px" }} animation="grow" role="status" variant="info"></Spinner>
            <div>
                <p className="loading-text">Please Wait...</p>
            </div>
        </div>
    </div>)
}

export default LoadingOverlay