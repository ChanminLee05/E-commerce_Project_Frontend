import React, {useEffect, useState} from 'react';
import './Header.css';
import * as bootstrap from 'bootstrap';
import {Link} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Header() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);

        const handleBeforeUnload = (event) => {
            localStorage.removeItem('token');
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    function handleSignIn(e) {
        e.preventDefault();
        const user = {username, password}
        fetch("https://nexushub-backend-a8e67f946270.herokuapp.com/nexusHub/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(user)
        }).then((response) => {
            if (response.ok) {
                response.json().then(data => {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userId', data.userId);
                    setIsLoggedIn(true);
                    if (rememberMe) {
                        localStorage.setItem('rememberedUsername', username);
                    } else {
                        localStorage.removeItem('rememberedUsername');
                        setUsername('');
                    }
                    toast.success('Login Successful', {
                        position: "top-center",
                        draggable: true,
                        hideProgressBar: true
                    });
                })

                // Schedule token removal after 1 hour
                setTimeout(() => {
                    localStorage.removeItem('token');

                    setIsLoggedIn(false);

                    window.location.href = '/';

                    toast.warn('Session Expired. Please login again.', {
                        position: "top-center",
                        draggable: true,
                        hideProgressBar: true
                    });
                }, 60000 * 60);

                setPassword('');
            } else {
                console.error('Login Failed');
                toast.warn('Username or Password is incorrect', {
                    position: "top-center",
                    draggable: true,
                    hideProgressBar: true
                    }
                    );
            }
        })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    function handleLogOut() {

        localStorage.removeItem('token');
        localStorage.removeItem('userId');

        setIsLoggedIn(false);

        window.location.href = '/';

        toast.success("Logout Successful", {
                position: "top-center",
                draggable: true,
                hideProgressBar: true
            }
        )
    }


    return(
        <div className="header">
            <div className="logo-container">
                <Link to="/" className="logo-link">
                    <h2 className="logo-txt">NexusHub</h2>
                </Link>
            </div>
            <div className="nav-container">
                <ul className="nav nav-pills nav-list">
                    <li className="nav-item">
                        <div className="dropdown">
                            {isLoggedIn ? (<button type="button"
                                                   className="btn logout-btn"
                                                   onClick={handleLogOut}>
                                Sign Out
                            </button>
                            ) : (<button type="button"
                                                  className="btn dropdown-toggle sign-btn"
                                                  data-bs-toggle="dropdown" aria-expanded="false"
                                                  data-bs-auto-close="outside">
                                SIGN IN
                            </button>)}

                            <form className={`dropdown-menu p-4 sign-form ${
                                isLoggedIn ? 'd-none' : ''
                            }`}>
                                <div className="mb-3">
                                    <label htmlFor="exampleDropdownFormUsername" className="form-label header-form-label">User Name</label>
                                    <input type="text" className="form-control header-form-input" id="exampleDropdownFormUsername" placeholder="User Name"
                                           value={username} onChange={(e) => setUsername(e.target.value)}/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleDropdownFormPassword2" className="form-label header-form-label">Password</label>
                                    <input type="password" className="form-control header-form-input" id="exampleDropdownFormPassword2" placeholder="Password"
                                            value={password} onChange={(e) => setPassword(e.target.value)}/>
                                </div>
                                <div className="mb-3">
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" id="dropdownCheck2"
                                               checked={rememberMe}
                                               onChange={(e) => setRememberMe(e.target.checked)}/>
                                            <label className="form-check-label header-form-input" htmlFor="dropdownCheck2">
                                                Remember me
                                            </label>
                                        <Link to="/find" className="find-link"><p className="find-txt">Forgot your username or password?</p></Link>
                                    </div>
                                </div>
                                <div className="header-form-btn-container">
                                    <button type="submit" className="btn btn-primary header-form-btn" onClick={handleSignIn}>Sign in</button>
                                    <Link to="/register" className="register-link"><button className="btn btn-primary header-form-btn">Sign Up</button></Link>
                                    <Link to="/admin/login" className="register-link"><button className="btn btn-primary header-form-btn">Admin Login</button></Link>
                                </div>
                            </form>
                        </div>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="btn dropdown-toggle shop-btn" data-bs-toggle="dropdown" data-bs-target="navBar" href="#" role="button" aria-expanded="false">SHOP</a>
                        <ul className="dropdown-menu shop-list-container" id="navBar">
                            <Link to="/fashion" className="dropdown-item shop-list">Fashion & Clothes</Link>
                            <Link to="/electronics" className="dropdown-item shop-list">Electronics</Link>
                            <Link to="/homes" className="dropdown-item shop-list">Home & Garden</Link>
                            <Link to="/miscellaneous" className="dropdown-item shop-list">Miscellaneous</Link>
                        </ul>
                    </li>
                    <li className="nav-item">
                        <Link to="/cart"><i className="bi bi-bag-check bag-img"></i></Link>
                    </li>
                </ul>
            </div>
            <ToastContainer />
        </div>
    )
}
