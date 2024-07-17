const express = require('express');
const Stripe = require('stripe');
const { Order, OrderItem } = require('../models/order');
const Cart = require('../models/cart');
const stripe = Stripe(process.env.STRIPE_KEY);
require('dotenv').config();
const router = express.Router();

// Middleware to parse JSON bodies
router.use(express.json());

router.post('/create-checkout-session', async (req, res) => {
    try {
        const { cartItems, userId } = req.body;
        const customer = await stripe.customers.create({
            metadata: {
                userId: userId,
                cart: JSON.stringify(cartItems)
            }
        }
        )

        const line_items = cartItems.map((item) => {
            return {
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: item.name,
                        description: item.description,
                        metadata: {
                            id: item.id,
                        },
                    },
                    unit_amount: item.new_price * 100,
                },
                quantity: item.quantity,
            };
        });

        const session = await stripe.checkout.sessions.create({
            shipping_address_collection: {
                allowed_countries: ['US', 'CA', 'FR', 'TN'],
            },
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: 0,
                            currency: 'eur',
                        },
                        display_name: 'Free shipping',
                        delivery_estimate: {
                            minimum: {
                                unit: 'business_day',
                                value: 5,
                            },
                            maximum: {
                                unit: 'business_day',
                                value: 7,
                            },
                        },
                    },
                },
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: 1500,
                            currency: 'eur',
                        },
                        display_name: 'Next day air',
                        delivery_estimate: {
                            minimum: {
                                unit: 'business_day',
                                value: 1,
                            },
                            maximum: {
                                unit: 'business_day',
                                value: 1,
                            },
                        },
                    },
                },
            ],
            phone_number_collection: {
                enabled: true,
            },
            customer: customer.id,
            line_items,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URI}/checkout_success`,
            cancel_url: `${process.env.CLIENT_URI}/cart/${userId}`,
        });

        res.send({ url: session.url });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// Create order function

const createOrder = async (customer, data, userId) => {
    const Items = JSON.parse(customer.metadata.cart);

    const products = Items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
    }));

    try {
        const newOrder = new Order({
            userId: customer.metadata.userId,
            customerId: data.customer,
            paymentIntentId: data.payment_intent,
            products: products, // JSON object for products
            subtotal: data.amount_subtotal / 100,
            total: data.amount_total / 100,
            shipping: data.customer_details, // JSON object for shipping
            payment_status: data.payment_status,
            //             delivery_status: data.delivery_status,
            // date: data.date,
        });

        const savedOrder = await newOrder.save();
        console.log("Processed Order:", savedOrder);

        // Create order items
        for (let item of Items) {
            const orderItem = await OrderItem.create({
                orderId: savedOrder.id,
                productId: item.id,
                quantity: item.quantity,
                price: item.new_price
            });

            if (!orderItem) {
                throw new Error(`Failed to create order item for productId ${item.productId}`);
            }
        }
        await Cart.destroy({ where: { userId } });
        res.status(201).json(savedOrder);

    } catch (err) {
        console.log(err);
    }
};


// Stripe webhoook

router.post(
    "/webhook",
    express.json({ type: "application/json" }),
    async (req, res) => {
        let data;
        let eventType;

        // Check if webhook signing is configured.
        let webhookSecret;
        //webhookSecret = process.env.STRIPE_WEB_HOOK;

        if (webhookSecret) {
            // Retrieve the event by verifying the signature using the raw body and secret.
            let event;
            let signature = req.headers["stripe-signature"];

            try {
                event = stripe.webhooks.constructEvent(
                    req.body,
                    signature,
                    webhookSecret
                );
            } catch (err) {
                console.log(`⚠️  Webhook signature verification failed:  ${err}`);
                return res.sendStatus(400);
            }
            // Extract the object from the event.
            data = event.data.object;
            eventType = event.type;
        } else {
            // Webhook signing is recommended, but if the secret is not configured in `config.js`,
            // retrieve the event data directly from the request body.
            data = req.body.data.object;
            eventType = req.body.type;
        }

        // Handle the checkout.session.completed event
        if (eventType === "checkout.session.completed") {
            stripe.customers
                .retrieve(data.customer)
                .then(async (customer) => {
                    try {
                        // CREATE ORDER
                        const userId = customer.metadata.userId;
                        const total = data.amount_total;
                        createOrder(customer, data, userId, total);
                    } catch (err) {
                        console.log(typeof createOrder);
                        console.log(err);
                    }
                })
                .catch((err) => console.log(err.message));
        }

        res.status(200).end();
    }
);

module.exports = router;
