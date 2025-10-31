"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";

import { resultSchema, ResultSchema } from "@/lib/formValidationSchemas";
import { createResult, updateResult } from "@/lib/actions";
import { Student, Exam, Assignment } from "@prisma/client";

const ResultForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: {
    students: Student[];
    exams: Exam[];
    assignments: Assignment[];
  };
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ResultSchema>({
    resolver: zodResolver(resultSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createResult : updateResult,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    formAction(data);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Result has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { students, exams, assignments } = relatedData || {};

  const examId = watch("examId");
  const assignmentId = watch("assignmentId");

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new result" : "Update the result"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Score</label>
          <input
            {...register("score", { valueAsNumber: true })}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            type="number"
            min="0"
            max="100"
            defaultValue={data?.score}
          />
          {errors.score?.message && (
            <p className="text-xs text-red-400">{errors.score.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Student</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("studentId")}
            defaultValue={data?.studentId}
          >
            {students?.map((student: Student) => (
              <option value={student.id} key={student.id}>
                {student.name} {student.surname}
              </option>
            ))}
          </select>
          {errors.studentId?.message && (
            <p className="text-xs text-red-400">{errors.studentId.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Exam (Optional)</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("examId", { valueAsNumber: true })}
            defaultValue={data?.examId || ""}
            onChange={(e) => {
              const value = e.target.value;
              setValue("examId", value ? parseInt(value) : undefined);
              if (value) setValue("assignmentId", undefined);
            }}
          >
            <option value="">Select Exam</option>
            {exams?.map((exam: Exam) => (
              <option value={exam.id} key={exam.id}>
                {exam.title}
              </option>
            ))}
          </select>
          {errors.examId?.message && (
            <p className="text-xs text-red-400">{errors.examId.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Assignment (Optional)</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("assignmentId", { valueAsNumber: true })}
            defaultValue={data?.assignmentId || ""}
            onChange={(e) => {
              const value = e.target.value;
              setValue("assignmentId", value ? parseInt(value) : undefined);
              if (value) setValue("examId", undefined);
            }}
          >
            <option value="">Select Assignment</option>
            {assignments?.map((assignment: Assignment) => (
              <option value={assignment.id} key={assignment.id}>
                {assignment.title}
              </option>
            ))}
          </select>
          {errors.assignmentId?.message && (
            <p className="text-xs text-red-400">
              {errors.assignmentId.message}
            </p>
          )}
        </div>
      </div>

      {errors.root?.message && (
        <p className="text-xs text-red-400">{errors.root.message}</p>
      )}

      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}

      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ResultForm;
