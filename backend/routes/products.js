const express = require('express');
const router = express.Router();
const {
  database
} = require('../config/helpers');


/* GET all products */
router.get('/', function (req, res) {
  // if (database) console.log('connected');

  //Sending page query is mandatory, http://localhost:3000/api/products?page=1
  let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1;
  const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10;
  let startValue;
  let endValue;
  if (page > 0) {
    startValue = (page * limit) - limit; // 0, 10, 20, 30
    endValue = page * limit; // 10, 20, 30, 40
  } else {
    startValue = 0;
    endValue = 10;
  }


  database.table('db.products as p').join([{
    table: "db.categories as c",
    on: 'c.id= p.cat_id'
  }]).withFields([
    'c.title as category',
    'p.title as name',
    'p.price',
    'p.quantity',
    'p.description',
    'p.image',
    'p.id'
  ]).slice(startValue, endValue).sort({
    id: .1
  }).getAll().then(prods => {
    if (prods.length > 0) {
      res.status(200).json({
        count: prods.length,
        products: prods
      })
    } else {
      res.json({
        message: 'No product found'
      });
    }
  }).catch(err => console.log(err));

});

/* GET one product */
router.get('/:prodId', (req, res) => {
  let productId = req.params.prodId;

  database.table('db.products as p').join([{
      table: "db.categories as c",
      on: 'c.id= p.cat_id'
    }]).withFields([
      'c.title as category',
      'p.title as name',
      'p.price',
      'p.quantity',
      'p.description',
      'p.image',
      'p.images',
      'p.id'
    ])
    .filter({
      'p.id': productId
    })
    .get().then(prod => {
      if (prod) {
        res.status(200).json({
          prod
        })
      } else {
        res.json({
          message: 'No product found'
        });
      }
    }).catch(err => console.log(err));
})
module.exports = router;