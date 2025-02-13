import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import userService from "../services/user_service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import 'bootstrap/dist/css/bootstrap.min.css';
import imageService from "../services/business_service";

interface FormData {
  username: string;
  password: string;
  img: File[];
}

const RegistrationForm: FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { register, handleSubmit, watch } = useForm<FormData>();
  const [img] = watch(["img"]);
  const inputFileRef: { current: HTMLInputElement | null } = { current: null };
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {

      const user = {
        username: data.username,
        password: data.password,
        email: data.email,
        phone: data.phone
      };

      const { request } = userService.register(user);
      await request;
      console.log('User registered successfully');

      // Redirect to the login screen after successful registration
      navigate("/login");
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage("Internal error, did you enter all fields?");
      }
      console.error(error);
    }
  };

  useEffect(() => {
    if (img != null && img[0]) {
      setSelectedImage(img[0]);
    }
  }, [img]);

  const { ref, ...restRegisterParams } = register("img");

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-sm" style={{ width: '350px' }}>
        <h2 className="text-center">Register</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              {...register("username", { required: "Username is required" })}
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Email"
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Phone"
            />
          </div>

          {errorMessage && (
            <div className="text-danger text-center mb-3">{errorMessage}</div>
          )}
          <button type="submit" className="btn btn-primary w-100">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;