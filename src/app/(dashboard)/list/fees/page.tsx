import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import {
  FeeRecord,
  FeeStructure,
  Payment,
  Prisma,
  Student,
} from "@prisma/client";
import Image from "next/image";

export const dynamic = "force-dynamic";

type FeeRecordList = FeeRecord & {
  student: Student;
  feeStructure: FeeStructure;
  payments: Payment[];
};

const FeeListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { sessionClaims, userId } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  const columns = [
    {
      header: "Student Name",
      accessor: "studentName",
    },
    {
      header: "Fee Type",
      accessor: "feeType",
      className: "hidden md:table-cell",
    },
    {
      header: "Amount Due",
      accessor: "amountDue",
      className: "hidden md:table-cell",
    },
    {
      header: "Amount Paid",
      accessor: "amountPaid",
      className: "hidden lg:table-cell",
    },
    {
      header: "Status",
      accessor: "status",
      className: "hidden lg:table-cell",
    },
    {
      header: "Due Date",
      accessor: "dueDate",
      className: "hidden lg:table-cell",
    },
    ...(role === "admin"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: FeeRecordList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">
            {item.student.name} {item.student.surname}
          </h3>
          <p className="text-xs text-gray-500">{item.student.username}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.feeStructure.name}</td>
      <td className="hidden md:table-cell">${item.amountDue.toFixed(2)}</td>
      <td className="hidden lg:table-cell">${item.amountPaid.toFixed(2)}</td>
      <td className="hidden lg:table-cell">
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            item.status === "PAID"
              ? "bg-green-100 text-green-800"
              : item.status === "PARTIAL"
              ? "bg-yellow-100 text-yellow-800"
              : item.status === "OVERDUE"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {item.status}
        </span>
      </td>
      <td className="hidden lg:table-cell">
        {new Intl.DateTimeFormat("en-US").format(item.dueDate)}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormContainer table="feeRecord" type="update" data={item} />
              <FormContainer table="feeRecord" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION
  const query: Prisma.FeeRecordWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "studentId":
            query.studentId = value;
            break;
          case "search":
            query.student = {
              OR: [
                { name: { contains: value, mode: "insensitive" } },
                { surname: { contains: value, mode: "insensitive" } },
              ],
            };
            break;
          default:
            break;
        }
      }
    }
  }

  // ROLE CONDITIONS
  switch (role) {
    case "admin":
      break;
    case "teacher":
      query.student = {
        class: {
          lessons: {
            some: {
              teacherId: currentUserId!,
            },
          },
        },
      };
      break;
    case "student":
      query.studentId = currentUserId!;
      break;
    case "parent":
      query.student = {
        parentId: currentUserId!,
      };
      break;
    default:
      break;
  }

  const [feeRecords, count] = await prisma.$transaction([
    prisma.feeRecord.findMany({
      where: query,
      include: {
        student: true,
        feeStructure: true,
        payments: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: {
        dueDate: "desc",
      },
    }),
    prisma.feeRecord.count({ where: query }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          Fee Management
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && (
              <FormContainer table="feeRecord" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={feeRecords} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default FeeListPage;

