import { FC } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import userService, { User } from "../services/user_service";
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-sm" style={{ width: '350px' }}>
        <h2 className="text-center">Challenge Zone</h2>
        <p className="text-center text-muted">Sign in</p>
        <p className="text-center text-muted">Enter your username and sign in</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && <small className="text-danger">{errors.username.message}</small>}
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && <small className="text-danger">{errors.password.message}</small>}
          </div>
          <button type="submit" className="btn btn-dark w-100">Continue</button>
        </form>
        <div className="text-center mt-3">
          <p className="text-muted">Don't have an account? <a href="#" className="text-dark" onClick={() => navigate('/register')}>Sign up</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;