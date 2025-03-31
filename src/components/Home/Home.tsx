import React from "react";

const HomePage: React.FC = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center text-white relative flex flex-col items-center"
      style={{ backgroundImage: "url('/utils/Spotwise_background.png')" }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Header */}
      <header className="relative w-full max-w-6xl flex justify-between items-center p-6">
        <div className="text-left">
          <h1 className="text-4xl font-bold">SpotWise</h1>
          <p className="text-sm">Your Vision, The Perfect Location.</p>
        </div>
        <nav className="flex space-x-4">
          <button className="px-4 py-2 bg-white text-black rounded-full">Home</button>
          <button className="px-4 py-2 bg-white text-black rounded-full">Why SpotWise</button>
          <button className="px-4 py-2 bg-white text-black rounded-full">Success Stories</button>
          <button className="px-4 py-2 bg-white text-black rounded-full">Contact</button>
          <button className="px-4 py-2 bg-green-500 text-white rounded-full">Login</button>
        </nav>
      </header>
      
      {/* Hero Section */}
      <section className="relative text-center py-12 px-6 max-w-3xl">
        <h2 className="text-5xl font-semibold leading-tight">
          Find the perfect spot <br /> for your business idea
        </h2>
        <p className="mt-4 text-lg">
          SpotWise provides AI recommendations for your business real estate location for its best success by its location.
        </p>
      </section>
      
      {/* Features Section */}
      <section className="relative flex justify-center gap-6 p-10 max-w-6xl flex-row overflow-x-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="w-64 h-80 p-6 bg-gradient-to-b from-white to-gray-200 text-gray-900 rounded-2xl text-center shadow-lg flex flex-col items-center justify-between transform hover:scale-105 transition duration-300"
          >
            <div className="text-7xl mb-4">{feature.icon}</div>
            <h3 className="text-2xl font-bold">{feature.title}</h3>
            <p className="mt-2 text-base text-gray-700">{feature.description}</p>
            <button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-full w-3/4 hover:bg-blue-700 transition duration-300">
              {feature.buttonText}
            </button>
          </div>
        ))}
      </section>
    </div>
  );
};

const features = [
  {
    icon: "🏡",
    title: "Discover Locations",
    description: "Look at the listings of real estate",
    buttonText: "Discover"
  },
  {
    icon: "🔍",
    title: "Find What’s Best For You",
    description: "Get AI recommendation on the real estate listed here for your business",
    buttonText: "Find Now"
  },
  {
    icon: "🗺️",
    title: "Live Map",
    description: "Look at the live map of the locations listed on the site",
    buttonText: "Explore Map"
  },
  {
    icon: "📢",
    title: "List Your Property",
    description: "Come and list your property so more businesses can discover it",
    buttonText: "List It"
  }
];

export default HomePage;