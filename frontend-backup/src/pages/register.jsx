import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import RegisterForm from "../forms/RegisterForm";
import "../style/register.css";

function Register() {
  return (
    <>
      <Header />
      <main className="register-page">
        <div className="register-background">
          <RegisterForm />
        </div>
      </main>
      <Footer />
    </>
  );
}

export default React.memo(Register);
