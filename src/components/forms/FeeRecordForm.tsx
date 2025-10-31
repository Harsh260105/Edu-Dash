"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Dispatch, SetStateAction } from "react";

const feeRecordSchema = z.object({
  id: z.coerce.number().optional(),
  studentId: z.string().min(1, { message: "Student is required!" }),
  feeStructureId: z.coerce
    .number()
    .min(1, { message: "Fee type is required!" }),
  amountDue: z.coerce.number().min(0, { message: "Amount must be positive!" }),
  amountPaid: z.coerce.number().min(0).optional(),
  status: z.enum(["PENDING", "PARTIAL", "PAID", "OVERDUE"]),
  dueDate: z.coerce.date({ message: "Due date is required!" }),
});

type FeeRecordSchema = z.infer<typeof feeRecordSchema>;

const FeeRecordForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FeeRecordSchema>({
    resolver: zodResolver(feeRecordSchema),
  });

  const router = useRouter();

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const response = await fetch("/api/fees", {
        method: type === "create" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(
          `Fee record ${
            type === "create" ? "created" : "updated"
          } successfully!`
        );
        setOpen(false);
        router.refresh();
      } else {
        const error = await response.json();
        toast.error(error.error || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit fee record");
    }
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new fee record" : "Update fee record"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Student</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("studentId")}
            defaultValue={data?.studentId}
          >
            <option value="">Select a student</option>
            {relatedData?.students?.map((student: any) => (
              <option key={student.id} value={student.id}>
                {student.name} {student.surname}
              </option>
            ))}
          </select>
          {errors.studentId?.message && (
            <p className="text-xs text-red-400">
              {errors.studentId.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Fee Type</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("feeStructureId")}
            defaultValue={data?.feeStructureId}
          >
            <option value="">Select fee type</option>
            {relatedData?.feeStructures?.map((fee: any) => (
              <option key={fee.id} value={fee.id}>
                {fee.name} - ${fee.amount}
              </option>
            ))}
          </select>
          {errors.feeStructureId?.message && (
            <p className="text-xs text-red-400">
              {errors.feeStructureId.message.toString()}
            </p>
          )}
        </div>

        <InputField
          label="Amount Due"
          name="amountDue"
          defaultValue={data?.amountDue}
          register={register}
          error={errors?.amountDue}
          type="number"
        />

        <InputField
          label="Amount Paid"
          name="amountPaid"
          defaultValue={data?.amountPaid || 0}
          register={register}
          error={errors?.amountPaid}
          type="number"
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Status</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("status")}
            defaultValue={data?.status || "PENDING"}
          >
            <option value="PENDING">Pending</option>
            <option value="PARTIAL">Partial</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
          </select>
          {errors.status?.message && (
            <p className="text-xs text-red-400">
              {errors.status.message.toString()}
            </p>
          )}
        </div>

        <InputField
          label="Due Date"
          name="dueDate"
          defaultValue={
            data?.dueDate
              ? new Date(data.dueDate).toISOString().split("T")[0]
              : undefined
          }
          register={register}
          error={errors?.dueDate}
          type="date"
        />
      </div>

      {data && (
        <InputField
          label="Id"
          name="id"
          defaultValue={data?.id}
          register={register}
          error={errors?.id}
          hidden
        />
      )}

      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default FeeRecordForm;
