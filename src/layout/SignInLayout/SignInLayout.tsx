import React from 'react';
import './styles.css';
import SignInComponent from '../../components/SignInComponent/SignInComponent';

function SignInLayout(){
    return(
        <div className="responsive-page-sign-in">
            <div className="page-content">
                <div className="d-flex center">
                    <SignInComponent/>
                </div>
            </div>
        </div>
    )
}

export default SignInLayout;