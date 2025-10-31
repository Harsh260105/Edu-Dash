"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const BulkGradingForm = ({
  lessonId,
  examId,
  assignmentId,
  students,
  existingResults,
  onClose,
}: {
  lessonId?: number;
  examId?: number;
  assignmentId?: number;
  students: Array<{ id: string; name: string; surname: string }>;
  existingResults: Array<{ studentId: string; score: number }>;
  onClose: () => void;
}) => {
  const [grades, setGrades] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Initialize grades with existing results
  useEffect(() => {
    const initialGrades: Record<string, number> = {};
    existingResults.forEach((result) => {
      initialGrades[result.studentId] = result.score;
    });
    setGrades(initialGrades);
  }, [existingResults]);

  const handleGradeChange = (studentId: string, score: number) => {
    setGrades((prev) => ({
      ...prev,
      [studentId]: score,
    }));
  };

  const handleSaveAll = async () => {
    setLoading(true);
    try {
      const resultsToSave = Object.entries(grades)
        .filter(([_, score]) => score >= 0 && score <= 100)
        .map(([studentId, score]) => ({
          studentId,
          score,
          ...(examId && { examId }),
          ...(assignmentId && { assignmentId }),
        }));

      // Save all results
      const response = await fetch("/api/results/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ results: resultsToSave }),
      });

      if (response.ok) {
        toast.success("All grades saved successfully!");
        onClose();
        router.refresh();
      } else {
        throw new Error("Failed to save grades");
      }
    } catch (error) {
      console.error("Error saving grades:", error);
      toast.error("Failed to save grades. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filledGrades = Object.values(grades).filter(
    (score) => score >= 0 && score <= 100
  ).length;

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Bulk Grade Entry</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <div className="mb-4 text-sm text-gray-600">
        {filledGrades} of {students.length} students graded
      </div>

      <div className="grid gap-4 max-h-96 overflow-y-auto">
        {students.map((student) => (
          <div
            key={student.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                {student.name[0]}
                {student.surname[0]}
              </div>
              <div>
                <p className="font-medium">
                  {student.name} {student.surname}
                </p>
                <p className="text-sm text-gray-500">
                  Student ID: {student.id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="100"
                value={grades[student.id] || ""}
                onChange={(e) =>
                  handleGradeChange(
                    student.id,
                    e.target.value ? parseInt(e.target.value) : 0
                  )
                }
                className="w-20 px-3 py-2 border border-gray-300 rounded-md text-center"
                placeholder="0-100"
              />
              <span className="text-sm text-gray-500">/100</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveAll}
          disabled={loading || filledGrades === 0}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : `Save ${filledGrades} Grades`}
        </button>
      </div>
    </div>
  );
};

export default BulkGradingForm;
