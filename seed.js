const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agrilink';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB...');

    // Clear existing collections
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('[Seed] Cleared existing database records.');

    // Create Farmers
    const farmer1 = await User.create({
      name: 'Ramesh GreenFields Farm',
      email: 'farmer@agrilink.com',
      password: 'password123',
      role: 'farmer',
      farmLocation: 'Punjab, India',
      phone: '+91 98765 43210',
    });

    const farmer2 = await User.create({
      name: 'Sunita Fresh Orchards',
      email: 'farmer2@agrilink.com',
      password: 'password123',
      role: 'farmer',
      farmLocation: 'Himachal Pradesh, India',
      phone: '+91 98123 45678',
    });

    // Create Buyers
    const buyer1 = await User.create({
      name: 'Apex Supermarkets Ltd',
      email: 'buyer@agrilink.com',
      password: 'password123',
      role: 'buyer',
      buyerType: 'retailer',
      phone: '+91 91234 56789',
    });

    const buyer2 = await User.create({
      name: 'Global Foods Wholesale',
      email: 'wholesaler@agrilink.com',
      password: 'password123',
      role: 'buyer',
      buyerType: 'wholesaler',
      phone: '+91 99887 76655',
    });

    console.log('[Seed] Created sample users (Farmers & Buyers).');

    // Create Products
    const products = await Product.create([
      {
        name: 'Organic Farm Tomatoes',
        description: 'Vine-ripened red organic tomatoes, pesticide-free, freshly harvested daily.',
        price: 35,
        unit: 'kg',
        quantity: 500,
        category: 'Vegetables',
        images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'],
        location: 'Punjab, India',
        farmerId: farmer1._id,
      },
      {
        name: 'Golden Sharbati Wheat',
        description: 'Premium quality grain Sharbati wheat, high protein content, sun-dried naturally.',
        price: 28,
        unit: 'kg',
        quantity: 2000,
        category: 'Grains',
        images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80'],
        location: 'Punjab, India',
        farmerId: farmer1._id,
      },
      {
        name: 'Royal Shimla Red Apples',
        description: 'Crisp, sweet, handpicked apples straight from high altitude Shimla orchards.',
        price: 120,
        unit: 'kg',
        quantity: 800,
        category: 'Fruits',
        images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80'],
        location: 'Himachal Pradesh, India',
        farmerId: farmer2._id,
      },
      {
        name: 'Organic Yellow Arhar Dal',
        description: 'Unpolished split pigeon peas, rich in dietary fiber and essential plant proteins.',
        price: 110,
        unit: 'kg',
        quantity: 450,
        category: 'Pulses',
        images: ['https://images.unsplash.com/photo-1515543904379-3d757afe72e3?auto=format&fit=crop&w=800&q=80'],
        location: 'Punjab, India',
        farmerId: farmer1._id,
      },
      {
        name: 'Fresh Pure Cow Milk',
        description: 'Raw, unpasteurized A2 cow milk delivered in sealed hygienic temperature-controlled containers.',
        price: 65,
        unit: 'litre',
        quantity: 150,
        category: 'Dairy',
        images: ['https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?auto=format&fit=crop&w=800&q=80'],
        location: 'Punjab, India',
        farmerId: farmer1._id,
      },
      {
        name: 'Organic Whole Cardamom (Elaichi)',
        description: 'Fragrant green cardamom pods harvested from pristine organic mountain slopes.',
        price: 1800,
        unit: 'kg',
        quantity: 40,
        category: 'Spices',
        images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'],
        location: 'Himachal Pradesh, India',
        farmerId: farmer2._id,
      },
    ]);

    console.log('[Seed] Created sample product listings.');

    // Create Sample Orders
    await Order.create([
      {
        buyerId: buyer1._id,
        items: [
          {
            product: products[0]._id,
            productName: products[0].name,
            unit: products[0].unit,
            quantity: 50,
            unitPrice: products[0].price,
            farmerId: farmer1._id,
          },
          {
            product: products[1]._id,
            productName: products[1].name,
            unit: products[1].unit,
            quantity: 100,
            unitPrice: products[1].price,
            farmerId: farmer1._id,
          },
        ],
        totalAmount: 50 * 35 + 100 * 28, // 1750 + 2800 = 4550
        deliveryAddress: 'Building A-12, Central Mart, Delhi, India',
        status: 'delivered',
        farmerIds: [farmer1._id],
      },
      {
        buyerId: buyer2._id,
        items: [
          {
            product: products[2]._id,
            productName: products[2].name,
            unit: products[2].unit,
            quantity: 200,
            unitPrice: products[2].price,
            farmerId: farmer2._id,
          },
        ],
        totalAmount: 200 * 120, // 24000
        deliveryAddress: 'Wholesale Depot #4, Market Road, Mumbai, India',
        status: 'confirmed',
        farmerIds: [farmer2._id],
      },
    ]);

    console.log('[Seed] Created sample orders.');

    console.log('\n======================================================');
    console.log('✅ DEMO SEED COMPLETED SUCCESSFULLY!');
    console.log('======================================================');
    console.log('Farmer Credentials:');
    console.log('  Email: farmer@agrilink.com | Password: password123');
    console.log('  Email: farmer2@agrilink.com | Password: password123');
    console.log('Buyer Credentials:');
    console.log('  Email: buyer@agrilink.com  | Password: password123');
    console.log('  Email: wholesaler@agrilink.com | Password: password123');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedData();
