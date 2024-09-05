import React from 'react';
import { Route, Link, useHistory } from 'react-router-dom';

import EditAvatarPopup from './EditAvatarPopup';
import EditProfilePopup from './EditProfilePopup';

import logoPath from '../../images/logo.svg';
import * as auth from "../utils/auth.js";
import api from "../utils/api";

export default function Header() {

    const history = useHistory();

    const [email, setEmail] = React.useState('');
    const [currentUser, setCurrentUser] = React.useState('');
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);

    React.useEffect(() => {
        addEventListener("signOut", onSignOut());
        return () => removeEventListener("signOut", onSignOut);
    }, []);

    React.useEffect(() => {
        addEventListener("signIn", onSignIn());
        return () => removeEventListener("signIn", onSignIn);
    }, [email]);

    React.useEffect(() => {
        addEventListener("signUp", onSignUp());
        return () => removeEventListener("signUp", onSignUp);
    }, []);

    React.useEffect(() => {
        addEventListener("tokenOk", onTokenOk());
        return () => removeEventListener("tokenOk", onTokenOk);
    }, [email]);


    React.useEffect(() => {
        addEventListener("editProfile", onEditProfile());
        return () => removeEventListener("editProfile", onEditProfile);
    }, [currentUser]);

    React.useEffect(() => {
        addEventListener("editAvatar", onEditAvatar());
        return () => removeEventListener("editAvatar", onEditAvatar);
    }, [currentUser]);


    const onEditProfile = () => (userData) => {
        console.log("onEditProfile", userData);
        setCurrentUser(userData.detail);
        setIsEditProfilePopupOpen(true);
    }

    const onEditAvatar = () => (userData) => {
        console.log("onEditAvatar", userData);
        setCurrentUser(userData.detail);
        setIsEditAvatarPopupOpen(true);
    }

    function handleUpdateUser(userUpdate) {
        api
            .setUserInfo(userUpdate)
            .then((newUserData) => {
                console.log("handleUpdateUser", newUserData);
                setCurrentUser(newUserData);
                closeAllPopups();
                document.location.href = "/";
            })
            .catch((err) => console.log(err));
    }

    function handleUpdateAvatar(avatarUpdate) {
        api
            .setUserAvatar(avatarUpdate)
            .then((newUserData) => {
                setCurrentUser(newUserData);
                closeAllPopups();
            })
            .catch((err) => console.log(err));
    }

    const onSignOut = () => () => {
        console.log("onSignOut");
        localStorage.removeItem("jwt");
        history.push("/signin");
    }

    const onSignIn = () => (userData) => {
        console.log(userData.detail);
        auth
            .login(userData.detail.email, userData.detail.password)
            .then((res) => {
                console.log("onSignIn", userData);
                document.location.href = "/";
            })
    }

    const onSignUp = () => (userData) => {
        console.log(userData.detail);
        auth
            .register(userData.detail.email, userData.detail.password)
            .then((res) => {
                console.log("onSignUp", userData);
                console.log(res);
                history.push("/");
            })
    }

    const onTokenOk = () => (userData) => {
        console.log("onTokenOk", userData.detail);
        setEmail(userData.detail.email);
        setCurrentUser(userData.detail._id);
    }

    const handleSignOut = () => {
        dispatchEvent(new CustomEvent("signOut"));
    }

    const closeAllPopups = () => {
        setIsEditProfilePopupOpen(false);
        setIsEditAvatarPopupOpen(false);
    }

    return (
        <div>
            <header className="header page__section">
                <a href="/" className="header__link">
                    <img src={logoPath} alt="Логотип проекта Mesto" className="logo header__logo" />
                </a>
                <Route exact path="/">
                    <div className="header__wrapper">
                        <p className="header__user">{email}</p>
                        <button className="header__logout" onClick={handleSignOut}>Выйти</button>
                    </div>
                </Route>
                <Route path="/signup">
                    <Link className="header__auth-link" to="signin">Войти</Link>
                </Route>
                <Route path="/signin">
                    <Link className="header__auth-link" to="signup">Регистрация</Link>
                </Route>
            </header>
            <EditAvatarPopup
                isOpen={isEditAvatarPopupOpen}
                onUpdateAvatar={handleUpdateAvatar}
                onClose={closeAllPopups}
            />
            <EditProfilePopup
                currentUser={currentUser}
                isOpen={isEditProfilePopupOpen}
                onUpdateUser={handleUpdateUser}
                onClose={closeAllPopups}
            />
        </div>
    )
}