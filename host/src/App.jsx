import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { useHistory, Switch, Route, BrowserRouter } from "react-router-dom";

import * as auth from "./utils/auth.js";

import Footer from "./components/Footer";

import "./index.css" ; 



const Header = lazy(() => import('users/Header').catch(() => {
  return { default: () => <div className='error'>Component is not available!</div> };
})
);
const Login = lazy(() => import('users/Login').catch(() => {
  return { default: () => <div className='error'>Component is not available!</div> };
})
);
const Register = lazy(() => import('users/Register').catch(() => {
  return { default: () => <div className='error'>Component is not available!</div> };
})
);
const Main = lazy(() => import('card_list/Main').catch(() => {
  return { default: () => <div className='error'>Component is not available!</div> };
})
);


const App = () => {

  const history = useHistory();

  React.useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      auth
        .checkToken(token)
        .then((res) => {
          dispatchEvent(new CustomEvent("tokenOk", { detail: { email: res.data.email } }));
          history.push("/");
        })
        .catch((err) => {
          console.log(err);
          dispatchEvent(new CustomEvent("signOut"));
        });
    }
    else {
      console.log('No token');
      history.push("/signin");
    }
  }, [history]);


  return (
    <div className="page__content">
      <Header />
      <Switch>
        <Route exact path="/">
          <Suspense fallback={<div>Loading...</div>}>
            <Main />
          </Suspense>
        </Route>
        <Route path="/signup">
          <Suspense fallback={<div>Loading...</div>}>
            <Register />
          </Suspense>
        </Route>
        <Route path="/signin">
          <Suspense fallback={<div>Loading...</div>}>
            <Login />
          </Suspense>
        </Route>
      </Switch>
      <Footer />
    </div>
  );
};

const rootElement = document.getElementById("app")
if (!rootElement) throw new Error("Failed to find the root element")

const root = ReactDOM.createRoot(rootElement)

root.render(<BrowserRouter><App /></BrowserRouter>)