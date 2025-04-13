import { Link } from 'react-router-dom';

const BrandHeading = () => {
  return (
    <header className="flex flex-col items-center text-center p-4 text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <Link to="/home" className="text-white text-decoration-none">
        <h1 className="fw-bold">SpotWise</h1>
      </Link>
      <p className="text-sm text-gray-200">
        Your Vision, The Perfect Location.
      </p>
    </header>
  );
};

export default BrandHeading;
