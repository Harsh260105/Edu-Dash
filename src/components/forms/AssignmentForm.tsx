"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";

import {
  assignmentSchema,
  AssignmentSchema,
} from "@/lib/formValidationSchemas";
import { createAssignment, updateAssignment } from "@/lib/actions";
import { Lesson } from "@prisma/client";

const AssignmentForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: {
    lessons: Lesson[];
  };
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignmentSchema>({
    resolver: zodResolver(assignmentSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createAssignment : updateAssignment,
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
      toast(
        `Assignment has been ${type === "create" ? "created" : "updated"}!`
      );
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { lessons } = relatedData || {};

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create"
          ? "Create a new assignment"
          : "Update the assignment"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Title</label>
          <input
            {...register("title")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            type="text"
            defaultValue={data?.title}
          />
          {errors.title?.message && (
            <p className="text-xs text-red-400">{errors.title.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Start Date</label>
          <input
            {...register("startDate")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            type="datetime-local"
            defaultValue={data?.startDate?.toISOString().slice(0, 16)}
          />
          {errors.startDate?.message && (
            <p className="text-xs text-red-400">{errors.startDate.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Due Date</label>
          <input
            {...register("dueDate")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            type="datetime-local"
            defaultValue={data?.dueDate?.toISOString().slice(0, 16)}
          />
          {errors.dueDate?.message && (
            <p className="text-xs text-red-400">{errors.dueDate.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Lesson</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("lessonId")}
            defaultValue={data?.lessonId}
          >
            {lessons?.map((lesson: Lesson) => (
              <option value={lesson.id} key={lesson.id}>
                {lesson.name}
              </option>
            ))}
          </select>
          {errors.lessonId?.message && (
            <p className="text-xs text-red-400">{errors.lessonId.message}</p>
          )}
        </div>
      </div>

      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}

      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default AssignmentForm;
