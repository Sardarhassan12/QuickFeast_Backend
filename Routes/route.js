const express = require('express');
const route = express.Router();
const User = require('../Model/UserModel');
const Item = require('../Model/ItemModel');
const Menu = require('../Model/MenuModel');
const Order = require('../Model/OrderModel');
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminUser = require('../Model/User');


route.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Login attempt:", email); // 🪵 Log incoming request

    const user = await AdminUser.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log("Login successful:", user.email);
    res.json({
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Server error during login:", err);
    res.status(500).json({ message: 'Server error' });
  }
});


route.post('/signup', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user = await AdminUser.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new AdminUser({ email, password, role: role || 'user' }); // Correct model used
    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


route.get('/', (req, res) => {
    res.send("Hello World !")
})

// User Controller Logic
route.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message, success: false })
    }
})

route.post('/users', async (req, res) => {
    try {
        const { name, userName, role, password } = req.body;
        const newUser = new User({ name, userName, role, password });
        await newUser.save();
        res.status(200).json({
            success: true,
            user: newUser
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
})

// Item Controller Logic
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'Uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + file.originalname
        cb(null, uniqueName)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed (.jpeg, .jpg, .png, .webp)'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }
});

route.post('/item', upload.single('image'), async (req, res) => {
    try {
        const { itemName, description, price, category, availability } = req.body;

        if (!itemName || !description || !price || !category || !availability) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }

        if (!['available', 'notAvailable'].includes(availability)) {
            return res.status(400).json({ success: false, message: "Invalid availability value" });
        }

        const newItem = new Item({
            itemName,
            description,
            price,
            category,
            availability,
            imagePath: `/Uploads/${req.file.filename}`
        });

        await newItem.save();
        res.status(201).json({ success: true, item: newItem });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

route.get('/items', async (req, res) => {
    try {
        const { menuId } = req.query;
        let query = {};
        if (menuId) {
            query.menuId = menuId;
        }
        const items = await Item.find(query);
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Menu Controller Logic
route.post('/menu', async (req, res) => {
    try {
        const { title, itemIds } = req.body;

        const newMenu = await Menu.create({ title });

        await Item.updateMany(
            { _id: { $in: itemIds } },
            { $set: { menuId: newMenu._id } }
        );

        res.json({ success: true, menuId: newMenu._id });
    } catch (error) {
        console.error('Menu creation error:', error);
        res.status(500).json({ success: false, message: 'Error creating menu' });
    }
});

route.get('/menus', async (req, res) => {
    try {
        const menus = await Menu.find().lean();
        const allItems = await Item.find().lean();

        const enrichedMenus = menus.map(menu => {
            const itemsForMenu = allItems.filter(item => String(item.menuId) === String(menu._id));
            const categories = [...new Set(itemsForMenu.map(item => item.category))];
            return {
                ...menu,
                itemCount: itemsForMenu.length,
                categoryCount: categories.length,
                image: itemsForMenu.length ? itemsForMenu[Math.floor(Math.random() * itemsForMenu.length)].imagePath : null
            };
        });

        res.json(enrichedMenus);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch menus' });
    }
});

// QR Code URL Generation Endpoint
route.post('/generate-qr', async (req, res) => {
    try {
        const { menuId, tableCount } = req.body;

        if (!menuId || !tableCount || tableCount <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid menuId or tableCount' });
        }

        // Verify menu exists
        const menu = await Menu.findById(menuId);
        if (!menu) {
            return res.status(404).json({ success: false, message: 'Menu not found' });
        }

        // Generate URLs
        const baseUrl = 'http://localhost:5173/user';
        const tableLinks = Array.from({ length: tableCount }, (_, i) => ({
            tableNumber: i + 1,
            url: `${baseUrl}/${menuId}/table/${i + 1}`
        }));

        res.json({ success: true, tableLinks });
    } catch (error) {
        console.error('QR generation error:', error);
        res.status(500).json({ success: false, message: 'Error generating QR URLs' });
    }
});

// Order Controller Logic
route.post('/orders', async (req, res) => {
    try {
        const { menuId, tableNumber, items } = req.body;

        if (!menuId || !tableNumber || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid order data' });
        }

        const menu = await Menu.findById(menuId);
        if (!menu) {
            return res.status(404).json({ success: false, message: 'Menu not found' });
        }

        const itemIds = items.map(item => item.itemId);
        const validItems = await Item.find({ _id: { $in: itemIds }, menuId });
        if (validItems.length !== itemIds.length) {
            return res.status(400).json({ success: false, message: 'Some items are invalid or not part of the menu' });
        }

        const newOrder = new Order({
            menuId,
            tableNumber,
            items
        });

        await newOrder.save();
        res.status(201).json({ success: true, order: newOrder });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ success: false, message: 'Error creating order' });
    }
});

route.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find().lean();
        const items = await Item.find().lean();

        const enrichedOrders = await Promise.all(orders.map(async (order) => {
            const orderItems = order.items.map(item => {
                const itemDetails = items.find(i => i._id.toString() === item.itemId.toString());
                return {
                    ...item,
                    itemName: itemDetails ? itemDetails.itemName : 'Unknown Item',
                    price: itemDetails ? itemDetails.price : 0
                };
            });
            const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            return {
                ...order,
                items: orderItems,
                totalAmount
            };
        }));

        res.status(200).json(enrichedOrders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, message: 'Error fetching orders' });
    }
});

route.patch('/orders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({ success: true, order: updatedOrder });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ success: false, message: 'Error updating order status' });
    }
});

module.exports = route;