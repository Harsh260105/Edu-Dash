import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

const Navbar = async () => {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const role = user?.publicMetadata?.role as string;
  let userData: { username: string } | null = null;

  // Fetch user data based on role
  try {
    if (role === "admin") {
      userData = await prisma.admin.findUnique({
        where: { id: user.id },
        select: { username: true },
      });
    } else if (role === "teacher") {
      userData = await prisma.teacher.findUnique({
        where: { id: user.id },
        select: { username: true },
      });
    } else if (role === "student") {
      userData = await prisma.student.findUnique({
        where: { id: user.id },
        select: { username: true },
      });
    } else if (role === "parent") {
      userData = await prisma.parent.findUnique({
        where: { id: user.id },
        select: { username: true },
      });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }

  return (
    <div className="flex items-center justify-between p-4">
      {/* SEARCH BAR */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image src="/search.png" alt="" width={14} height={14} />
        <input
          type="text"
          placeholder="Search..."
          className="w-[200px] p-2 bg-transparent outline-none"
        />
      </div>
      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        <Link
          href="/list/messages"
          className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition"
        >
          <Image src="/message.png" alt="Messages" width={20} height={20} />
        </Link>
        <Link
          href="/list/announcements"
          className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative hover:bg-gray-100 transition"
        >
          <Image
            src="/announcement.png"
            alt="Announcements"
            width={20}
            height={20}
          />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
            1
          </div>
        </Link>
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">
            {userData?.username}
          </span>
          <span className="text-[10px] text-gray-500 text-right">
            {user?.publicMetadata?.role as string}
          </span>
        </div>
        {/* <Image src="/avatar.png" alt="" width={36} height={36} className="rounded-full"/> */}
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
