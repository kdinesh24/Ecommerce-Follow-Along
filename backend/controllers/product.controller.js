const Product = require('../models/product.model');
const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

const bufferToStream = (buffer) => {
  const readable = new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    },
  });
  return readable;
};

exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, category, subcategory } = req.body;
        console.log({name, description, price, category, subcategory})
        console.log(req.body)
        
        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        console.log('File received:', req.file); 

      
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "ecommerce-products",
                resource_type: "auto" 
            },
            async (error, result) => {
                if (error) {
                    console.error('Cloudinary Upload Error:', error);
                    return res.status(500).json({ message: "Error uploading image", error: error.message });
                }

                console.log('Cloudinary result:', result); 

                const newProduct = new Product({
                    name,
                    description,
                    price,
                    category,
                    subcategory,
                    imageUrl: result.secure_url,
                    cloudinaryId: result.public_id
                });

                const savedProduct = await newProduct.save();
                console.log('Saved product:', savedProduct); 
                res.status(201).json(savedProduct);
            }
        );

        bufferToStream(req.file.buffer).pipe(stream);
    } catch (error) {
        console.error('Server Error:', error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        
        console.log('Update Request Body:', req.body);
        console.log('Update Request File:', req.file);
        
       
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "No update data provided" });
        }

       
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

       
        const updateData = {};
        
        if (req.body.name) updateData.name = req.body.name;
        if (req.body.description) updateData.description = req.body.description;
        if (req.body.price) {
            updateData.price = typeof req.body.price === 'string' 
                ? parseFloat(req.body.price) 
                : req.body.price;
        }
        if (req.body.category) updateData.category = req.body.category;
        if (req.body.subcategory) updateData.subcategory = req.body.subcategory;
        
        
        updateData.imageUrl = existingProduct.imageUrl;
        updateData.cloudinaryId = existingProduct.cloudinaryId;

      
        if (req.file) {
            try {
              
                if (existingProduct.cloudinaryId) {
                    await cloudinary.uploader.destroy(existingProduct.cloudinaryId);
                }

            
                const uploadResult = await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {
                            folder: "ecommerce-products",
                            resource_type: "auto"
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    bufferToStream(req.file.buffer).pipe(stream);
                });

              
                updateData.imageUrl = uploadResult.secure_url;
                updateData.cloudinaryId = uploadResult.public_id;
            } catch (cloudinaryError) {
                console.error('Cloudinary Error:', cloudinaryError);
                return res.status(500).json({ message: "Error uploading image", error: cloudinaryError.message });
            }
        }

        console.log('Final Update Data:', updateData);

       
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { $set: updateData },
            { 
                new: true,
                runValidators: true,
                lean: true
            }
        );

        console.log('Updated Product:', updatedProduct);
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Update Error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

       
        if (product.cloudinaryId) {
            await cloudinary.uploader.destroy(product.cloudinaryId);
        }

        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
