const Product = require('../models/Product');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'agrilink_products' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
};

// Fallback high quality produce images when Cloudinary is omitted
const DEFAULT_PRODUCE_IMAGES = {
  Vegetables: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
  Fruits: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
  Grains: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
  Pulses: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e3?auto=format&fit=crop&w=800&q=80',
  Dairy: 'https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?auto=format&fit=crop&w=800&q=80',
  Organic: 'https://images.unsplash.com/photo-1595855759920-8658239e7b02?auto=format&fit=crop&w=800&q=80',
  Spices: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
};

// @desc    Get all products (with search, category, price range, location filters)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, location, sort } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { price: 1 };
    if (sort === 'price_desc') sortOptions = { price: -1 };
    if (sort === 'oldest') sortOptions = { createdAt: 1 };

    const products = await Product.find(query)
      .populate('farmerId', 'name farmLocation phone email')
      .sort(sortOptions);

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('[getProducts Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get products listed by logged-in farmer
// @route   GET /api/products/farmer
// @access  Private (Farmer only)
const getFarmerProducts = async (req, res) => {
  try {
    const products = await Product.find({ farmerId: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'farmerId',
      'name farmLocation phone email'
    );
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new product listing
// @route   POST /api/products
// @access  Private (Farmer only)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, unit, quantity, category, location, imageUrl } = req.body;

    if (!name || !description || !price || !quantity || !category || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (name, description, price, quantity, category, location)',
      });
    }

    let images = [];

    // Check if an image file was uploaded via Multer
    if (req.file) {
      if (isCloudinaryConfigured()) {
        try {
          const uploadedUrl = await uploadToCloudinary(req.file.buffer);
          images.push(uploadedUrl);
        } catch (uploadError) {
          console.error('[Cloudinary Upload Error]', uploadError);
          images.push(DEFAULT_PRODUCE_IMAGES[category] || DEFAULT_PRODUCE_IMAGES.Vegetables);
        }
      } else {
        // Create base64 data URI or default fallback image
        const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        images.push(base64Image);
      }
    } else if (imageUrl) {
      images.push(imageUrl);
    } else {
      images.push(DEFAULT_PRODUCE_IMAGES[category] || DEFAULT_PRODUCE_IMAGES.Vegetables);
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      unit: unit || 'kg',
      quantity: Number(quantity),
      category,
      images,
      location,
      farmerId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Product listed successfully',
      product,
    });
  } catch (error) {
    console.error('[createProduct Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a product listing
// @route   PUT /api/products/:id
// @access  Private (Farmer only - must own product)
const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Verify ownership
    if (product.farmerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this product listing',
      });
    }

    const { name, description, price, unit, quantity, category, location, imageUrl } = req.body;

    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (unit) product.unit = unit;
    if (quantity !== undefined) product.quantity = Number(quantity);
    if (category) product.category = category;
    if (location) product.location = location;

    if (req.file) {
      if (isCloudinaryConfigured()) {
        try {
          const uploadedUrl = await uploadToCloudinary(req.file.buffer);
          product.images = [uploadedUrl];
        } catch (err) {
          product.images = [DEFAULT_PRODUCE_IMAGES[product.category] || DEFAULT_PRODUCE_IMAGES.Vegetables];
        }
      } else {
        const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        product.images = [base64Image];
      }
    } else if (imageUrl) {
      product.images = [imageUrl];
    }

    await product.save();

    res.json({
      success: true,
      message: 'Product listing updated successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product listing
// @route   DELETE /api/products/:id
// @access  Private (Farmer only - must own product)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.farmerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this product listing',
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product listing deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getFarmerProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
