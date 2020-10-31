import axios from 'axios';
import React, {useState} from 'react'
import {Modal, Alert, Spinner} from 'react-bootstrap'

let ChangePass = props => {
    let [isLoading, setLoading] = useState(false);
    let [isValid, setValid] = useState(false);
    let [isSuccess, setSuccess] = useState(false);
    let [data, setData] = useState({
        oldPassword: '',
        newPassword: ''
    });
    let handleUserInput = ev => {
        setValid((!!data.oldPassword) && (!!data.newPassword))
        setData({
            ...data,
            [ev.currentTarget.name]: ev.currentTarget.value
        })
    }
    let changePass = () => {
        setLoading(true)
        axios({
            url: "/auth/pass/change",
            method: "put",
            data: data
        }).then(res => {
            setLoading(false)
            setSuccess(true);
        }).catch(err => {
            throw err;
        })
    }
    let closeModal = () => {
        setSuccess(false);
        props.close()
    }
    return (<Modal show={props.show}>
        <Modal.Header>
            <h4 className="modal-title">Warning</h4><button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModal}><span aria-hidden="true">×</span></button>
        </Modal.Header>
        <Modal.Body>
            {
                isSuccess ? <Alert variant="success"><h1>Success!</h1>Your password was changed successfully.<p></p></Alert> : <><div className="alert alert-danger" role="alert">
                    <h1 className="text-center">Warning</h1><span>Changing your password is pretty dangerous. Are you sure you want to do so? <strong>Write your current password below and press continue to proceed.</strong></span></div>
                    <div className="form-entry"><input value={data.oldPassword} name="oldPassword" onChange={handleUserInput} type="text" placeholder="Old password" /></div>
                    <div className="form-entry"><input value={data.newPassword} name="newPassword" onChange={handleUserInput} type="text" placeholder="New password" /></div></>
            }
            
        </Modal.Body>
        <Modal.Footer>
            <button className="btn btn-light" type="button" data-dismiss="modal" onClick={closeModal}>Cancel</button><button onClick={changePass} className="btn btn-danger" type="button" disabled={(!isValid) || isSuccess}>{isLoading ? <Spinner animation="border"></Spinner> : "Continue"}</button>
        </Modal.Footer>
    </Modal>)
}

export default ChangePass;