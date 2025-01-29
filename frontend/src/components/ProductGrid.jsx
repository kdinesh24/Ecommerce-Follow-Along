import { Heart } from 'lucide-react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products }) => {
  return (
    <section className="bg-white px-4 sm:px-6 lg:px-20 pb-20 mt-[-3rem]">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-3xl font-bold mb-8 ml-[-1rem]">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-7 gap-y-10">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;