import React from 'react'

export default props => {
    return (
        <header>
            <div className="jumbotron" style={{ backgroundColor: 'rgb(63,108,118)' }}>
                <h1 className="text-center" style={{ color: '#FFFFFF' }}>{props.title}</h1>
            </div>
        </header>
    )
}