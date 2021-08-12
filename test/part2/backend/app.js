const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config()
const Product = require('./models/product');

const app = express();

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });

/**
 * Setup CORS
 */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

/**
 * Parse in JSON the request body
 */
app.use(bodyParser.json());

app.put('/api/products/:id', (req, res, next) => {
  const product = new Product({
    _id: req.params.id,
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    inStock: req.body.inStock
  });
  Product.updateOne({_id: req.params.id}, product).then(
    () => {
      res.status(201).json({
        message: 'Modified!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});

app.delete('/api/products/:id', (req, res, next) => {
  Product.deleteOne({_id: req.params.id}).then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});

app.get('/api/products/:id', (req, res, next) => {
  Product.findOne({
    _id: req.params.id
  }).then(
    (product) => {
      res.status(200).json({product});
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
});

app.post('/api/products', (req, res, next) => {
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    inStock: req.body.inStock
  });
  product.save().then(
    (result) => {
      res.status(201).json({
        product: result
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});

app.use('/api/products', (req, res, next) => {
  Product.find().then(
    (products) => {
      res.status(200).json({
        products
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});

module.exports = app;