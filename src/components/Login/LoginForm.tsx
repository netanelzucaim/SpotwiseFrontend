import { FC } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import userService, { IUser } from "../../services/user_service";
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginForm.css'

interface FormData {
  email: string;
  password: string;
}

const LoginForm: FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const navigate = useNavigate();

  const onSubmit = (data: FormData) => {
    console.log(data);
    const user: IUser = {
      email: data.email,
      password: data.password,
    };
    userService.login(user)
      .then((response) => {
        console.log(response);
        navigate('/home'); 
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

      <form className="login-form row g-3 needs-validation" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <input
          type="text"
          className={`input-field form-control ${errors.email ? 'is-invalid' : ''}`}
          placeholder="Email"
          {...register("email", { 
            required: "Email is required",
            pattern: { 
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
              message: "Invalid email format" 
            } 
          })}
        />
        {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
      </div>
      <div>
        <input
          type="password"
          className={`input-field form-control ${errors.password ? 'is-invalid' : ''}`}
          placeholder="Password"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && <div className="invalid-feedback">{errors.password.message}</div>} 
      </div>
      <button type="submit" className="sign-in-button btn btn-primary">Sign in</button> 
    </form>


      <div className="signup-container">
          <p className="stroke-text">
              Don't have an account? <a href="#" className="stroke-text" onClick={() => navigate('/register')}>Sign Up</a>
          </p>
      </div>
    </div>
  );
};

export default LoginForm;