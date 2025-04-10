import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebaseconfig";
import { useAuth } from "../../contexts/AuthContext";

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
}

interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  exercises: Exercise[];
  startDate: Date;
  endDate: Date;
  completed?: boolean;
}

const ClientPlans: React.FC = () => {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchPlans = async () => {
      if (!currentUser) return;

      const plansRef = collection(db, "plans");
      const q = query(plansRef, where("clientId", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);

      const fetchedPlans = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate.toDate(),
        endDate: doc.data().endDate.toDate(),
      })) as WorkoutPlan[];

      setPlans(fetchedPlans);
    };

    fetchPlans();
  }, [currentUser]);

  return (
    <div className="plans-container">
      <div className="plans-sidebar">
        <h2>Your Workout Plans</h2>
        <div className="plans-list">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`plan-item ${
                selectedPlan?.id === plan.id ? "selected" : ""
              }`}
              onClick={() => setSelectedPlan(plan)}
            >
              <h3>{plan.title}</h3>
              <p>
                {plan.startDate.toLocaleDateString()} -{" "}
                {plan.endDate.toLocaleDateString()}
              </p>
              {plan.completed && (
                <span className="completed-badge">Completed</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="plan-details">
        {selectedPlan ? (
          <>
            <div className="plan-header">
              <h2>{selectedPlan.title}</h2>
              <p className="plan-dates">
                {selectedPlan.startDate.toLocaleDateString()} -{" "}
                {selectedPlan.endDate.toLocaleDateString()}
              </p>
            </div>
            <p className="plan-description">{selectedPlan.description}</p>

            <div className="exercises-list">
              <h3>Exercises</h3>
              {selectedPlan.exercises.map((exercise, index) => (
                <div key={index} className="exercise-item">
                  <h4>{exercise.name}</h4>
                  <div className="exercise-details">
                    <span>{exercise.sets} sets</span>
                    <span>{exercise.reps} reps</span>
                    {exercise.weight && <span>{exercise.weight} kg</span>}
                  </div>
                  {exercise.notes && (
                    <p className="exercise-notes">{exercise.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="no-plan-selected">
            <p>Select a plan to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientPlans;
