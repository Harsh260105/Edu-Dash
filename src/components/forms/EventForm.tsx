"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";

import { eventSchema, EventSchema } from "@/lib/formValidationSchemas";
import { createEvent, updateEvent } from "@/lib/actions";
import { Class } from "@prisma/client";

const EventForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: {
    classes: Class[];
  };
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventSchema>({
    resolver: zodResolver(eventSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createEvent : updateEvent,
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
      toast(`Event has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { classes } = relatedData || {};

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new event" : "Update the event"}
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
          <label className="text-xs text-gray-500">Start Time</label>
          <input
            {...register("startTime")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            type="datetime-local"
            defaultValue={data?.startTime?.toISOString().slice(0, 16)}
          />
          {errors.startTime?.message && (
            <p className="text-xs text-red-400">{errors.startTime.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">End Time</label>
          <input
            {...register("endTime")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            type="datetime-local"
            defaultValue={data?.endTime?.toISOString().slice(0, 16)}
          />
          {errors.endTime?.message && (
            <p className="text-xs text-red-400">{errors.endTime.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class (Optional)</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("classId")}
            defaultValue={data?.classId || ""}
          >
            <option value="">All Classes</option>
            {classes?.map((classItem: Class) => (
              <option value={classItem.id} key={classItem.id}>
                {classItem.name}
              </option>
            ))}
          </select>
          {errors.classId?.message && (
            <p className="text-xs text-red-400">{errors.classId.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">Description</label>
          <textarea
            {...register("description")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            rows={4}
            defaultValue={data?.description}
          />
          {errors.description?.message && (
            <p className="text-xs text-red-400">{errors.description.message}</p>
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

export default EventForm;
