require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error(err));

// --- MODELS ---
const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true } // Aluthin ekathu kala
});
const Item = mongoose.model('Item', ItemSchema);

const SaleSchema = new mongoose.Schema({
    items: Array,
    totalAmount: Number,
    date: { type: Date, default: Date.now }
});
const Sale = mongoose.model('Sale', SaleSchema);

// --- ROUTES ---
app.get('/api/items', async (req, res) => {
    const items = await Item.find();
    res.json(items);
});

app.post('/api/items', async (req, res) => {
    const newItem = new Item(req.body);
    await newItem.save();
    res.json(newItem);
});

app.delete('/api/items/:id', async (req, res) => {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

app.post('/api/sales', async (req, res) => {
    const newSale = new Sale(req.body);
    await newSale.save();
    res.json(newSale);
});

app.get('/api/sales/daily', async (req, res) => {
    const start = new Date(); start.setHours(0,0,0,0);
    const end = new Date(); end.setHours(23,59,59,999);
    const sales = await Sale.find({ date: { $gte: start, $lte: end } });
    res.json(sales);
});

app.listen(5000, () => console.log("🚀 Server on 5000"));