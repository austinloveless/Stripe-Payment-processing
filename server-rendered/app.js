require("dotenv").load();

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const path = require("path");
var stripe = require("stripe")("sk_test_baD4DpljtMfsy4h43U3BCIU6");

// Token is created using Checkout or Elements!
// Get the payment token ID submitted by the form:

app.use(bodyParser.urlencoded({ extended: false }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(require("serve-static")(path.join(__dirname, "public")));

app.get("/", (request, response) => {
  response.redirect("/bill");
});

app.get("/bill", (request, response) => {
  response.render("bill");
});

app.post("/charge", (req, res) => {
  const token = req.body.stripeToken; // Using Express

  const charge = stripe.charges.create(
    {
      amount: req.body.amount,
      currency: "usd",
      description: "Service",
      source: token
    },
    (err, charge) => {
      if (err) {
        res.render("error", { err: err });
      } else {
        res.render("success", { amount: charge.amount / 100 });
      }
    }
  );
});

app.listen(process.env.PORT || 3000, () => {
  console.log("server started");
});
// Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
