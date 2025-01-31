
const HeroSection = () => {
  return (
    <div className="bg-white py-28 p-20 mt-[-4rem]">
      <div className="container mx-auto flex justify-between items-center">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold mb-4">Elevate Your Style</h1>
          <p className="text-lg text-gray-600 mb-8">
            Discover clothing designed to complement your lifestyle.
          </p>
          <a
            href="#"
            className="inline-block bg-black text-white py-4 px-8 rounded-full hover:bg-gray-800 transition-colors duration-300"
          >
            Shop Now
          </a>
        </div>
        <div className="relative w-full max-w-md">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQ-1nbi6Bey8qNFHKu-i_UqPkmHOeuh5o5iaYKz0jCt4rQH0PEhEPl5ByJzHc_JV6Za8E&usqp=CAU"
            alt="Hero Image"
            className="w-full h-full object-cover rounded-2xl shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;