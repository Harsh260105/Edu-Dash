"use client";

import { useState, useEffect } from "react";
import BulkGradingForm from "./BulkGradingForm";

interface Class {
  id: number;
  name: string;
}

interface Lesson {
  id: number;
  name: string;
  subject: { name: string };
  class: { name: string };
  teacher?: { name: string; surname: string };
}

interface Exam {
  id: number;
  title: string;
  lessonId: number;
  lesson: {
    id: number;
    subject: { name: string };
    class: { name: string };
    teacher?: { name: string; surname: string };
  };
}

interface Assignment {
  id: number;
  title: string;
  lessonId: number;
  lesson: {
    id: number;
    subject: { name: string };
    class: { name: string };
    teacher?: { name: string; surname: string };
  };
}

interface Student {
  id: string;
  name: string;
  surname: string;
}

interface ExistingResult {
  studentId: string;
  score: number;
}

const BulkGradingInterface = ({
  classes,
  lessons,
  exams,
  assignments,
}: {
  classes: Class[];
  lessons: Lesson[];
  exams: Exam[];
  assignments: Assignment[];
}) => {
  const [selectedType, setSelectedType] = useState<"exam" | "assignment" | "">(
    ""
  );
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [existingResults, setExistingResults] = useState<ExistingResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSelection = async (
    type: "exam" | "assignment",
    itemId: number
  ) => {
    setLoading(true);
    setSelectedType(type);
    setSelectedItem(itemId);

    try {
      // Get the class ID based on the selected exam/assignment
      let classId: number | null = null;

      if (type === "exam") {
        const exam = exams.find((e) => e.id === itemId);
        if (exam) {
          // Find the lesson to get the class
          const lesson = lessons.find((l) => l.id === exam.lessonId);
          if (lesson) {
            classId =
              classes.find((c) => c.name === lesson.class.name)?.id || null;
          }
        }
      } else if (type === "assignment") {
        const assignment = assignments.find((a) => a.id === itemId);
        if (assignment) {
          // Find the lesson to get the class
          const lesson = lessons.find((l) => l.id === assignment.lessonId);
          if (lesson) {
            classId =
              classes.find((c) => c.name === lesson.class.name)?.id || null;
          }
        }
      }

      if (classId) {
        // Fetch students in the class
        const response = await fetch(`/api/classes/${classId}/students`);
        if (response.ok) {
          const classStudents = await response.json();
          setStudents(classStudents);
        }

        // Fetch existing results
        const resultsResponse = await fetch(`/api/results?${type}Id=${itemId}`);
        if (resultsResponse.ok) {
          const results = await resultsResponse.json();
          setExistingResults(results);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetSelection = () => {
    setSelectedType("");
    setSelectedItem(null);
    setStudents([]);
    setExistingResults([]);
  };

  return (
    <div className="space-y-6">
      {/* Selection Interface */}
      {!selectedType && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Exam Selection */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Grade an Exam</h3>
            <div className="space-y-3">
              {exams.map((exam) => (
                <div
                  key={exam.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSelection("exam", exam.id)}
                >
                  <h4 className="font-medium">{exam.title}</h4>
                  <p className="text-sm text-gray-600">
                    {exam.lesson.subject.name} - {exam.lesson.class.name}
                    {exam.lesson.teacher && (
                      <>
                        {" "}
                        • {exam.lesson.teacher.name}{" "}
                        {exam.lesson.teacher.surname}
                      </>
                    )}
                  </p>
                </div>
              ))}
              {exams.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No exams available for grading
                </p>
              )}
            </div>
          </div>

          {/* Assignment Selection */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Grade an Assignment</h3>
            <div className="space-y-3">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSelection("assignment", assignment.id)}
                >
                  <h4 className="font-medium">{assignment.title}</h4>
                  <p className="text-sm text-gray-600">
                    {assignment.lesson.subject.name} -{" "}
                    {assignment.lesson.class.name}
                    {assignment.lesson.teacher && (
                      <>
                        {" "}
                        • {assignment.lesson.teacher.name}{" "}
                        {assignment.lesson.teacher.surname}
                      </>
                    )}
                  </p>
                </div>
              ))}
              {assignments.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No assignments available for grading
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bulk Grading Form */}
      {selectedType && selectedItem && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {selectedType === "exam" ? "Exam" : "Assignment"} Grading
            </h3>
            <button
              onClick={resetSelection}
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              ← Back to Selection
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading students...</p>
            </div>
          ) : students.length > 0 ? (
            <BulkGradingForm
              lessonId={
                selectedType === "exam"
                  ? exams.find((e) => e.id === selectedItem)?.lessonId
                  : assignments.find((a) => a.id === selectedItem)?.lessonId
              }
              examId={selectedType === "exam" ? selectedItem : undefined}
              assignmentId={
                selectedType === "assignment" ? selectedItem : undefined
              }
              students={students}
              existingResults={existingResults}
              onClose={resetSelection}
            />
          ) : (
            <p className="text-gray-500 text-center py-8">
              No students found for this {selectedType}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default BulkGradingInterface;
