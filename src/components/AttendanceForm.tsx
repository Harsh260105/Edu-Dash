"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface Lesson {
  id: number;
  name: string;
  class: {
    name: string;
  };
  subject: {
    name: string;
  };
}

interface Student {
  id: string;
  name: string;
  surname: string;
}

const AttendanceForm = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  // Fetch teacher's lessons
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch("/api/lessons/my-lessons");
        if (response.ok) {
          const data = await response.json();
          setLessons(data);
        }
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    };

    if (showForm) {
      fetchLessons();
    }
  }, [showForm]);

  // Fetch students when lesson is selected
  useEffect(() => {
    if (selectedLesson) {
      const fetchStudents = async () => {
        try {
          // First get the lesson details to find the class ID
          const lessonResponse = await fetch(`/api/lessons/${selectedLesson}`);
          if (lessonResponse.ok) {
            const lessonData = await lessonResponse.json();
            const classId = lessonData.classId;

            // Then fetch students for that class
            const studentsResponse = await fetch(
              `/api/classes/${classId}/students`
            );
            if (studentsResponse.ok) {
              const data = await studentsResponse.json();
              setStudents(data);
              // Initialize all students as present
              const initialAttendance: Record<string, boolean> = {};
              data.forEach((student: Student) => {
                initialAttendance[student.id] = true;
              });
              setAttendance(initialAttendance);
            }
          }
        } catch (error) {
          console.error("Error fetching students:", error);
        }
      };

      fetchStudents();
    }
  }, [selectedLesson]);

  const handleAttendanceChange = (studentId: string, present: boolean) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: present,
    }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedLesson) {
      toast.error("Please select a lesson");
      return;
    }

    setLoading(true);
    try {
      const attendanceData = Object.entries(attendance).map(
        ([studentId, present]) => ({
          studentId,
          lessonId: selectedLesson,
          present,
          date: new Date().toISOString(),
        })
      );

      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ attendance: attendanceData }),
      });

      if (response.ok) {
        toast.success("Attendance saved successfully!");
        setShowForm(false);
        setSelectedLesson(null);
        setStudents([]);
        setAttendance({});
        router.refresh();
      } else {
        throw new Error("Failed to save attendance");
      }
    } catch (error) {
      console.error("Error saving attendance:", error);
      toast.error("Failed to save attendance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaPurple text-white"
        title="Take Attendance"
      >
        ✓
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Take Attendance</h2>
          <button
            onClick={() => setShowForm(false)}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Lesson Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Lesson
          </label>
          <select
            value={selectedLesson || ""}
            onChange={(e) =>
              setSelectedLesson(parseInt(e.target.value) || null)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose a lesson...</option>
            {lessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.name} - {lesson.subject.name} ({lesson.class.name})
              </option>
            ))}
          </select>
        </div>

        {/* Students List */}
        {selectedLesson && students.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Mark Attendance</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {student.name[0]}
                      {student.surname[0]}
                    </div>
                    <span className="font-medium">
                      {student.name} {student.surname}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAttendanceChange(student.id, true)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        attendance[student.id]
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => handleAttendanceChange(student.id, false)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        !attendance[student.id]
                          ? "bg-red-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Absent
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setShowForm(false)}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAttendance}
            disabled={loading || !selectedLesson || students.length === 0}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Attendance"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceForm;
