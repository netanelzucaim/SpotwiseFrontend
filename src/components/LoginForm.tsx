import { FC } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import userService, { User } from "../services/user_service";
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginForm.css'

interface FormData {
  username: string;
  password: string;
}

const LoginForm: FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const navigate = useNavigate();

  const onSubmit = (data: FormData) => {
    console.log(data);
    const user: User = {
      username: data.username,
      password: data.password,
    };
    userService.login(user)
      .then((response) => {
        console.log(response);
        navigate('/home'); // Navigate to /home on successful login
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="login-container">
      <div className="logo">
        <h1 className="logoName">SpotWise</h1>
        <p className="tagline">Your Vision <br></br> The Perfect Location</p>
      </div>
      <h2 className="subtitle; stroke-text">Sign in & Continue your journey</h2>

      <form className="login-form">
        <input type="text" className="input-field" placeholder="Email" />
        <input type="password" className="input-field" placeholder="Password" />
        <button type="submit" className="sign-in-button">Sign in</button>
      </form>


      <div className="signup-container">
          <p className="stroke-text">
              Don't have an account? <a href="/signup" className="stroke-text">Sign Up</a>
          </p>
      </div>
    </div>
  );
};

export default LoginForm;