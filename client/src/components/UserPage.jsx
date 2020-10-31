import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import HTMLToReact from 'html-to-react'
import { Spinner } from 'react-bootstrap' 
let htmlToReactParser = new HTMLToReact.Parser();

let UserPage = props => {
    let [user, setUser] = useState({});
    let [isLoading, setLoading] = useState(true)
    let { id } = useParams();
    useEffect(() => {
        axios({
            url: "/users/view",
            method: "get",
            params: {id}
        }).then(res => {
            res.data.bio = res.data.bio.html // We don't care about the md
            setUser(res.data);
            setLoading(false);
        }).catch(err => {
            throw err;
        })
    }, [id])
    return (<div>
        {
            isLoading ? <Spinner animation="border"></Spinner> : <><header>
                <div className="jumbotron" style={{ backgroundColor: 'rgb(63,108,118)' }}>
                    <h1 className="text-center" style={{ color: '#FFFFFF' }}>{user.name}</h1>
                </div>
            </header><div>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6 col-lg-4">
                                <div className="card contact-card">
                                    <div className="card-header">
                                        <h5 className="mb-0"><strong>Contact Me</strong></h5>
                                    </div>
                                    <div className="card-body"><a className="card-link" href="#">{user.email}</a></div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-10 col-xl-7 author-bio">
                                {user && htmlToReactParser.parse(user.bio)}
                            </div>
                        </div>
                    </div>
                </div></>
        }
    </div>)
}

export default UserPage;