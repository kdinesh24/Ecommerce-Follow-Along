
const AboutPage = () => {
  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">About Us</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-600">
              Makers Vault is a fashion brand dedicated to elevating your personal style. Founded in 2015, we've been
              crafting high-quality, timeless pieces that complement the modern lifestyle. Our mission is to empower
              individuals to express their unique sense of fashion and confidence.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Values</h2>
            <ul className="space-y-2 text-gray-600">
              <li>Commitment to quality and craftsmanship</li>
              <li>Sustainable and ethical production practices</li>
              <li>Exceptional customer service and experience</li>
              <li>Fostering a sense of community and belonging</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;