import React from 'react'

function LostConn() {
    return (<div className="conn-lost-overlay d-flex align-items-center text-center justify-content-center">
        <div className="text-center">
            <h1>Connection Lost</h1><i className="fa fa-warning" style={{ fontSize: 89 }} />
            <p className="text-center">Check your internet connection and try again</p>
        </div>
    </div>)
}

export default LostConn;