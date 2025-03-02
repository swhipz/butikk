import React, { useState } from "react";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseconfig";
import { useAuth } from "../../contexts/AuthContext";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: number; // in months
  features: string[];
}

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "basic",
    name: "Basic Plan",
    price: 29.99,
    duration: 1,
    features: [
      "Personal workout plan",
      "Basic nutrition guidance",
      "Email support",
    ],
  },
  {
    id: "premium",
    name: "Premium Plan",
    price: 49.99,
    duration: 1,
    features: [
      "Custom workout plan",
      "Detailed nutrition plan",
      "Priority chat support",
      "Weekly check-ins",
    ],
  },
  {
    id: "elite",
    name: "Elite Plan",
    price: 99.99,
    duration: 1,
    features: [
      "Personalized coaching",
      "24/7 chat support",
      "Video consultations",
      "Custom meal plans",
      "Progress tracking",
    ],
  },
];

const PaymentForm: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null
  );
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");
  const [cardInfo, setCardInfo] = useState({
    number: "",
    expiry: "",
    cvc: "",
  });
  const { currentUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan || !currentUser) return;

    try {
      // Here you would typically integrate with a payment processor like Stripe
      // For now, we'll just update the user's subscription in Firestore
      const subscriptionData = {
        planId: selectedPlan.id,
        startDate: new Date(),
        endDate: new Date(
          Date.now() + selectedPlan.duration * 30 * 24 * 60 * 60 * 1000
        ),
        status: "active",
        paymentMethod,
      };

      await setDoc(doc(db, "subscriptions", currentUser.uid), subscriptionData);
      await updateDoc(doc(db, "users", currentUser.uid), {
        hasActiveSubscription: true,
        currentPlan: selectedPlan.id,
      });

      alert("Subscription successful!");
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Error processing payment. Please try again.");
    }
  };

  return (
    <div className="payment-form">
      <h2>Choose Your Plan</h2>

      <div className="subscription-plans">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`plan-card ${
              selectedPlan?.id === plan.id ? "selected" : ""
            }`}
            onClick={() => setSelectedPlan(plan)}
          >
            <h3>{plan.name}</h3>
            <p className="price">${plan.price}/month</p>
            <ul className="features">
              {plan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <button
              className={`select-plan-btn ${
                selectedPlan?.id === plan.id ? "selected" : ""
              }`}
            >
              {selectedPlan?.id === plan.id ? "Selected" : "Select Plan"}
            </button>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <form onSubmit={handleSubmit} className="payment-details">
          <h3>Payment Method</h3>

          <div className="payment-method-selector">
            <label>
              <input
                type="radio"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value as "card")}
              />
              Credit Card
            </label>
            <label>
              <input
                type="radio"
                value="paypal"
                checked={paymentMethod === "paypal"}
                onChange={(e) => setPaymentMethod(e.target.value as "paypal")}
              />
              PayPal
            </label>
          </div>

          {paymentMethod === "card" && (
            <div className="card-details">
              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  value={cardInfo.number}
                  onChange={(e) =>
                    setCardInfo({ ...cardInfo, number: e.target.value })
                  }
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    value={cardInfo.expiry}
                    onChange={(e) =>
                      setCardInfo({ ...cardInfo, expiry: e.target.value })
                    }
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div className="form-group">
                  <label>CVC</label>
                  <input
                    type="text"
                    value={cardInfo.cvc}
                    onChange={(e) =>
                      setCardInfo({ ...cardInfo, cvc: e.target.value })
                    }
                    placeholder="123"
                    maxLength={3}
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === "paypal" && (
            <div className="paypal-button">
              <button type="button" className="paypal-checkout-btn">
                Checkout with PayPal
              </button>
            </div>
          )}

          <button type="submit" className="submit-payment-btn">
            Subscribe Now - ${selectedPlan.price}/month
          </button>
        </form>
      )}
    </div>
  );
};

export default PaymentForm;
