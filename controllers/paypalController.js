const { client } = require("../utils/paypal");
const checkoutNodeJssdk = require("@paypal/checkout-server-sdk");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Create a PayPal payment
const createPayment = asyncHandler(async (req, res) => {
  const total = Number(req.body.total);

  if (isNaN(total)) {
    res.status(400);
    throw new Error("Total amount is required and must be a number.");
  }

  const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: total.toFixed(2),
        },
      },
    ],
  });

  const order = await client().execute(request);
  res.status(201).json({ id: order.result.id });
});

// @desc    Capture a PayPal payment
const capturePayment = asyncHandler(async (req, res) => {
  const { orderID } = req.body;

  if (!orderID) {
    res.status(400);
    throw new Error("orderID is required to capture payment.");
  }

  const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID);
  request.requestBody({});

  const capture = await client().execute(request);
  res.status(200).json(capture.result);
});

module.exports = { createPayment, capturePayment };
