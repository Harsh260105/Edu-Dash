import { Day, PrismaClient, UserSex, FeeFrequency } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // ADMIN
  const admins = [
    {
      id: "user_34pz15YZyoHb5KktXkY6NYJG4tO",
      username: "harsh.patel.admin",
    },
    {
      id: "user_34pz8QM8AQ8RKJD13U2KDvLQUix",
      username: "hemax.patel.admin",
    },
  ];

  for (const admin of admins) {
    await prisma.admin.create({ data: admin });
  }

  // GRADE
  const grades = [1, 2, 3, 4, 5, 6];
  for (const level of grades) {
    await prisma.grade.create({ data: { level } });
  }

  // TEACHER
  const teachers = [
    {
      id: "user_34pzJhJ8belvcriypWnbbpSxlx8",
      username: "divya.sharma",
      name: "Divya",
      surname: "Sharma",
      email: "divya.sharma@school.edu",
      phone: "+91-9876-543-210",
      address: "123 Ahmedabad, Gujarat 380015",
      bloodType: "A+",
      sex: UserSex.FEMALE,
      birthday: new Date("1985-03-15"),
    },
    {
      id: "user_34pzQF9vKB8RRN9RxAOgxamaRcg",
      username: "arun.verma",
      name: "Arun",
      surname: "Verma",
      email: "arun.verma@school.edu",
      phone: "+91-9876-543-211",
      address: "456 Vadodara, Gujarat 390001",
      bloodType: "O-",
      sex: UserSex.MALE,
      birthday: new Date("1982-07-22"),
    },
    {
      id: "user_34pzXl797nFYw96trE7zn1us7dm",
      username: "anjali.gupta",
      name: "Anjali",
      surname: "Gupta",
      email: "anjali.gupta@school.edu",
      phone: "+91-9876-543-212",
      address: "789 Surat, Gujarat 395001",
      bloodType: "B+",
      sex: UserSex.FEMALE,
      birthday: new Date("1988-11-08"),
    },
    {
      id: "user_5A1B2C3D4E5F6G7H8I9J0K1L2M3N4O",
      username: "vikram.patel",
      name: "Vikram",
      surname: "Patel",
      email: "vikram.patel@school.edu",
      phone: "+91-9876-543-213",
      address: "321 Rajkot, Gujarat 360001",
      bloodType: "AB+",
      sex: UserSex.MALE,
      birthday: new Date("1979-05-30"),
    },
    {
      id: "user_6B2C3D4E5F6G7H8I9J0K1L2M3N4O5P",
      username: "meera.desai",
      name: "Meera",
      surname: "Desai",
      email: "meera.desai@school.edu",
      phone: "+91-9876-543-214",
      address: "654 Jamnagar, Gujarat 361001",
      bloodType: "A-",
      sex: UserSex.FEMALE,
      birthday: new Date("1983-09-12"),
    },
  ];

  for (const teacher of teachers) {
    await prisma.teacher.create({ data: teacher });
  }

  // CLASS
  const classes = [
    { name: "1A", gradeId: 1, capacity: 25, supervisorId: teachers[0].id },
    { name: "1B", gradeId: 1, capacity: 24, supervisorId: teachers[1].id },
    { name: "2A", gradeId: 2, capacity: 26, supervisorId: teachers[2].id },
    { name: "2B", gradeId: 2, capacity: 23, supervisorId: teachers[3].id },
    { name: "3A", gradeId: 3, capacity: 25, supervisorId: teachers[4].id },
    { name: "3B", gradeId: 3, capacity: 24, supervisorId: teachers[0].id },
    { name: "4A", gradeId: 4, capacity: 26, supervisorId: teachers[1].id },
    { name: "4B", gradeId: 4, capacity: 23, supervisorId: teachers[2].id },
    { name: "5A", gradeId: 5, capacity: 25, supervisorId: teachers[3].id },
    { name: "5B", gradeId: 5, capacity: 24, supervisorId: teachers[4].id },
    { name: "6A", gradeId: 6, capacity: 26, supervisorId: teachers[0].id },
    { name: "6B", gradeId: 6, capacity: 23, supervisorId: teachers[1].id },
  ];

  for (const cls of classes) {
    await prisma.class.create({ data: cls });
  }

  // SUBJECT
  const subjects = [
    { name: "Mathematics" },
    { name: "English Language" },
    { name: "Science" },
    { name: "Social Studies" },
    { name: "Physical Education" },
    { name: "Art" },
    { name: "Music" },
    { name: "Computer Science" },
    { name: "Hindi" },
    { name: "History" },
  ];

  for (const subject of subjects) {
    await prisma.subject.create({ data: subject });
  }

  // Connect teachers to subjects and classes
  const teacherSubjects = [
    { teacherId: teachers[0].id, subjectIds: [1, 2] }, // Divya: Math, English
    { teacherId: teachers[1].id, subjectIds: [3, 6] }, // Arun: Science, Art
    { teacherId: teachers[2].id, subjectIds: [8, 9] }, // Anjali: Computer Science, Hindi
    { teacherId: teachers[3].id, subjectIds: [4, 10] }, // Vikram: Social Studies, History
    { teacherId: teachers[4].id, subjectIds: [5, 7] }, // Meera: PE, Music
  ];

  for (const ts of teacherSubjects) {
    await prisma.teacher.update({
      where: { id: ts.teacherId },
      data: {
        subjects: { connect: ts.subjectIds.map((id) => ({ id })) },
        classes: { connect: [{ id: 1 }, { id: 2 }] }, // Connect to first two classes
      },
    });
  }

  // LESSON - Focused realistic schedule for Divya Sharma and other teachers (no time conflicts)
  const lessons = [
    // ========== DIVYA SHARMA'S SCHEDULE (Teacher 0 - Math & English) ==========

    // MONDAY - Divya Sharma
    {
      name: "Mathematics - Algebra Fundamentals",
      day: Day.MONDAY,
      startTime: new Date("2025-10-27T08:00:00"),
      endTime: new Date("2025-10-27T09:00:00"),
      subjectId: 1,
      classId: 1,
      teacherId: teachers[0].id,
    },
    {
      name: "English - Creative Writing Workshop",
      day: Day.MONDAY,
      startTime: new Date("2025-10-27T09:15:00"),
      endTime: new Date("2025-10-27T10:15:00"),
      subjectId: 2,
      classId: 1,
      teacherId: teachers[0].id,
    },
    {
      name: "Mathematics - Number Systems",
      day: Day.MONDAY,
      startTime: new Date("2025-10-27T10:30:00"),
      endTime: new Date("2025-10-27T11:30:00"),
      subjectId: 1,
      classId: 3,
      teacherId: teachers[0].id,
    },
    {
      name: "English - Grammar & Vocabulary",
      day: Day.MONDAY,
      startTime: new Date("2025-10-27T11:45:00"),
      endTime: new Date("2025-10-27T12:45:00"),
      subjectId: 2,
      classId: 5,
      teacherId: teachers[0].id,
    },
    {
      name: "Mathematics - Problem Solving",
      day: Day.MONDAY,
      startTime: new Date("2025-10-27T14:00:00"),
      endTime: new Date("2025-10-27T15:00:00"),
      subjectId: 1,
      classId: 7,
      teacherId: teachers[0].id,
    },

    // TUESDAY - Divya Sharma
    {
      name: "English - Reading Comprehension",
      day: Day.TUESDAY,
      startTime: new Date("2025-10-28T08:00:00"),
      endTime: new Date("2025-10-28T09:00:00"),
      subjectId: 2,
      classId: 2,
      teacherId: teachers[0].id,
    },
    {
      name: "Mathematics - Geometry Basics",
      day: Day.TUESDAY,
      startTime: new Date("2025-10-28T09:15:00"),
      endTime: new Date("2025-10-28T10:15:00"),
      subjectId: 1,
      classId: 4,
      teacherId: teachers[0].id,
    },
    {
      name: "English - Poem Recitation",
      day: Day.TUESDAY,
      startTime: new Date("2025-10-28T10:30:00"),
      endTime: new Date("2025-10-28T11:30:00"),
      subjectId: 2,
      classId: 6,
      teacherId: teachers[0].id,
    },
    {
      name: "Mathematics - Multiplication Tables",
      day: Day.TUESDAY,
      startTime: new Date("2025-10-28T11:45:00"),
      endTime: new Date("2025-10-28T12:45:00"),
      subjectId: 1,
      classId: 8,
      teacherId: teachers[0].id,
    },
    {
      name: "English - Essay Writing",
      day: Day.TUESDAY,
      startTime: new Date("2025-10-28T14:00:00"),
      endTime: new Date("2025-10-28T15:00:00"),
      subjectId: 2,
      classId: 9,
      teacherId: teachers[0].id,
    },

    // WEDNESDAY - Divya Sharma
    {
      name: "Mathematics - Division & Fractions",
      day: Day.WEDNESDAY,
      startTime: new Date("2025-10-29T08:00:00"),
      endTime: new Date("2025-10-29T09:00:00"),
      subjectId: 1,
      classId: 1,
      teacherId: teachers[0].id,
    },
    {
      name: "English - Story Reading & Discussion",
      day: Day.WEDNESDAY,
      startTime: new Date("2025-10-29T09:15:00"),
      endTime: new Date("2025-10-29T10:15:00"),
      subjectId: 2,
      classId: 3,
      teacherId: teachers[0].id,
    },
    {
      name: "Mathematics - Word Problems",
      day: Day.WEDNESDAY,
      startTime: new Date("2025-10-29T10:30:00"),
      endTime: new Date("2025-10-29T11:30:00"),
      subjectId: 1,
      classId: 5,
      teacherId: teachers[0].id,
    },
    {
      name: "English - Speaking & Listening Skills",
      day: Day.WEDNESDAY,
      startTime: new Date("2025-10-29T11:45:00"),
      endTime: new Date("2025-10-29T12:45:00"),
      subjectId: 2,
      classId: 7,
      teacherId: teachers[0].id,
    },
    {
      name: "Mathematics - Mental Math Practice",
      day: Day.WEDNESDAY,
      startTime: new Date("2025-10-29T14:00:00"),
      endTime: new Date("2025-10-29T15:00:00"),
      subjectId: 1,
      classId: 11,
      teacherId: teachers[0].id,
    },

    // THURSDAY - Divya Sharma
    {
      name: "English - Vocabulary Building",
      day: Day.THURSDAY,
      startTime: new Date("2025-10-30T08:00:00"),
      endTime: new Date("2025-10-30T09:00:00"),
      subjectId: 2,
      classId: 4,
      teacherId: teachers[0].id,
    },
    {
      name: "Mathematics - Shapes & Patterns",
      day: Day.THURSDAY,
      startTime: new Date("2025-10-30T09:15:00"),
      endTime: new Date("2025-10-30T10:15:00"),
      subjectId: 1,
      classId: 2,
      teacherId: teachers[0].id,
    },
    {
      name: "English - Grammar Practice",
      day: Day.THURSDAY,
      startTime: new Date("2025-10-30T10:30:00"),
      endTime: new Date("2025-10-30T11:30:00"),
      subjectId: 2,
      classId: 8,
      teacherId: teachers[0].id,
    },
    {
      name: "Mathematics - Data Handling",
      day: Day.THURSDAY,
      startTime: new Date("2025-10-30T11:45:00"),
      endTime: new Date("2025-10-30T12:45:00"),
      subjectId: 1,
      classId: 10,
      teacherId: teachers[0].id,
    },
    {
      name: "English - Literature Appreciation",
      day: Day.THURSDAY,
      startTime: new Date("2025-10-30T14:00:00"),
      endTime: new Date("2025-10-30T15:00:00"),
      subjectId: 2,
      classId: 12,
      teacherId: teachers[0].id,
    },

    // FRIDAY - Divya Sharma
    {
      name: "Mathematics - Algebra Introduction",
      day: Day.FRIDAY,
      startTime: new Date("2025-10-31T08:00:00"),
      endTime: new Date("2025-10-31T09:00:00"),
      subjectId: 1,
      classId: 6,
      teacherId: teachers[0].id,
    },
    {
      name: "English - Rhymes & Songs",
      day: Day.FRIDAY,
      startTime: new Date("2025-10-31T09:15:00"),
      endTime: new Date("2025-10-31T10:15:00"),
      subjectId: 2,
      classId: 1,
      teacherId: teachers[0].id,
    },
    {
      name: "Mathematics - Revision & Practice",
      day: Day.FRIDAY,
      startTime: new Date("2025-10-31T10:30:00"),
      endTime: new Date("2025-10-31T11:30:00"),
      subjectId: 1,
      classId: 9,
      teacherId: teachers[0].id,
    },
    {
      name: "English - Creative Expression",
      day: Day.FRIDAY,
      startTime: new Date("2025-10-31T11:45:00"),
      endTime: new Date("2025-10-31T12:45:00"),
      subjectId: 2,
      classId: 11,
      teacherId: teachers[0].id,
    },

    // ========== OTHER TEACHERS' SCHEDULES (Selective, No Conflicts) ==========

    // ARUN VERMA (Teacher 1 - Science & Art)
    {
      name: "Science - Biology Lab",
      day: Day.MONDAY,
      startTime: new Date("2025-10-27T08:00:00"),
      endTime: new Date("2025-10-27T09:00:00"),
      subjectId: 3,
      classId: 2,
      teacherId: teachers[1].id,
    },
    {
      name: "Science - Physics Experiments",
      day: Day.TUESDAY,
      startTime: new Date("2025-10-28T08:00:00"),
      endTime: new Date("2025-10-28T09:30:00"),
      subjectId: 3,
      classId: 6,
      teacherId: teachers[1].id,
    },
    {
      name: "Art - Drawing & Painting",
      day: Day.WEDNESDAY,
      startTime: new Date("2025-10-29T10:30:00"),
      endTime: new Date("2025-10-29T11:30:00"),
      subjectId: 6,
      classId: 4,
      teacherId: teachers[1].id,
    },
    {
      name: "Science - Environmental Studies",
      day: Day.FRIDAY,
      startTime: new Date("2025-10-31T08:00:00"),
      endTime: new Date("2025-10-31T09:00:00"),
      subjectId: 3,
      classId: 8,
      teacherId: teachers[1].id,
    },

    // ANJALI GUPTA (Teacher 2 - Computer Science & Hindi)
    {
      name: "Computer Science - Python Programming",
      day: Day.MONDAY,
      startTime: new Date("2025-10-27T08:00:00"),
      endTime: new Date("2025-10-27T09:30:00"),
      subjectId: 8,
      classId: 9,
      teacherId: teachers[2].id,
    },
    {
      name: "Hindi - Grammar & Composition",
      day: Day.TUESDAY,
      startTime: new Date("2025-10-28T10:30:00"),
      endTime: new Date("2025-10-28T11:30:00"),
      subjectId: 9,
      classId: 3,
      teacherId: teachers[2].id,
    },
    {
      name: "Computer Science - Web Development Basics",
      day: Day.WEDNESDAY,
      startTime: new Date("2025-10-29T08:00:00"),
      endTime: new Date("2025-10-29T09:30:00"),
      subjectId: 8,
      classId: 11,
      teacherId: teachers[2].id,
    },
    {
      name: "Hindi - Literature & Poetry",
      day: Day.THURSDAY,
      startTime: new Date("2025-10-30T10:30:00"),
      endTime: new Date("2025-10-30T11:30:00"),
      subjectId: 9,
      classId: 5,
      teacherId: teachers[2].id,
    },
    {
      name: "Computer Science - Digital Literacy",
      day: Day.FRIDAY,
      startTime: new Date("2025-10-31T08:00:00"),
      endTime: new Date("2025-10-31T09:30:00"),
      subjectId: 8,
      classId: 7,
      teacherId: teachers[2].id,
    },

    // VIKRAM PATEL (Teacher 3 - Social Studies & History)
    {
      name: "History - Ancient India",
      day: Day.MONDAY,
      startTime: new Date("2025-10-27T09:15:00"),
      endTime: new Date("2025-10-27T10:15:00"),
      subjectId: 10,
      classId: 6,
      teacherId: teachers[3].id,
    },
    {
      name: "Social Studies - Geography of India",
      day: Day.TUESDAY,
      startTime: new Date("2025-10-28T08:00:00"),
      endTime: new Date("2025-10-28T09:00:00"),
      subjectId: 4,
      classId: 5,
      teacherId: teachers[3].id,
    },
    {
      name: "History - Freedom Struggle",
      day: Day.WEDNESDAY,
      startTime: new Date("2025-10-29T09:15:00"),
      endTime: new Date("2025-10-29T10:15:00"),
      subjectId: 10,
      classId: 8,
      teacherId: teachers[3].id,
    },
    {
      name: "Social Studies - Civics & Government",
      day: Day.FRIDAY,
      startTime: new Date("2025-10-31T10:30:00"),
      endTime: new Date("2025-10-31T11:30:00"),
      subjectId: 4,
      classId: 10,
      teacherId: teachers[3].id,
    },

    // MEERA DESAI (Teacher 4 - PE & Music)
    {
      name: "Physical Education - Yoga & Meditation",
      day: Day.MONDAY,
      startTime: new Date("2025-10-27T10:30:00"),
      endTime: new Date("2025-10-27T11:30:00"),
      subjectId: 5,
      classId: 4,
      teacherId: teachers[4].id,
    },
    {
      name: "Music - Indian Classical Music",
      day: Day.TUESDAY,
      startTime: new Date("2025-10-28T11:45:00"),
      endTime: new Date("2025-10-28T12:45:00"),
      subjectId: 7,
      classId: 2,
      teacherId: teachers[4].id,
    },
    {
      name: "Physical Education - Cricket Practice",
      day: Day.WEDNESDAY,
      startTime: new Date("2025-10-29T08:00:00"),
      endTime: new Date("2025-10-29T09:00:00"),
      subjectId: 5,
      classId: 10,
      teacherId: teachers[4].id,
    },
    {
      name: "Music - Devotional Songs",
      day: Day.THURSDAY,
      startTime: new Date("2025-10-30T11:45:00"),
      endTime: new Date("2025-10-30T12:45:00"),
      subjectId: 7,
      classId: 6,
      teacherId: teachers[4].id,
    },
    {
      name: "Physical Education - Sports Day Preparation",
      day: Day.FRIDAY,
      startTime: new Date("2025-10-31T10:30:00"),
      endTime: new Date("2025-10-31T11:30:00"),
      subjectId: 5,
      classId: 12,
      teacherId: teachers[4].id,
    },
  ];

  for (const lesson of lessons) {
    await prisma.lesson.create({ data: lesson });
  }

  // PARENT
  const parents = [
    {
      id: "user_34pzlCYadgZhLrf1MiHuDnknmAY",
      username: "suresh.kumar",
      name: "Suresh",
      surname: "Kumar",
      email: "suresh.kumar@email.com",
      phone: "+91-9876-543-301",
      address: "111 Ahmedabad, Gujarat 380006",
    },
    {
      id: "user_34pzsp4BH94TPXTP1bOqFVzvWP9",
      username: "pallavi.joshi",
      name: "Pallavi",
      surname: "Joshi",
      email: "pallavi.joshi@email.com",
      phone: "+91-9876-543-302",
      address: "222 Vadodara, Gujarat 390011",
    },
    {
      id: "user_34pzzPC8VLU4FutobhjarQMgrJd",
      username: "nikhil.reddy",
      name: "Nikhil",
      surname: "Reddy",
      email: "nikhil.reddy@email.com",
      phone: "+91-9876-543-303",
      address: "333 Surat, Gujarat 395002",
    },
    {
      id: "user_A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P",
      username: "deepali.nair",
      name: "Deepali",
      surname: "Nair",
      email: "deepali.nair@email.com",
      phone: "+91-9876-543-304",
      address: "444 Rajkot, Gujarat 360005",
    },
    {
      id: "user_B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q",
      username: "arjun.singh",
      name: "Arjun",
      surname: "Singh",
      email: "arjun.singh@email.com",
      phone: "+91-9876-543-305",
      address: "555 Jamnagar, Gujarat 361002",
    },
    {
      id: "user_C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R",
      username: "neha.rao",
      name: "Neha",
      surname: "Rao",
      email: "neha.rao@email.com",
      phone: "+91-9876-543-306",
      address: "666 Gandhinagar, Gujarat 382010",
    },
    {
      id: "user_D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S",
      username: "rohan.kapoor",
      name: "Rohan",
      surname: "Kapoor",
      email: "rohan.kapoor@email.com",
      phone: "+91-9876-543-307",
      address: "777 Anand, Gujarat 388001",
    },
    {
      id: "user_E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T",
      username: "pooja.saxena",
      name: "Pooja",
      surname: "Saxena",
      email: "pooja.saxena@email.com",
      phone: "+91-9876-543-308",
      address: "888 Bhavnagar, Gujarat 364001",
    },
    {
      id: "user_F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U",
      username: "manoj.pandey",
      name: "Manoj",
      surname: "Pandey",
      email: "manoj.pandey@email.com",
      phone: "+91-9876-543-309",
      address: "999 Junagadh, Gujarat 362001",
    },
    {
      id: "user_G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V",
      username: "kavya.iyer",
      name: "Kavya",
      surname: "Iyer",
      email: "kavya.iyer@email.com",
      phone: "+91-9876-543-310",
      address: "1010 Mehsana, Gujarat 384001",
    },
    {
      id: "user_H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W",
      username: "ravi.mishra",
      name: "Ravi",
      surname: "Mishra",
      email: "ravi.mishra@email.com",
      phone: "+91-9876-543-311",
      address: "1111 Morbi, Gujarat 363641",
    },
    {
      id: "user_I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X",
      username: "sneha.bhat",
      name: "Sneha",
      surname: "Bhat",
      email: "sneha.bhat@email.com",
      phone: "+91-9876-543-312",
      address: "1212 Mahesana, Gujarat 384001",
    },
    {
      id: "user_J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y",
      username: "varun.tyagi",
      name: "Varun",
      surname: "Tyagi",
      email: "varun.tyagi@email.com",
      phone: "+91-9876-543-313",
      address: "1313 Navsari, Gujarat 396445",
    },
    {
      id: "user_K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z",
      username: "sonali.das",
      name: "Sonali",
      surname: "Das",
      email: "sonali.das@email.com",
      phone: "+91-9876-543-314",
      address: "1414 Vapi, Gujarat 396195",
    },
    {
      id: "user_L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A",
      username: "prateek.singh",
      name: "Prateek",
      surname: "Singh",
      email: "prateek.singh@email.com",
      phone: "+91-9876-543-315",
      address: "1515 Godhra, Gujarat 389001",
    },
  ];

  for (const parent of parents) {
    await prisma.parent.create({ data: parent });
  }

  // STUDENT
  const students = [
    // Grade 1 - Class 1A (capacity: 25)
    {
      id: "user_34q0E8kndSismvLQKuWBuZo5Nma",
      username: "aditya.patel",
      name: "Aditya",
      surname: "Patel",
      email: "aditya.patel@student.edu",
      phone: "+91-9876-543-401",
      address: "111 Ahmedabad, Gujarat 380006",
      bloodType: "A+",
      sex: UserSex.MALE,
      parentId: parents[0].id,
      gradeId: 1,
      classId: 1,
      birthday: new Date("2018-06-15"),
    },
    {
      id: "user_B1C2D3E4F5G6H7I8J9K0L1M2N3O4P5Q",
      username: "isha.sharma",
      name: "Isha",
      surname: "Sharma",
      email: "isha.sharma@student.edu",
      phone: "+91-9876-543-402",
      address: "222 Vadodara, Gujarat 390011",
      bloodType: "O-",
      sex: UserSex.FEMALE,
      parentId: parents[1].id,
      gradeId: 1,
      classId: 1,
      birthday: new Date("2018-09-22"),
    },
    {
      id: "user_C2D3E4F5G6H7I8J9K0L1M2N3O4P5Q6R",
      username: "rohan.verma",
      name: "Rohan",
      surname: "Verma",
      email: "rohan.verma@student.edu",
      phone: "+91-9876-543-403",
      address: "333 Surat, Gujarat 395002",
      bloodType: "B+",
      sex: UserSex.MALE,
      parentId: parents[2].id,
      gradeId: 1,
      classId: 1,
      birthday: new Date("2018-03-08"),
    },
    {
      id: "user_D3E4F5G6H7I8J9K0L1M2N3O4P5Q6R7S",
      username: "ananya.gupta",
      name: "Ananya",
      surname: "Gupta",
      email: "ananya.gupta@student.edu",
      phone: "+91-9876-543-404",
      address: "444 Rajkot, Gujarat 360005",
      bloodType: "AB+",
      sex: UserSex.FEMALE,
      parentId: parents[3].id,
      gradeId: 1,
      classId: 1,
      birthday: new Date("2018-12-01"),
    },
    {
      id: "user_E4F5G6H7I8J9K0L1M2N3O4P5Q6R7S8T",
      username: "aryan.nair",
      name: "Aryan",
      surname: "Nair",
      email: "aryan.nair@student.edu",
      phone: "+91-9876-543-405",
      address: "555 Jamnagar, Gujarat 361002",
      bloodType: "A-",
      sex: UserSex.MALE,
      parentId: parents[4].id,
      gradeId: 1,
      classId: 1,
      birthday: new Date("2018-07-14"),
    },

    // Grade 1 - Class 1B (capacity: 24)
    {
      id: "user_F5G6H7I8J9K0L1M2N3O4P5Q6R7S8T9U",
      username: "diya.desai",
      name: "Diya",
      surname: "Desai",
      email: "diya.desai@student.edu",
      phone: "+91-9876-543-406",
      address: "666 Gandhinagar, Gujarat 382010",
      bloodType: "B-",
      sex: UserSex.FEMALE,
      parentId: parents[5].id,
      gradeId: 1,
      classId: 2,
      birthday: new Date("2018-11-30"),
    },
    {
      id: "user_G6H7I8J9K0L1M2N3O4P5Q6R7S8T9U0V",
      username: "vivek.rao",
      name: "Vivek",
      surname: "Rao",
      email: "vivek.rao@student.edu",
      phone: "+91-9876-543-407",
      address: "777 Anand, Gujarat 388001",
      bloodType: "O+",
      sex: UserSex.MALE,
      parentId: parents[6].id,
      gradeId: 1,
      classId: 2,
      birthday: new Date("2018-05-25"),
    },
    {
      id: "user_H7I8J9K0L1M2N3O4P5Q6R7S8T9U0V1W",
      username: "sneha.kapoor",
      name: "Sneha",
      surname: "Kapoor",
      email: "sneha.kapoor@student.edu",
      phone: "+91-9876-543-408",
      address: "888 Bhavnagar, Gujarat 364001",
      bloodType: "A+",
      sex: UserSex.FEMALE,
      parentId: parents[7].id,
      gradeId: 1,
      classId: 2,
      birthday: new Date("2018-08-19"),
    },

    // Grade 2 - Class 2A (capacity: 26)
    {
      id: "user_I8J9K0L1M2N3O4P5Q6R7S8T9U0V1W2X",
      username: "arjun.joshi",
      name: "Arjun",
      surname: "Joshi",
      email: "arjun.joshi@student.edu",
      phone: "+91-9876-543-409",
      address: "999 Junagadh, Gujarat 362001",
      bloodType: "AB-",
      sex: UserSex.MALE,
      parentId: parents[8].id,
      gradeId: 2,
      classId: 3,
      birthday: new Date("2017-04-12"),
    },
    {
      id: "user_J9K0L1M2N3O4P5Q6R7S8T9U0V1W2X3Y",
      username: "riya.singh",
      name: "Riya",
      surname: "Singh",
      email: "riya.singh@student.edu",
      phone: "+91-9876-543-410",
      address: "1010 Mehsana, Gujarat 384001",
      bloodType: "B+",
      sex: UserSex.FEMALE,
      parentId: parents[9].id,
      gradeId: 2,
      classId: 3,
      birthday: new Date("2017-10-05"),
    },
    {
      id: "user_K0L1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z",
      username: "karan.pandey",
      name: "Karan",
      surname: "Pandey",
      email: "karan.pandey@student.edu",
      phone: "+91-9876-543-411",
      address: "1111 Morbi, Gujarat 363641",
      bloodType: "O-",
      sex: UserSex.MALE,
      parentId: parents[10].id,
      gradeId: 2,
      classId: 3,
      birthday: new Date("2017-01-28"),
    },

    // Grade 2 - Class 2B (capacity: 23)
    {
      id: "user_L1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z5A",
      username: "pooja.bhat",
      name: "Pooja",
      surname: "Bhat",
      email: "pooja.bhat@student.edu",
      phone: "+91-9876-543-412",
      address: "1212 Mahesana, Gujarat 384001",
      bloodType: "A+",
      sex: UserSex.FEMALE,
      parentId: parents[11].id,
      gradeId: 2,
      classId: 4,
      birthday: new Date("2017-06-17"),
    },
    {
      id: "user_M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z5A6B",
      username: "nirav.desai",
      name: "Nirav",
      surname: "Desai",
      email: "nirav.desai@student.edu",
      phone: "+91-9876-543-413",
      address: "1313 Navsari, Gujarat 396445",
      bloodType: "B-",
      sex: UserSex.MALE,
      parentId: parents[12].id,
      gradeId: 2,
      classId: 4,
      birthday: new Date("2017-09-03"),
    },

    // Grade 3 - Class 3A (capacity: 25)
    {
      id: "user_N3O4P5Q6R7S8T9U0V1W2X3Y4Z5A6B7C",
      username: "avni.sharma",
      name: "Avni",
      surname: "Sharma",
      email: "avni.sharma@student.edu",
      phone: "+91-9876-543-414",
      address: "1414 Vapi, Gujarat 396195",
      bloodType: "AB+",
      sex: UserSex.FEMALE,
      parentId: parents[13].id,
      gradeId: 3,
      classId: 5,
      birthday: new Date("2016-02-14"),
    },
    {
      id: "user_O4P5Q6R7S8T9U0V1W2X3Y4Z5A6B7C8D",
      username: "harsh.verma",
      name: "Harsh",
      surname: "Verma",
      email: "harsh.verma@student.edu",
      phone: "+91-9876-543-415",
      address: "1515 Godhra, Gujarat 389001",
      bloodType: "O+",
      sex: UserSex.MALE,
      parentId: parents[14].id,
      gradeId: 3,
      classId: 5,
      birthday: new Date("2016-07-09"),
    },
    {
      id: "user_34q0MmEOwxh7k1vE8z3JRi75hDr",
      username: "divya.patel",
      name: "Divya",
      surname: "Patel",
      email: "divya.patel@student.edu",
      phone: "+91-9876-543-416",
      address: "1616 Ahmedabad, Gujarat 380015",
      bloodType: "A-",
      sex: UserSex.FEMALE,
      parentId: parents[0].id,
      gradeId: 3,
      classId: 5,
      birthday: new Date("2016-11-21"),
    },

    // Grade 3 - Class 3B (capacity: 24)
    {
      id: "user_Q6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E0F",
      username: "yash.gupta",
      name: "Yash",
      surname: "Gupta",
      email: "yash.gupta@student.edu",
      phone: "+91-9876-543-417",
      address: "1717 Vadodara, Gujarat 390001",
      bloodType: "B+",
      sex: UserSex.MALE,
      parentId: parents[1].id,
      gradeId: 3,
      classId: 6,
      birthday: new Date("2016-04-06"),
    },
    {
      id: "user_R7S8T9U0V1W2X3Y4Z5A6B7C8D9E0F1G",
      username: "tiya.reddy",
      name: "Tiya",
      surname: "Reddy",
      email: "tiya.reddy@student.edu",
      phone: "+91-9876-543-418",
      address: "1818 Surat, Gujarat 395001",
      bloodType: "O-",
      sex: UserSex.FEMALE,
      parentId: parents[2].id,
      gradeId: 3,
      classId: 6,
      birthday: new Date("2016-08-30"),
    },

    // Grade 4 - Class 4A (capacity: 26)
    {
      id: "user_S8T9U0V1W2X3Y4Z5A6B7C8D9E0F1G2H",
      username: "krishna.nair",
      name: "Krishna",
      surname: "Nair",
      email: "krishna.nair@student.edu",
      phone: "+91-9876-543-419",
      address: "1919 Rajkot, Gujarat 360001",
      bloodType: "AB-",
      sex: UserSex.MALE,
      parentId: parents[3].id,
      gradeId: 4,
      classId: 7,
      birthday: new Date("2015-01-11"),
    },
    {
      id: "user_T9U0V1W2X3Y4Z5A6B7C8D9E0F1G2H3I",
      username: "esha.saxena",
      name: "Esha",
      surname: "Saxena",
      email: "esha.saxena@student.edu",
      phone: "+91-9876-543-420",
      address: "2020 Jamnagar, Gujarat 361001",
      bloodType: "A+",
      sex: UserSex.FEMALE,
      parentId: parents[4].id,
      gradeId: 4,
      classId: 7,
      birthday: new Date("2015-05-27"),
    },
    {
      id: "user_U0V1W2X3Y4Z5A6B7C8D9E0F1G2H3I4J",
      username: "manish.iyer",
      name: "Manish",
      surname: "Iyer",
      email: "manish.iyer@student.edu",
      phone: "+91-9876-543-421",
      address: "2121 Gandhinagar, Gujarat 382010",
      bloodType: "B-",
      sex: UserSex.MALE,
      parentId: parents[5].id,
      gradeId: 4,
      classId: 7,
      birthday: new Date("2015-10-13"),
    },

    // Grade 4 - Class 4B (capacity: 23)
    {
      id: "user_V1W2X3Y4Z5A6B7C8D9E0F1G2H3I4J5K",
      username: "anjali.mishra",
      name: "Anjali",
      surname: "Mishra",
      email: "anjali.mishra@student.edu",
      phone: "+91-9876-543-422",
      address: "2222 Anand, Gujarat 388001",
      bloodType: "O+",
      sex: UserSex.FEMALE,
      parentId: parents[6].id,
      gradeId: 4,
      classId: 8,
      birthday: new Date("2015-03-19"),
    },
    {
      id: "user_W2X3Y4Z5A6B7C8D9E0F1G2H3I4J5K6L",
      username: "sid.tyagi",
      name: "Sid",
      surname: "Tyagi",
      email: "sid.tyagi@student.edu",
      phone: "+91-9876-543-423",
      address: "2323 Bhavnagar, Gujarat 364001",
      bloodType: "AB+",
      sex: UserSex.MALE,
      parentId: parents[7].id,
      gradeId: 4,
      classId: 8,
      birthday: new Date("2015-07-04"),
    },

    // Grade 5 - Class 5A (capacity: 25)
    {
      id: "user_X3Y4Z5A6B7C8D9E0F1G2H3I4J5K6L7M",
      username: "elina.bhat",
      name: "Elina",
      surname: "Bhat",
      email: "elina.bhat@student.edu",
      phone: "+91-9876-543-424",
      address: "2424 Junagadh, Gujarat 362001",
      bloodType: "A-",
      sex: UserSex.FEMALE,
      parentId: parents[8].id,
      gradeId: 5,
      classId: 9,
      birthday: new Date("2014-12-08"),
    },
    {
      id: "user_Y4Z5A6B7C8D9E0F1G2H3I4J5K6L7M8N",
      username: "jay.patel",
      name: "Jay",
      surname: "Patel",
      email: "jay.patel@student.edu",
      phone: "+91-9876-543-425",
      address: "2525 Mehsana, Gujarat 384001",
      bloodType: "B+",
      sex: UserSex.MALE,
      parentId: parents[9].id,
      gradeId: 5,
      classId: 9,
      birthday: new Date("2014-06-23"),
    },
    {
      id: "user_Z5A6B7C8D9E0F1G2H3I4J5K6L7M8N9O",
      username: "gauri.desai",
      name: "Gauri",
      surname: "Desai",
      email: "gauri.desai@student.edu",
      phone: "+91-9876-543-426",
      address: "2626 Morbi, Gujarat 363641",
      bloodType: "O-",
      sex: UserSex.FEMALE,
      parentId: parents[10].id,
      gradeId: 5,
      classId: 9,
      birthday: new Date("2014-09-16"),
    },

    // Grade 5 - Class 5B (capacity: 24)
    {
      id: "user_0A6B7C8D9E0F1G2H3I4J5K6L7M8N9O0P",
      username: "hari.sharma",
      name: "Hari",
      surname: "Sharma",
      email: "hari.sharma@student.edu",
      phone: "+91-9876-543-427",
      address: "2727 Mahesana, Gujarat 384001",
      bloodType: "AB-",
      sex: UserSex.MALE,
      parentId: parents[11].id,
      gradeId: 5,
      classId: 10,
      birthday: new Date("2014-02-28"),
    },
    {
      id: "user_1B7C8D9E0F1G2H3I4J5K6L7M8N9O0P1Q",
      username: "zoya.kapoor",
      name: "Zoya",
      surname: "Kapoor",
      email: "zoya.kapoor@student.edu",
      phone: "+91-9876-543-428",
      address: "2828 Navsari, Gujarat 396445",
      bloodType: "A+",
      sex: UserSex.FEMALE,
      parentId: parents[12].id,
      gradeId: 5,
      classId: 10,
      birthday: new Date("2014-08-11"),
    },

    // Grade 6 - Class 6A (capacity: 26)
    {
      id: "user_2C8D9E0F1G2H3I4J5K6L7M8N9O0P1Q2R",
      username: "dev.reddy",
      name: "Dev",
      surname: "Reddy",
      email: "dev.reddy@student.edu",
      phone: "+91-9876-543-429",
      address: "2929 Vapi, Gujarat 396195",
      bloodType: "B-",
      sex: UserSex.MALE,
      parentId: parents[13].id,
      gradeId: 6,
      classId: 11,
      birthday: new Date("2013-01-05"),
    },
    {
      id: "user_3D9E0F1G2H3I4J5K6L7M8N9O0P1Q2R3S",
      username: "nisha.verma",
      name: "Nisha",
      surname: "Verma",
      email: "nisha.verma@student.edu",
      phone: "+91-9876-543-430",
      address: "3030 Godhra, Gujarat 389001",
      bloodType: "O+",
      sex: UserSex.FEMALE,
      parentId: parents[14].id,
      gradeId: 6,
      classId: 11,
      birthday: new Date("2013-05-20"),
    },
    {
      id: "user_34q0UBRYLxsZMR4L13xDspcbYJV",
      username: "om.patel",
      name: "Om",
      surname: "Patel",
      email: "om.patel@student.edu",
      phone: "+91-9876-543-431",
      address: "3131 Ahmedabad, Gujarat 380006",
      bloodType: "AB+",
      sex: UserSex.MALE,
      parentId: parents[0].id,
      gradeId: 6,
      classId: 11,
      birthday: new Date("2013-10-07"),
    },

    // Grade 6 - Class 6B (capacity: 23)
    {
      id: "user_5F1G2H3I4J5K6L7M8N9O0P1Q2R3S4T5U",
      username: "saanvi.nair",
      name: "Saanvi",
      surname: "Nair",
      email: "saanvi.nair@student.edu",
      phone: "+91-9876-543-432",
      address: "3232 Vadodara, Gujarat 390001",
      bloodType: "A-",
      sex: UserSex.FEMALE,
      parentId: parents[1].id,
      gradeId: 6,
      classId: 12,
      birthday: new Date("2013-03-14"),
    },
    {
      id: "user_6G2H3I4J5K6L7M8N9O0P1Q2R3S4T5U6V",
      username: "rahul.rao",
      name: "Rahul",
      surname: "Rao",
      email: "rahul.rao@student.edu",
      phone: "+91-9876-543-433",
      address: "3333 Surat, Gujarat 395002",
      bloodType: "B+",
      sex: UserSex.MALE,
      parentId: parents[2].id,
      gradeId: 6,
      classId: 12,
      birthday: new Date("2013-07-29"),
    },
  ];

  for (const student of students) {
    await prisma.student.create({ data: student });
  }

  // EXAM - Updated with upcoming exams
  const exams = [
    {
      title: "Mathematics Midterm - Grade 1",
      startTime: new Date("2025-11-15T09:00:00"),
      endTime: new Date("2025-11-15T11:00:00"),
      lessonId: 1,
    },
    {
      title: "Creative Writing Assessment",
      startTime: new Date("2025-11-18T10:00:00"),
      endTime: new Date("2025-11-18T11:30:00"),
      lessonId: 2,
    },
    {
      title: "Biology Lab Practical - Grade 2",
      startTime: new Date("2025-11-20T08:00:00"),
      endTime: new Date("2025-11-20T10:00:00"),
      lessonId: 3,
    },
    {
      title: "Ancient History Final Exam",
      startTime: new Date("2025-11-22T09:00:00"),
      endTime: new Date("2025-11-22T11:00:00"),
      lessonId: 4,
    },
    {
      title: "Python Programming Project Demo",
      startTime: new Date("2025-11-25T13:00:00"),
      endTime: new Date("2025-11-25T15:30:00"),
      lessonId: 5,
    },
    {
      title: "Physical Fitness Assessment",
      startTime: new Date("2025-11-27T11:00:00"),
      endTime: new Date("2025-11-27T12:00:00"),
      lessonId: 6,
    },
  ];

  for (const exam of exams) {
    await prisma.exam.create({ data: exam });
  }

  // ASSIGNMENT - Updated with current assignments
  const assignments = [
    {
      title: "Ancient Egypt Research Paper",
      startDate: new Date("2025-10-28"),
      dueDate: new Date("2025-11-10"),
      lessonId: 4,
    },
    {
      title: "Python Calculator App Project",
      startDate: new Date("2025-10-29"),
      dueDate: new Date("2025-11-18"),
      lessonId: 5,
    },
    {
      title: "Cell Biology Diagram & Report",
      startDate: new Date("2025-10-30"),
      dueDate: new Date("2025-11-08"),
      lessonId: 3,
    },
    {
      title: "Short Story Writing - Personal Narrative",
      startDate: new Date("2025-10-31"),
      dueDate: new Date("2025-11-12"),
      lessonId: 2,
    },
    {
      title: "Algebraic Equations Problem Set",
      startDate: new Date("2025-11-01"),
      dueDate: new Date("2025-11-14"),
      lessonId: 1,
    },
    {
      title: "Hindi Vocabulary & Grammar Practice",
      startDate: new Date("2025-10-29"),
      dueDate: new Date("2025-11-07"),
      lessonId: 8,
    },
  ];

  for (const assignment of assignments) {
    await prisma.assignment.create({ data: assignment });
  }

  // RESULT
  const results = [
    // Mathematics Midterm results
    { score: 85, studentId: students[0].id, examId: 1 },
    { score: 92, studentId: students[1].id, examId: 1 },
    { score: 78, studentId: students[2].id, examId: 1 },
    { score: 88, studentId: students[3].id, examId: 1 },
    { score: 95, studentId: students[4].id, examId: 1 },
    { score: 82, studentId: students[5].id, examId: 1 },
    { score: 89, studentId: students[6].id, examId: 1 },
    { score: 76, studentId: students[7].id, examId: 1 },

    // English Literature Quiz results
    { score: 87, studentId: students[0].id, examId: 2 },
    { score: 93, studentId: students[1].id, examId: 2 },
    { score: 91, studentId: students[2].id, examId: 2 },
    { score: 84, studentId: students[3].id, examId: 2 },
    { score: 96, studentId: students[4].id, examId: 2 },
    { score: 79, studentId: students[5].id, examId: 2 },

    // Chemistry Lab Test results
    { score: 88, studentId: students[8].id, examId: 3 },
    { score: 94, studentId: students[9].id, examId: 3 },
    { score: 81, studentId: students[10].id, examId: 3 },
    { score: 89, studentId: students[11].id, examId: 3 },
    { score: 92, studentId: students[12].id, examId: 3 },

    // History Essay assignments
    { score: 86, studentId: students[1].id, assignmentId: 1 },
    { score: 91, studentId: students[3].id, assignmentId: 1 },
    { score: 78, studentId: students[5].id, assignmentId: 1 },
    { score: 93, studentId: students[7].id, assignmentId: 1 },
    { score: 85, studentId: students[9].id, assignmentId: 1 },

    // Programming Project assignments
    { score: 90, studentId: students[13].id, assignmentId: 2 },
    { score: 87, studentId: students[14].id, assignmentId: 2 },
    { score: 95, studentId: students[15].id, assignmentId: 2 },
    { score: 88, studentId: students[16].id, assignmentId: 2 },
    { score: 92, studentId: students[17].id, assignmentId: 2 },
  ];

  for (const result of results) {
    await prisma.result.create({ data: result });
  }

  // ATTENDANCE - Updated with current week attendance
  const attendances = [
    // Monday (Oct 28) attendance for various lessons
    {
      date: new Date("2025-10-28"),
      present: true,
      studentId: students[0].id,
      lessonId: 1,
    },
    {
      date: new Date("2025-10-28"),
      present: true,
      studentId: students[1].id,
      lessonId: 1,
    },
    {
      date: new Date("2025-10-28"),
      present: false,
      studentId: students[2].id,
      lessonId: 1,
    },
    {
      date: new Date("2025-10-28"),
      present: true,
      studentId: students[3].id,
      lessonId: 1,
    },
    {
      date: new Date("2025-10-28"),
      present: true,
      studentId: students[4].id,
      lessonId: 1,
    },
    {
      date: new Date("2025-10-28"),
      present: true,
      studentId: students[5].id,
      lessonId: 1,
    },
    {
      date: new Date("2025-10-28"),
      present: true,
      studentId: students[6].id,
      lessonId: 1,
    },
    {
      date: new Date("2025-10-28"),
      present: true,
      studentId: students[7].id,
      lessonId: 1,
    },

    // Creative Writing lesson attendance
    {
      date: new Date("2025-10-28"),
      present: true,
      studentId: students[0].id,
      lessonId: 2,
    },
    {
      date: new Date("2025-10-28"),
      present: true,
      studentId: students[1].id,
      lessonId: 2,
    },
    {
      date: new Date("2025-10-28"),
      present: true,
      studentId: students[2].id,
      lessonId: 2,
    },
    {
      date: new Date("2025-10-28"),
      present: false,
      studentId: students[3].id,
      lessonId: 2,
    },
    {
      date: new Date("2025-10-28"),
      present: true,
      studentId: students[4].id,
      lessonId: 2,
    },

    // Tuesday (Oct 29) attendance for biology lessons
    {
      date: new Date("2025-10-29"),
      present: true,
      studentId: students[8].id,
      lessonId: 3,
    },
    {
      date: new Date("2025-10-29"),
      present: true,
      studentId: students[9].id,
      lessonId: 3,
    },
    {
      date: new Date("2025-10-29"),
      present: false,
      studentId: students[10].id,
      lessonId: 3,
    },
    {
      date: new Date("2025-10-29"),
      present: true,
      studentId: students[11].id,
      lessonId: 3,
    },
    {
      date: new Date("2025-10-29"),
      present: true,
      studentId: students[12].id,
      lessonId: 3,
    },

    // Tuesday French lessons
    {
      date: new Date("2025-10-29"),
      present: true,
      studentId: students[18].id,
      lessonId: 8,
    },
    {
      date: new Date("2025-10-29"),
      present: true,
      studentId: students[19].id,
      lessonId: 8,
    },
    {
      date: new Date("2025-10-29"),
      present: true,
      studentId: students[20].id,
      lessonId: 8,
    },

    // Wednesday (Oct 30) attendance for history lessons
    {
      date: new Date("2025-10-30"),
      present: true,
      studentId: students[13].id,
      lessonId: 4,
    },
    {
      date: new Date("2025-10-30"),
      present: true,
      studentId: students[14].id,
      lessonId: 4,
    },
    {
      date: new Date("2025-10-30"),
      present: true,
      studentId: students[15].id,
      lessonId: 4,
    },
    {
      date: new Date("2025-10-30"),
      present: false,
      studentId: students[16].id,
      lessonId: 4,
    },
    {
      date: new Date("2025-10-30"),
      present: true,
      studentId: students[17].id,
      lessonId: 4,
    },

    // Wednesday Music lessons
    {
      date: new Date("2025-10-30"),
      present: true,
      studentId: students[16].id,
      lessonId: 7,
    },
    {
      date: new Date("2025-10-30"),
      present: true,
      studentId: students[17].id,
      lessonId: 7,
    },

    // Thursday (Oct 31) attendance for computer science lessons
    {
      date: new Date("2025-10-31"),
      present: true,
      studentId: students[21].id,
      lessonId: 5,
    },
    {
      date: new Date("2025-10-31"),
      present: true,
      studentId: students[22].id,
      lessonId: 5,
    },
    {
      date: new Date("2025-10-31"),
      present: true,
      studentId: students[23].id,
      lessonId: 5,
    },
    {
      date: new Date("2025-10-31"),
      present: false,
      studentId: students[24].id,
      lessonId: 5,
    },

    // Previous week attendance for tracking
    {
      date: new Date("2025-10-21"),
      present: true,
      studentId: students[0].id,
      lessonId: 1,
    },
    {
      date: new Date("2025-10-21"),
      present: true,
      studentId: students[1].id,
      lessonId: 1,
    },
    {
      date: new Date("2025-10-21"),
      present: false,
      studentId: students[2].id,
      lessonId: 1,
    },
    {
      date: new Date("2025-10-21"),
      present: true,
      studentId: students[3].id,
      lessonId: 1,
    },
    {
      date: new Date("2025-10-21"),
      present: true,
      studentId: students[4].id,
      lessonId: 1,
    },
  ];

  for (const attendance of attendances) {
    await prisma.attendance.create({ data: attendance });
  }

  // EVENT - Updated with upcoming exciting events
  const events = [
    {
      title: "🪔 Diwali Celebration & Cultural Program",
      description:
        "Traditional Diwali celebration with cultural performances, rangoli competition, and sweets distribution. Traditional attire encouraged!",
      startTime: new Date("2025-10-31T10:00:00"),
      endTime: new Date("2025-10-31T14:00:00"),
      classId: null,
    },
    {
      title: "🔬 Annual Science & Innovation Fair",
      description:
        "Student science projects, robotics demonstrations, and STEM workshops. Parents welcome!",
      startTime: new Date("2025-11-08T09:00:00"),
      endTime: new Date("2025-11-08T16:00:00"),
      classId: null,
    },
    {
      title: "👨‍👩‍👧 Parent-Teacher Conference - Grade 1",
      description:
        "Individual meetings to discuss student progress, achievements, and areas for improvement.",
      startTime: new Date("2025-11-12T16:00:00"),
      endTime: new Date("2025-11-12T20:00:00"),
      classId: 1,
    },
    {
      title: "🏃 Inter-School Sports Championship",
      description:
        "Track and field events, cricket, kabaddi, and football competitions. Wear your school colors!",
      startTime: new Date("2025-11-15T08:00:00"),
      endTime: new Date("2025-11-15T17:00:00"),
      classId: null,
    },
    {
      title: "🎭 Annual Day Cultural Program",
      description:
        "Students showcase talents through dance, drama, music performances. Traditional and modern performances. Evening event with refreshments.",
      startTime: new Date("2025-11-20T18:30:00"),
      endTime: new Date("2025-11-20T21:00:00"),
      classId: null,
    },
    {
      title: "🙏 Guru Nanak Jayanti Assembly",
      description:
        "Special assembly to celebrate Guru Nanak Jayanti. Prayer service, kirtan, and community service activities.",
      startTime: new Date("2025-11-22T10:00:00"),
      endTime: new Date("2025-11-22T12:00:00"),
      classId: null,
    },
    {
      title: "📚 Book Fair & Author Meet",
      description:
        "Book fair featuring Indian authors and regional literature. Book signing and reading session in Hindi, Gujarati and English.",
      startTime: new Date("2025-11-25T09:00:00"),
      endTime: new Date("2025-11-25T15:00:00"),
      classId: null,
    },
    {
      title: "� Winter Concert Rehearsal - Grade 5",
      description:
        "Mandatory rehearsal for winter concert participants. Bring your instruments for classical and devotional music practice!",
      startTime: new Date("2025-12-02T15:00:00"),
      endTime: new Date("2025-12-02T17:00:00"),
      classId: 9,
    },
    {
      title: "� Winter Music Concert",
      description:
        "School choir, traditional instruments ensemble, and classical music performance. Celebration of Indian musical heritage!",
      startTime: new Date("2025-12-18T19:00:00"),
      endTime: new Date("2025-12-18T21:00:00"),
      classId: null,
    },
  ];

  for (const event of events) {
    await prisma.event.create({ data: event });
  }

  // ANNOUNCEMENT - Updated with current and relevant announcements
  const announcements = [
    {
      title: "🪔 Diwali Celebration Tomorrow - Dress Code",
      description:
        "Reminder: Diwali celebration tomorrow! Students encouraged to wear traditional Indian attire. Cultural program starts at 10 AM. Don't forget your rangoli materials!",
      date: new Date("2025-10-30"),
      classId: null,
    },
    {
      title: "📝 Mid-Term Progress Reports Available",
      description:
        "Mid-term progress reports are now available in the parent portal. Please review and contact your teacher with any questions. Parent-teacher conferences scheduled for Nov 12.",
      date: new Date("2025-10-28"),
      classId: null,
    },
    {
      title: "🚌 Field Trip Permission Slips Due - Grade 3",
      description:
        "Reminder to Grade 3 parents: Science Museum field trip permission slips and ₹500 fee due by Friday, Nov 1st. Trip scheduled for Nov 8.",
      date: new Date("2025-10-29"),
      classId: 5,
    },
    {
      title: "📚 Library Book Returns - Overdue Notice",
      description:
        "All overdue library books must be returned by Nov 5 to participate in the upcoming Book Fair. Late fees will be waived if returned by this date.",
      date: new Date("2025-10-30"),
      classId: null,
    },
    {
      title: "� Community Service - Food Distribution Drive",
      description:
        "Join us in giving back! Bring non-perishable food items for our community food drive from Nov 4-22. The class with most donations wins a special treat!",
      date: new Date("2025-11-01"),
      classId: null,
    },
    {
      title: "🏏 After-School Sports Program Registration Open",
      description:
        "Winter sports registration now open! Cricket, kabaddi, badminton, and football. Registration closes Nov 8. Forms available in the main office.",
      date: new Date("2025-10-31"),
      classId: null,
    },
    {
      title: "💻 Free Coding Workshop - Grades 4-6",
      description:
        "Join our after-school coding workshop! Learn Python basics every Tuesday & Thursday 3:30-4:30 PM. Limited spots available. Sign up in the computer lab.",
      date: new Date("2025-10-29"),
      classId: 7,
    },
    {
      title: "🎭 Annual Day Auditions This Week",
      description:
        "Annual Day cultural program auditions Nov 1-3 after school in the auditorium. All students welcome! Prepare a 2-minute performance - dance, drama, or music.",
      date: new Date("2025-10-28"),
      classId: null,
    },
    {
      title: "📸 School Picture Retakes - Nov 6",
      description:
        "Picture retakes scheduled for Thursday, Nov 6. If you were absent or want a retake, wear your school uniform! No need to pre-order.",
      date: new Date("2025-10-31"),
      classId: null,
    },
    {
      title: "🚨 Early Dismissal - Professional Development Day",
      description:
        "Reminder: Early dismissal at 1:00 PM on Friday, Nov 8 for teacher professional development. After-school programs and buses will run on early schedule.",
      date: new Date("2025-11-04"),
      classId: null,
    },
  ];

  for (const announcement of announcements) {
    await prisma.announcement.create({ data: announcement });
  }

  // FEE STRUCTURES
  const feeStructures = [
    {
      name: "Tuition Fee",
      description: "Monthly tuition fee for all students",
      amount: 5000.0,
      frequency: FeeFrequency.MONTHLY,
    },
    {
      name: "Grade 1-2 Tuition",
      description: "Special tuition rate for lower grades",
      amount: 4500.0,
      frequency: FeeFrequency.MONTHLY,
      gradeId: 1,
    },
    {
      name: "Grade 1-2 Tuition",
      description: "Special tuition rate for lower grades",
      amount: 4500.0,
      frequency: FeeFrequency.MONTHLY,
      gradeId: 2,
    },
    {
      name: "Library Fee",
      description: "Annual library maintenance and book fee",
      amount: 1500.0,
      frequency: FeeFrequency.ANNUAL,
    },
    {
      name: "Lab Fee",
      description: "Science and computer lab equipment fee",
      amount: 2000.0,
      frequency: FeeFrequency.SEMESTER,
    },
    {
      name: "Sports Fee",
      description: "Sports and physical education equipment fee",
      amount: 1000.0,
      frequency: FeeFrequency.ANNUAL,
    },
    {
      name: "Bus Transportation",
      description: "Monthly bus transportation fee",
      amount: 1200.0,
      frequency: FeeFrequency.MONTHLY,
    },
    {
      name: "Activity Fee",
      description: "Extracurricular activities and events fee",
      amount: 800.0,
      frequency: FeeFrequency.SEMESTER,
    },
    {
      name: "Exam Fee",
      description: "Semester examination and evaluation fee",
      amount: 750.0,
      frequency: FeeFrequency.SEMESTER,
    },
    {
      name: "Uniform Fee",
      description: "School uniform and dress code materials",
      amount: 2000.0,
      frequency: FeeFrequency.ANNUAL,
    },
  ];

  for (const feeStructure of feeStructures) {
    await prisma.feeStructure.create({ data: feeStructure });
  }

  // FEE RECORDS - Sample fee records for students
  const feeRecords = [
    // November tuition fees for Grade 1 students
    {
      studentId: students[0].id,
      feeStructureId: 2,
      amountDue: 4500.0,
      amountPaid: 4500.0,
      status: "PAID" as const,
      dueDate: new Date("2025-11-05"),
    },
    {
      studentId: students[1].id,
      feeStructureId: 2,
      amountDue: 4500.0,
      amountPaid: 0,
      status: "PENDING" as const,
      dueDate: new Date("2025-11-05"),
    },
    {
      studentId: students[2].id,
      feeStructureId: 2,
      amountDue: 4500.0,
      amountPaid: 2250.0,
      status: "PARTIAL" as const,
      dueDate: new Date("2025-11-05"),
    },
    // Transportation fees
    {
      studentId: students[0].id,
      feeStructureId: 7,
      amountDue: 1200.0,
      amountPaid: 1200.0,
      status: "PAID" as const,
      dueDate: new Date("2025-11-05"),
    },
    {
      studentId: students[3].id,
      feeStructureId: 7,
      amountDue: 1200.0,
      amountPaid: 0,
      status: "PENDING" as const,
      dueDate: new Date("2025-11-05"),
    },
    // Lab fees for semester
    {
      studentId: students[8].id,
      feeStructureId: 5,
      amountDue: 2000.0,
      amountPaid: 2000.0,
      status: "PAID" as const,
      dueDate: new Date("2025-11-15"),
    },
    {
      studentId: students[9].id,
      feeStructureId: 5,
      amountDue: 2000.0,
      amountPaid: 1000.0,
      status: "PARTIAL" as const,
      dueDate: new Date("2025-11-15"),
    },
  ];

  for (const feeRecord of feeRecords) {
    await prisma.feeRecord.create({ data: feeRecord });
  }

  console.log("✅ Seeding completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
