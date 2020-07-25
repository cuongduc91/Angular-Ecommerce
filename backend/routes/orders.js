const express = require('express');
const router = express.Router();
const {
  database
} = require('./../config/helpers');

/* GET orders listing. */
router.get('/', (req, res) => {
  database.table('db.view_order')
    .withFields(['id', 'title', 'description', 'price', 'username']).sort({
      id: .1
    })
    .getAll()
    .then(orders => {
      if (orders.length > 0) {
        res.json(orders);
      } else {
        res.json({
          message: "No order found"
        });
      }
    }).catch(err => console.log(err))
});

/* GET single order*/
router.get('/:id', async (req, res) => {
  database.table('db.view_order')
    .withFields(['id', 'title', 'description', 'price', 'username']).sort({
      id: .1
    })
    .filter({
      'id': req.params.id
    })
    .getAll()
    .then(orders => {
      if (orders.length > 0) {
        res.json(orders);
      } else {
        res.json({
          message: "No order found"
        });
      }
    }).catch(err => console.log(err))
})

/* Place new order*/
router.post('/new', async (req, res) => {
  let {
    userId,
    products
  } = req.body;
  // products = JSON.parse(products);
  // console.log(products);
  if (userId !== null && userId > 0) {
    database.table('db.orders')
      .insert({
        user_id: userId
      }).then((newOrderId) => {
        if (newOrderId > 0) {
          products.forEach(async (p) => {
            let data = await database.table('db.products')
              .filter({
                id: p.id
              })
              .withFields(['quantity'])
              .get();
            let inCart = parseInt(p.incart);
            if (data.quantity > 0) {
              data.quantity = data.quantity - inCart;
              if (data.quantity < 0) data.quantity = 0;
            } else {
              data.quantity = 0;
            }
            // Insert order details w.r.t the newly created order Id
            database.table('db.orders_details')
              .insert({
                order_id: newOrderId,
                product_id: p.id,
                quantity: inCart
              }).then(newId => {
                database.table('db.products')
                  .filter({
                    id: p.id
                  })
                  .update({
                    quantity: data.quantity
                  })
                  .then(successNum => {})
                  .catch(err => console.log(err));
              })
          });

        } else {
          res.json({
            message: 'New order failed while adding order details',
            success: false
          });
        }
        res.json({
          message: `Order successfully placed with order id ${newOrderId}`,
          success: true,
          order_id: newOrderId,
          products: products
        })
      }).catch(err => console.log(err));
  } else {
    res.json({
      message: 'New order failed',
      success: false
    });
  }

})
// Payment Gateway
router.post('/payment', (req, res) => {
  setTimeout(() => {
    res.status(200).json({
      success: true
    });
  }, 3000)
});
module.exports = router;