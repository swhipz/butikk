import React, { useState, useEffect } from "react";
import { collection, doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
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
  clientId: string;
  coachId: string;
  startDate: Date;
  endDate: Date;
}

const PlanEditor: React.FC<{ planId?: string; clientId: string }> = ({
  planId,
  clientId,
}) => {
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchPlan = async () => {
      if (planId) {
        const planDoc = await getDoc(doc(db, "plans", planId));
        if (planDoc.exists()) {
          setPlan({ ...planDoc.data(), id: planDoc.id } as WorkoutPlan);
        }
      } else {
        // Initialize new plan
        setPlan({
          id: "",
          title: "New Workout Plan",
          description: "",
          exercises: [],
          clientId,
          coachId: currentUser?.uid || "",
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        });
      }
    };

    fetchPlan();
  }, [planId, clientId, currentUser]);

  const handleSave = async () => {
    if (!plan || !currentUser) return;

    try {
      if (planId) {
        await updateDoc(doc(db, "plans", planId), { ...plan });
      } else {
        const plansRef = collection(db, "plans");
        await setDoc(doc(plansRef), {
          ...plan,
          createdAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Error saving plan:", error);
    }
  };

  const addExercise = () => {
    if (!plan) return;
    setPlan({
      ...plan,
      exercises: [...plan.exercises, { name: "", sets: 3, reps: 10 }],
    });
  };

  const updateExercise = (index: number, field: keyof Exercise, value: any) => {
    if (!plan) return;
    const newExercises = [...plan.exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setPlan({ ...plan, exercises: newExercises });
  };

  if (!plan) return <div>Loading...</div>;

  return (
    <div className="plan-editor">
      <div className="plan-header">
        <input
          type="text"
          value={plan.title}
          onChange={(e) => setPlan({ ...plan, title: e.target.value })}
          placeholder="Plan Title"
          className="plan-title-input"
        />
        <textarea
          value={plan.description}
          onChange={(e) => setPlan({ ...plan, description: e.target.value })}
          placeholder="Plan Description"
          className="plan-description-input"
        />
      </div>

      <div className="exercises-list">
        {plan.exercises.map((exercise, index) => (
          <div key={index} className="exercise-item">
            <input
              type="text"
              value={exercise.name}
              onChange={(e) => updateExercise(index, "name", e.target.value)}
              placeholder="Exercise Name"
            />
            <input
              type="number"
              value={exercise.sets}
              onChange={(e) =>
                updateExercise(index, "sets", parseInt(e.target.value))
              }
              placeholder="Sets"
            />
            <input
              type="number"
              value={exercise.reps}
              onChange={(e) =>
                updateExercise(index, "reps", parseInt(e.target.value))
              }
              placeholder="Reps"
            />
            <input
              type="number"
              value={exercise.weight || ""}
              onChange={(e) =>
                updateExercise(index, "weight", parseInt(e.target.value))
              }
              placeholder="Weight (optional)"
            />
            <textarea
              value={exercise.notes || ""}
              onChange={(e) => updateExercise(index, "notes", e.target.value)}
              placeholder="Notes"
            />
          </div>
        ))}
      </div>

      <button onClick={addExercise} className="add-exercise-btn">
        Add Exercise
      </button>
      <button onClick={handleSave} className="save-plan-btn">
        Save Plan
      </button>
    </div>
  );
};

export default PlanEditor;
