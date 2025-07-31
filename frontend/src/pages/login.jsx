import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import LoginForm from "../forms/LoginForm";
import "../style/login.css";

function Login() {
  return (
    <>
      <Header />
      <main className="login-page">
        <div className="login-background">
          <LoginForm />
        </div>
      </main>
      <Footer />
    </>
  );
}

export default React.memo(Login);