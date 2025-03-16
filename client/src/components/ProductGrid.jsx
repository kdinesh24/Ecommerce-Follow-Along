import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

const ProductGrid = ({ products }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white px-4 sm:px-6 lg:px-20 pb-20 mt-[-3rem]"
    >
      <div className="container mx-auto max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-8 ml-[-1rem]"
        >
          Featured Products
        </motion.h2>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-7 gap-y-10"
        >
          {products.map((product) => (
            <ProductCard key={product.id} {...product} _id={product._id} />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ProductGrid;