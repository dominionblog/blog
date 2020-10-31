import React from 'react'
function NotFound() {
    return (<div>
        <header>
            <div className="jumbotron" style={{ backgroundColor: 'rgb(63,108,118)' }}>
                <h1 className="text-center" style={{ color: '#FFFFFF' }}>Page Not Found</h1>
            </div>
        </header>
        <div className="container">
            <div className="row">
                <div className="clearfix" />
                <div className="col">
                    <p>The URL you have requested could not be found on this server. Please try another address.</p>
                </div>
            </div>
        </div>
    </div>)
}
export default NotFound