const stripe = require("stripe")("sk_test_51NOfYxKa6RpLAVkAs06VQh9xS8Dc1TjxjawN5TxwPSqwMWBq9BnzJFjajNU");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, price } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: name || "Unnamed Product" },
          unit_amount: price * 100, // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "https://yourframer.site/success", // Replace with your Framer success page
    cancel_url: "https://yourframer.site/cancel",   // Replace with your Framer cancel page
  });

  res.status(200).json({ url: session.url });
};