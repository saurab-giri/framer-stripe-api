// api/create-checkout.js
const stripe = require("stripe")("sk_test_51NOfYxKa6RpLAVkAs06VQh9xS8Dc1TjxjawN5TxwPSqwMWBq9BnzJFjajNUE5K7bnzvBhbKYrnRbzdHBYf6l18Od00sssjhnvM");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://robocodev.framer.website");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, price } = req.body;

  // Log the raw input for debugging
  console.log("Request body:", req.body);

  // Validate price
  const priceInCents = Math.round(Number(price) * 100);
  if (isNaN(priceInCents) || priceInCents <= 0) {
    console.error("Invalid price value:", price);
    return res.status(400).json({ error: "Invalid price: must be a positive number" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: name || "Unnamed Product" },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://robocodev.framer.website/success",
      cancel_url: "https://robocodev.framer.website/cancel",
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error.message);
    res.status(500).json({ error: "Failed to create checkout session", details: error.message });
  }
};