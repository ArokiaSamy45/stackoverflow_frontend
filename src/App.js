import React, { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import StackOverflow from "./components/StackOverflow";
import AddQuestion from "./components/Add-Question";
import ViewQuestion from "./components/ViewQuestion";
import Auth from "./components/Auth";
import { login, logout, selectUser } from "./feature/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "./firebase";
import { checkSessionExpiration, updateLastActiveTime } from './sessionmanagement';


function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setLoading(false);

      if (authUser) {
        dispatch(
          login({
            uid: authUser.uid,
            photo: authUser.photoURL,
            displayName: authUser.displayName,
            email: authUser.email,
          })
        );
      } else {
        dispatch(logout());
      }
    });

    // Cleanup function to unsubscribe when the component unmounts
    return () => unsubscribe();
  }, [dispatch]);

  // Example: Call checkSessionExpiration every 1 minute
setInterval(checkSessionExpiration, 1 * 60 * 1000);

// Example: Update last active time when user interacts with the application
document.addEventListener('mousemove', updateLastActiveTime);
document.addEventListener('keypress', updateLastActiveTime);

  const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        loading ? (
          // You might want to render a loading spinner or message here
          null
        ) : user ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/auth",
              state: {
                from: props.location,
              },
            }}
          />
        )
      }
    />
  );

  return (
    <div className="App">
      <Router>
        <Header />
        <Switch>
          <Route exact path="/auth">
            {user ? <Redirect to="/" /> : <Auth />}
          </Route>
          <PrivateRoute exact path="/" component={StackOverflow} />
          <PrivateRoute exact path="/add-question" component={AddQuestion} />
          <PrivateRoute exact path="/question" component={ViewQuestion} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
