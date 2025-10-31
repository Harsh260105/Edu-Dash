import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import AttendanceForm from "@/components/AttendanceForm";

type AttendanceList = {
  id: number;
  date: Date;
  present: boolean;
  studentName: string;
  studentSurname: string;
  lessonName: string;
  className: string;
  teacherName: string;
  teacherSurname: string;
};

const AttendanceListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  const columns = [
    {
      header: "Date",
      accessor: "date",
    },
    {
      header: "Student",
      accessor: "student",
    },
    {
      header: "Lesson",
      accessor: "lesson",
    },
    {
      header: "Class",
      accessor: "class",
      className: "hidden md:table-cell",
    },
    {
      header: "Status",
      accessor: "status",
    },
    {
      header: "Teacher",
      accessor: "teacher",
      className: "hidden md:table-cell",
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

  const renderRow = (item: AttendanceList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        {new Date(item.date).toLocaleDateString()}
      </td>
      <td>
        {item.studentName} {item.studentSurname}
      </td>
      <td>{item.lessonName}</td>
      <td className="hidden md:table-cell">{item.className}</td>
      <td>
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            item.present
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.present ? "Present" : "Absent"}
        </span>
      </td>
      <td className="hidden md:table-cell">
        {item.teacherName} {item.teacherSurname}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormContainer table="attendance" type="update" data={item} />
              <FormContainer table="attendance" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION
  const query: Prisma.AttendanceWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              {
                student: {
                  name: { contains: value, mode: "insensitive" },
                },
              },
              {
                student: {
                  surname: { contains: value, mode: "insensitive" },
                },
              },
              {
                lesson: {
                  name: { contains: value, mode: "insensitive" },
                },
              },
            ];
            break;
          case "lessonId":
            query.lessonId = parseInt(value);
            break;
          case "studentId":
            query.studentId = value;
            break;
          case "date":
            const date = new Date(value);
            query.date = {
              gte: new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
              ),
              lt: new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate() + 1
              ),
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
      query.lesson = {
        teacherId: currentUserId!,
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

  const [dataRes, count] = await prisma.$transaction([
    prisma.attendance.findMany({
      where: query,
      include: {
        student: { select: { name: true, surname: true } },
        lesson: {
          include: {
            class: { select: { name: true } },
            teacher: { select: { name: true, surname: true } },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: [{ date: "desc" }],
    }),
    prisma.attendance.count({ where: query }),
  ]);

  const data = dataRes.map((item) => ({
    id: item.id,
    date: item.date,
    present: item.present,
    studentName: item.student.name,
    studentSurname: item.student.surname,
    lessonName: item.lesson.name,
    className: item.lesson.class.name,
    teacherName: item.lesson.teacher.name,
    teacherSurname: item.lesson.teacher.surname,
  }));

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          All Attendance
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
              <FormContainer table="attendance" type="create" />
            )}
            {role === "teacher" && <AttendanceForm />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default AttendanceListPage;
