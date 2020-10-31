import React, {useState, useEffect} from 'react'
import AuthorCard from './general/AuthorCard'
import axios from 'axios'
import {Spinner} from 'react-bootstrap'

let AllAuthors = () => {
    let [authors, setAuthors] = useState([]);
    let [isLoading, setLoading] = useState(true);
    useEffect(() => {
        axios({
            url: "/users/all",
            method: "get"
        }).then(res => {
            setLoading(false);
            setAuthors(res.data)
        }).catch(err => {
            setLoading(false);
            throw err;
        })
    },[])
        return (<>
        <header>
            <div className="jumbotron" style={{backgroundColor: 'rgb(63,108,118)'}}>
                <h1 className="text-center" style={{color: '#FFFFFF'}}>Our Authors</h1>
            </div>
        </header>
        <div className="container authors-container" style={{height: 'auto'}}>
            {isLoading ? <div className="d-flex justify-content-center w-100"><Spinner animation="border"></Spinner></div> : authors.map(author => {
                return (<AuthorCard key={author._id} {...author}/>)
            })}
        </div>
    </>)
}

export default AllAuthors;
