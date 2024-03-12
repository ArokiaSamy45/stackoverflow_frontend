import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GithubAuthProvider,
  GoogleAuthProvider,
  linkWithCredential,
  getAuth,
  getAdditionalUserInfo,
  sendPasswordResetEmail,
} from "firebase/auth";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { auth, provider } from "../../firebase";
import "./index.css";
import google from "./google-logo-png-suite-everything-you-need-know-about-google-newest-0.png";
import github from "./github.png";

function Index() {
  const githubProvider = new GithubAuthProvider();
  const auth = getAuth();
  const history = useHistory();
  const [register, setRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isMounted = React.useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  function validateEmail(email) {
    const reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
    return reg.test(email);
  }

  const handleGitHubSignIn = () => {
    setLoading(true);

    signInWithPopup(auth, githubProvider)
      .then(async (result) => {
        const user = result.user;
        const credential = GithubAuthProvider.credentialFromResult(result);

        // Check if the email is already associated with an existing account
        try {
          const existingUser = await signInWithEmailAndPassword(
            auth,
            user.email,
            "some_dummy_password"
          );

          // Link GitHub credential with the existing Firebase user
          await linkWithCredential(existingUser, credential);

          // Fetch additional user info if needed
          const additionalUserInfo = getAdditionalUserInfo(result);

          setLoading(false);
          history.push("/");
        } catch (error) {
          // Handle account linking error
          setLoading(false);
          console.error(error);
          alert(
            "Account linking failed. Please sign in with the same provider used initially."
          );
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = result.user;
    
    // Now you can use the user.uid as needed
    // console.log("User ID:", user.uid);
      setLoading(false);
      history.push("/");
    } catch (error) {
      setLoading(false);
      handleAuthError(error);
    }
  };

  const linkAccounts = async (githubCredential) => {
    try {
      const user = auth.currentUser;
      if (user) {
        await linkWithCredential(user, githubCredential);
        console.log("GitHub account linked successfully!");
      } else {
        console.error("No authenticated user to link accounts.");
      }
    } catch (error) {
      console.error("Error linking GitHub account:", error);
    }
  };

  const handleAuthError = async (error) => {
    setError("");
    if (error.code === "auth/account-exists-with-different-credential") {
      const email = error.email;
      alert(
        "An account already exists with this email using a different provider. Please sign in using the same provider."
      );

      // Link GitHub account to existing account (optional)
      const githubCredential = GithubAuthProvider.credentialFromError(error);
      if (githubCredential) {
        linkAccounts(githubCredential);
      }
    } else {
      setError(error.message);
    }
  };

  const handleSignIn = () => {
    setError("");
    setLoading(true);
    if (email === "" || password === "") {
      setError("Required field is missing");
      setLoading(false);
    } else if (!validateEmail(email)) {
      setError("Email is malformed");
      setLoading(false);
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((res) => {
          if (isMounted.current) {
            history.push("/");
            setLoading(false);
          }
        })
        .catch((error) => {
          if (isMounted.current) {
            console.log(error.code);
            setError(error.message);
            setLoading(false);
            if (error.code === "auth/user-not-found") {
              alert(
                "Email not found. Please check your email or register an account."
              );
            } else if (error.code === "auth/wrong-password") {
              alert("Incorrect password. Please try again.");
            }
          }
        });
    }
  };

  const handleRegister = () => {
    setError("");
    setLoading(false);
    if (email === "" || password === "" || username === "") {
      setError("Required field is missing.");
      setLoading(false);
    } else if (!validateEmail(email)) {
      setError("Email is malformed");
      setLoading(false);
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((res) => {
          if (isMounted.current) {
            history.push("/");
            setLoading(false);
          }
        })
        .catch((error) => {
          if (isMounted.current) {
            console.log(error);
            setError(error.message);
            setLoading(false);
          }
        });
    }
  };

  const handleForgotPassword = () => {
    setError("");
    setForgotPassword(true);
  };

  const handleSendResetEmail = () => {
    setError("");
    setLoading(true);

    if (forgotPasswordEmail === "") {
      setError("Please enter your email to reset the password.");
      setLoading(false);
    } else if (!validateEmail(forgotPasswordEmail)) {
      setError("Email is malformed");
      setLoading(false);
    } else {
      sendPasswordResetEmail(auth, forgotPasswordEmail)
        .then(() => {
          if (isMounted.current) {
            console.log("Password reset email sent successfully");
            setLoading(false);
            setForgotPassword(false);
            alert("Password reset email sent successfully");
          }
        })
        .catch((error) => {
          if (isMounted.current) {
            setError(error.message);
            setLoading(false);
          }
        });
    }
  };

  return (
    <div className="auth">
      <div className="auth-container">
        <p>Add another way to log in using any of the following services. </p>
        <div className="sign-options">
          <div onClick={handleGoogleSignIn} className="single-option">
            <img alt="google" src={google} />
            <p>{loading ? "Signing in..." : "Login with Google"}</p>
          </div>
          <div className="single-option" onClick={handleGitHubSignIn}>
            <img alt="github" src={github} />
            <p>Login with GitHub</p>
          </div>
        </div>

        <div className="auth-login">
          <div className="auth-login-container">
            {!forgotPassword && !register ? ( // Display login and register if both are false
              <>
                <div className="input-field">
                  <p>Email</p>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="text"
                  />
                </div>
                <div className="input-field">
                  <p>Password</p>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                  />
                </div>
                <button
                  onClick={handleSignIn}
                  disabled={loading}
                  style={{
                    marginTop: "10px",
                  }}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </>
            ) : (
              <>
                {register && ( // Display username, email, and password input for register
                  <>
                    <div className="input-field">
                      <p>Username</p>
                      <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        type="text"
                      />
                    </div>
                    <div className="input-field">
                      <p>Email</p>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="text"
                      />
                    </div>
                    <div className="input-field">
                      <p>Password</p>
                      <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                      />
                    </div>
                  </>
                )}
                {!register &&
                  !forgotPassword && ( // Display email and password input for login
                    <>
                      <div className="input-field">
                        <p>Email</p>
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          type="text"
                        />
                      </div>
                      <div className="input-field">
                        <p>Password</p>
                        <input
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type="password"
                        />
                      </div>
                    </>
                  )}
                {forgotPassword && ( // Display email input for forgot password
                  <>
                    <div className="input-field">
                      <p>Enter your email to reset the password</p>
                      <input
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        type="text"
                      />
                    </div>
                  </>
                )}
                <button
                  onClick={
                    register
                      ? handleRegister
                      : forgotPassword
                      ? handleSendResetEmail
                      : handleSignIn
                  }
                  disabled={loading}
                  style={{
                    marginTop: "10px",
                  }}
                >
                  {loading
                    ? register
                      ? "Registering..."
                      : forgotPassword
                      ? "Sending..."
                      : "Logging in..."
                    : register
                    ? "Register"
                    : forgotPassword
                    ? "Send Reset Email"
                    : "Login"}
                </button>
              </>
            )}

            <p
              onClick={() => {
                setRegister(!register);
                setForgotPassword(false); // Reset forgotPassword state when toggling register
                setError("");
              }}
              style={{
                marginTop: "10px",
                textAlign: "center",
                color: "#0095ff",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              {register ? "Login" : "Register"} ?
            </p>

            {!forgotPassword && (
              <p
                onClick={() => {
                  setForgotPassword(true);
                  setRegister(false);
                  setError("");
                }}
                style={{
                  marginTop: "10px",
                  textAlign: "center",
                  color: "#0095ff",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Forgot Password?
              </p>
            )}
          </div>
        </div>

        {error !== "" && (
          <p
            style={{
              color: "red",
              fontSize: "14px",
            }}
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default Index;
