import { Day, PrismaClient, UserSex, FeeFrequency } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // ADMIN
  const admins = [
    { id: "admin_2X8Y9Z1A3B4C5D6E7F8G9H0I1J2K3L4", username: "john.doe.admin" },
    {
      id: "admin_3Y9Z0A2B3C4D5E6F7G8H9I0J1K2L3M",
      username: "jane.smith.admin",
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
      id: "user_2X8Y9Z1A3B4C5D6E7F8G9H0I1J2K3L5",
      username: "sarah.johnson",
      name: "Sarah",
      surname: "Johnson",
      email: "sarah.johnson@school.edu",
      phone: "+1-555-0101",
      address: "123 Oak Street, Springfield, IL 62701",
      bloodType: "A+",
      sex: UserSex.FEMALE,
      birthday: new Date("1985-03-15"),
    },
    {
      id: "user_3Y9Z0A2B3C4D5E6F7G8H9I0J1K2L4M",
      username: "michael.davis",
      name: "Michael",
      surname: "Davis",
      email: "michael.davis@school.edu",
      phone: "+1-555-0102",
      address: "456 Pine Avenue, Springfield, IL 62702",
      bloodType: "O-",
      sex: UserSex.MALE,
      birthday: new Date("1982-07-22"),
    },
    {
      id: "user_4Z0A1B2C3D4E5F6G7H8I9J0K1L2M3N",
      username: "emily.chen",
      name: "Emily",
      surname: "Chen",
      email: "emily.chen@school.edu",
      phone: "+1-555-0103",
      address: "789 Elm Drive, Springfield, IL 62703",
      bloodType: "B+",
      sex: UserSex.FEMALE,
      birthday: new Date("1988-11-08"),
    },
    {
      id: "user_5A1B2C3D4E5F6G7H8I9J0K1L2M3N4O",
      username: "david.wilson",
      name: "David",
      surname: "Wilson",
      email: "david.wilson@school.edu",
      phone: "+1-555-0104",
      address: "321 Maple Lane, Springfield, IL 62704",
      bloodType: "AB+",
      sex: UserSex.MALE,
      birthday: new Date("1979-05-30"),
    },
    {
      id: "user_6B2C3D4E5F6G7H8I9J0K1L2M3N4O5P",
      username: "lisa.brown",
      name: "Lisa",
      surname: "Brown",
      email: "lisa.brown@school.edu",
      phone: "+1-555-0105",
      address: "654 Cedar Street, Springfield, IL 62705",
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
    { name: "French" },
    { name: "History" },
  ];

  for (const subject of subjects) {
    await prisma.subject.create({ data: subject });
  }

  // Connect teachers to subjects and classes
  const teacherSubjects = [
    { teacherId: teachers[0].id, subjectIds: [1, 2] }, // Sarah: Math, English
    { teacherId: teachers[1].id, subjectIds: [3, 6] }, // Michael: Science, Art
    { teacherId: teachers[2].id, subjectIds: [8, 9] }, // Emily: Computer Science, French
    { teacherId: teachers[3].id, subjectIds: [4, 10] }, // David: Social Studies, History
    { teacherId: teachers[4].id, subjectIds: [5, 7] }, // Lisa: PE, Music
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

  // LESSON - Updated for current semester
  const lessons = [
    {
      name: "Algebra Fundamentals",
      day: Day.MONDAY,
      startTime: new Date("2025-10-28T08:00:00"),
      endTime: new Date("2025-10-28T09:00:00"),
      subjectId: 1,
      classId: 1,
      teacherId: teachers[0].id,
    },
    {
      name: "Creative Writing Workshop",
      day: Day.MONDAY,
      startTime: new Date("2025-10-28T09:15:00"),
      endTime: new Date("2025-10-28T10:15:00"),
      subjectId: 2,
      classId: 1,
      teacherId: teachers[0].id,
    },
    {
      name: "Biology Lab - Cell Structure",
      day: Day.TUESDAY,
      startTime: new Date("2025-10-29T08:00:00"),
      endTime: new Date("2025-10-29T09:30:00"),
      subjectId: 3,
      classId: 2,
      teacherId: teachers[1].id,
    },
    {
      name: "World History - Ancient Civilizations",
      day: Day.WEDNESDAY,
      startTime: new Date("2025-10-30T10:00:00"),
      endTime: new Date("2025-10-30T11:00:00"),
      subjectId: 10,
      classId: 3,
      teacherId: teachers[3].id,
    },
    {
      name: "Python Programming Basics",
      day: Day.THURSDAY,
      startTime: new Date("2025-10-31T13:00:00"),
      endTime: new Date("2025-10-31T14:30:00"),
      subjectId: 8,
      classId: 4,
      teacherId: teachers[2].id,
    },
    {
      name: "Physical Education - Basketball",
      day: Day.FRIDAY,
      startTime: new Date("2025-11-01T11:00:00"),
      endTime: new Date("2025-11-01T12:00:00"),
      subjectId: 5,
      classId: 5,
      teacherId: teachers[4].id,
    },
    {
      name: "Music Theory & Practice",
      day: Day.WEDNESDAY,
      startTime: new Date("2025-10-30T14:00:00"),
      endTime: new Date("2025-10-30T15:00:00"),
      subjectId: 7,
      classId: 6,
      teacherId: teachers[4].id,
    },
    {
      name: "French Conversation",
      day: Day.TUESDAY,
      startTime: new Date("2025-10-29T10:00:00"),
      endTime: new Date("2025-10-29T11:00:00"),
      subjectId: 9,
      classId: 7,
      teacherId: teachers[2].id,
    },
  ];

  for (const lesson of lessons) {
    await prisma.lesson.create({ data: lesson });
  }

  // PARENT
  const parents = [
    {
      id: "user_7C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q",
      username: "robert.miller",
      name: "Robert",
      surname: "Miller",
      email: "robert.miller@email.com",
      phone: "+1-555-0201",
      address: "111 Birch Street, Springfield, IL 62711",
    },
    {
      id: "user_8D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R",
      username: "maria.garcia",
      name: "Maria",
      surname: "Garcia",
      email: "maria.garcia@email.com",
      phone: "+1-555-0202",
      address: "222 Willow Avenue, Springfield, IL 62712",
    },
    {
      id: "user_9E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S",
      username: "james.anderson",
      name: "James",
      surname: "Anderson",
      email: "james.anderson@email.com",
      phone: "+1-555-0203",
      address: "333 Spruce Lane, Springfield, IL 62713",
    },
    {
      id: "user_A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P",
      username: "linda.thomas",
      name: "Linda",
      surname: "Thomas",
      email: "linda.thomas@email.com",
      phone: "+1-555-0204",
      address: "444 Elm Street, Springfield, IL 62714",
    },
    {
      id: "user_B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q",
      username: "michael.jones",
      name: "Michael",
      surname: "Jones",
      email: "michael.jones@email.com",
      phone: "+1-555-0205",
      address: "555 Oak Avenue, Springfield, IL 62715",
    },
    {
      id: "user_C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R",
      username: "patricia.williams",
      name: "Patricia",
      surname: "Williams",
      email: "patricia.williams@email.com",
      phone: "+1-555-0206",
      address: "666 Pine Lane, Springfield, IL 62716",
    },
    {
      id: "user_D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S",
      username: "richard.brown",
      name: "Richard",
      surname: "Brown",
      email: "richard.brown@email.com",
      phone: "+1-555-0207",
      address: "777 Cedar Drive, Springfield, IL 62717",
    },
    {
      id: "user_E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T",
      username: "jennifer.davis",
      name: "Jennifer",
      surname: "Davis",
      email: "jennifer.davis@email.com",
      phone: "+1-555-0208",
      address: "888 Maple Street, Springfield, IL 62718",
    },
    {
      id: "user_F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U",
      username: "charles.martinez",
      name: "Charles",
      surname: "Martinez",
      email: "charles.martinez@email.com",
      phone: "+1-555-0209",
      address: "999 Birch Avenue, Springfield, IL 62719",
    },
    {
      id: "user_G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V",
      username: "barbara.hernandez",
      name: "Barbara",
      surname: "Hernandez",
      email: "barbara.hernandez@email.com",
      phone: "+1-555-0210",
      address: "1010 Willow Lane, Springfield, IL 62720",
    },
    {
      id: "user_H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W",
      username: "joseph.lopez",
      name: "Joseph",
      surname: "Lopez",
      email: "joseph.lopez@email.com",
      phone: "+1-555-0211",
      address: "1111 Spruce Drive, Springfield, IL 62721",
    },
    {
      id: "user_I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X",
      username: "mary.gonzalez",
      name: "Mary",
      surname: "Gonzalez",
      email: "mary.gonzalez@email.com",
      phone: "+1-555-0212",
      address: "1212 Ash Street, Springfield, IL 62722",
    },
    {
      id: "user_J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y",
      username: "thomas.wilson",
      name: "Thomas",
      surname: "Wilson",
      email: "thomas.wilson@email.com",
      phone: "+1-555-0213",
      address: "1313 Hickory Avenue, Springfield, IL 62723",
    },
    {
      id: "user_K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z",
      username: "susan.moore",
      name: "Susan",
      surname: "Moore",
      email: "susan.moore@email.com",
      phone: "+1-555-0214",
      address: "1414 Chestnut Lane, Springfield, IL 62724",
    },
    {
      id: "user_L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A",
      username: "daniel.taylor",
      name: "Daniel",
      surname: "Taylor",
      email: "daniel.taylor@email.com",
      phone: "+1-555-0215",
      address: "1515 Sycamore Drive, Springfield, IL 62725",
    },
  ];

  for (const parent of parents) {
    await prisma.parent.create({ data: parent });
  }

  // STUDENT
  const students = [
    // Grade 1 - Class 1A (capacity: 25)
    {
      id: "user_A0B1C2D3E4F5G6H7I8J9K0L1M2N3O4P",
      username: "alex.miller",
      name: "Alex",
      surname: "Miller",
      email: "alex.miller@student.edu",
      phone: "+1-555-0301",
      address: "111 Birch Street, Springfield, IL 62711",
      bloodType: "A+",
      sex: UserSex.MALE,
      parentId: parents[0].id,
      gradeId: 1,
      classId: 1,
      birthday: new Date("2018-06-15"),
    },
    {
      id: "user_B1C2D3E4F5G6H7I8J9K0L1M2N3O4P5Q",
      username: "emma.garcia",
      name: "Emma",
      surname: "Garcia",
      email: "emma.garcia@student.edu",
      phone: "+1-555-0302",
      address: "222 Willow Avenue, Springfield, IL 62712",
      bloodType: "O-",
      sex: UserSex.FEMALE,
      parentId: parents[1].id,
      gradeId: 1,
      classId: 1,
      birthday: new Date("2018-09-22"),
    },
    {
      id: "user_C2D3E4F5G6H7I8J9K0L1M2N3O4P5Q6R",
      username: "liam.anderson",
      name: "Liam",
      surname: "Anderson",
      email: "liam.anderson@student.edu",
      phone: "+1-555-0303",
      address: "333 Spruce Lane, Springfield, IL 62713",
      bloodType: "B+",
      sex: UserSex.MALE,
      parentId: parents[2].id,
      gradeId: 1,
      classId: 1,
      birthday: new Date("2018-03-08"),
    },
    {
      id: "user_D3E4F5G6H7I8J9K0L1M2N3O4P5Q6R7S",
      username: "olivia.thomas",
      name: "Olivia",
      surname: "Thomas",
      email: "olivia.thomas@student.edu",
      phone: "+1-555-0304",
      address: "444 Elm Street, Springfield, IL 62714",
      bloodType: "AB+",
      sex: UserSex.FEMALE,
      parentId: parents[3].id,
      gradeId: 1,
      classId: 1,
      birthday: new Date("2018-12-01"),
    },
    {
      id: "user_E4F5G6H7I8J9K0L1M2N3O4P5Q6R7S8T",
      username: "noah.jones",
      name: "Noah",
      surname: "Jones",
      email: "noah.jones@student.edu",
      phone: "+1-555-0305",
      address: "555 Oak Avenue, Springfield, IL 62715",
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
      username: "ava.williams",
      name: "Ava",
      surname: "Williams",
      email: "ava.williams@student.edu",
      phone: "+1-555-0306",
      address: "666 Pine Lane, Springfield, IL 62716",
      bloodType: "B-",
      sex: UserSex.FEMALE,
      parentId: parents[5].id,
      gradeId: 1,
      classId: 2,
      birthday: new Date("2018-11-30"),
    },
    {
      id: "user_G6H7I8J9K0L1M2N3O4P5Q6R7S8T9U0V",
      username: "mason.brown",
      name: "Mason",
      surname: "Brown",
      email: "mason.brown@student.edu",
      phone: "+1-555-0307",
      address: "777 Cedar Drive, Springfield, IL 62717",
      bloodType: "O+",
      sex: UserSex.MALE,
      parentId: parents[6].id,
      gradeId: 1,
      classId: 2,
      birthday: new Date("2018-05-25"),
    },
    {
      id: "user_H7I8J9K0L1M2N3O4P5Q6R7S8T9U0V1W",
      username: "sophia.davis",
      name: "Sophia",
      surname: "Davis",
      email: "sophia.davis@student.edu",
      phone: "+1-555-0308",
      address: "888 Maple Street, Springfield, IL 62718",
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
      username: "jacob.martinez",
      name: "Jacob",
      surname: "Martinez",
      email: "jacob.martinez@student.edu",
      phone: "+1-555-0309",
      address: "999 Birch Avenue, Springfield, IL 62719",
      bloodType: "AB-",
      sex: UserSex.MALE,
      parentId: parents[8].id,
      gradeId: 2,
      classId: 3,
      birthday: new Date("2017-04-12"),
    },
    {
      id: "user_J9K0L1M2N3O4P5Q6R7S8T9U0V1W2X3Y",
      username: "isabella.hernandez",
      name: "Isabella",
      surname: "Hernandez",
      email: "isabella.hernandez@student.edu",
      phone: "+1-555-0310",
      address: "1010 Willow Lane, Springfield, IL 62720",
      bloodType: "B+",
      sex: UserSex.FEMALE,
      parentId: parents[9].id,
      gradeId: 2,
      classId: 3,
      birthday: new Date("2017-10-05"),
    },
    {
      id: "user_K0L1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z",
      username: "william.lopez",
      name: "William",
      surname: "Lopez",
      email: "william.lopez@student.edu",
      phone: "+1-555-0311",
      address: "1111 Spruce Drive, Springfield, IL 62721",
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
      username: "mia.gonzalez",
      name: "Mia",
      surname: "Gonzalez",
      email: "mia.gonzalez@student.edu",
      phone: "+1-555-0312",
      address: "1212 Ash Street, Springfield, IL 62722",
      bloodType: "A+",
      sex: UserSex.FEMALE,
      parentId: parents[11].id,
      gradeId: 2,
      classId: 4,
      birthday: new Date("2017-06-17"),
    },
    {
      id: "user_M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z5A6B",
      username: "james.wilson",
      name: "James",
      surname: "Wilson",
      email: "james.wilson@student.edu",
      phone: "+1-555-0313",
      address: "1313 Hickory Avenue, Springfield, IL 62723",
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
      username: "charlotte.moore",
      name: "Charlotte",
      surname: "Moore",
      email: "charlotte.moore@student.edu",
      phone: "+1-555-0314",
      address: "1414 Chestnut Lane, Springfield, IL 62724",
      bloodType: "AB+",
      sex: UserSex.FEMALE,
      parentId: parents[13].id,
      gradeId: 3,
      classId: 5,
      birthday: new Date("2016-02-14"),
    },
    {
      id: "user_O4P5Q6R7S8T9U0V1W2X3Y4Z5A6B7C8D",
      username: "benjamin.taylor",
      name: "Benjamin",
      surname: "Taylor",
      email: "benjamin.taylor@student.edu",
      phone: "+1-555-0315",
      address: "1515 Sycamore Drive, Springfield, IL 62725",
      bloodType: "O+",
      sex: UserSex.MALE,
      parentId: parents[14].id,
      gradeId: 3,
      classId: 5,
      birthday: new Date("2016-07-09"),
    },
    {
      id: "user_P5Q6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E",
      username: "amelia.white",
      name: "Amelia",
      surname: "White",
      email: "amelia.white@student.edu",
      phone: "+1-555-0316",
      address: "1616 Poplar Street, Springfield, IL 62726",
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
      username: "harry.harris",
      name: "Harry",
      surname: "Harris",
      email: "harry.harris@student.edu",
      phone: "+1-555-0317",
      address: "1717 Magnolia Avenue, Springfield, IL 62727",
      bloodType: "B+",
      sex: UserSex.MALE,
      parentId: parents[1].id,
      gradeId: 3,
      classId: 6,
      birthday: new Date("2016-04-06"),
    },
    {
      id: "user_R7S8T9U0V1W2X3Y4Z5A6B7C8D9E0F1G",
      username: "harper.clark",
      name: "Harper",
      surname: "Clark",
      email: "harper.clark@student.edu",
      phone: "+1-555-0318",
      address: "1818 Juniper Lane, Springfield, IL 62728",
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
      username: "ethan.lewis",
      name: "Ethan",
      surname: "Lewis",
      email: "ethan.lewis@student.edu",
      phone: "+1-555-0319",
      address: "1919 Redwood Drive, Springfield, IL 62729",
      bloodType: "AB-",
      sex: UserSex.MALE,
      parentId: parents[3].id,
      gradeId: 4,
      classId: 7,
      birthday: new Date("2015-01-11"),
    },
    {
      id: "user_T9U0V1W2X3Y4Z5A6B7C8D9E0F1G2H3I",
      username: "evelyn.walker",
      name: "Evelyn",
      surname: "Walker",
      email: "evelyn.walker@student.edu",
      phone: "+1-555-0320",
      address: "2020 Cypress Street, Springfield, IL 62730",
      bloodType: "A+",
      sex: UserSex.FEMALE,
      parentId: parents[4].id,
      gradeId: 4,
      classId: 7,
      birthday: new Date("2015-05-27"),
    },
    {
      id: "user_U0V1W2X3Y4Z5A6B7C8D9E0F1G2H3I4J",
      username: "logan.hall",
      name: "Logan",
      surname: "Hall",
      email: "logan.hall@student.edu",
      phone: "+1-555-0321",
      address: "2121 Dogwood Avenue, Springfield, IL 62731",
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
      username: "abigail.young",
      name: "Abigail",
      surname: "Young",
      email: "abigail.young@student.edu",
      phone: "+1-555-0322",
      address: "2222 Fir Lane, Springfield, IL 62732",
      bloodType: "O+",
      sex: UserSex.FEMALE,
      parentId: parents[6].id,
      gradeId: 4,
      classId: 8,
      birthday: new Date("2015-03-19"),
    },
    {
      id: "user_W2X3Y4Z5A6B7C8D9E0F1G2H3I4J5K6L",
      username: "lucas.king",
      name: "Lucas",
      surname: "King",
      email: "lucas.king@student.edu",
      phone: "+1-555-0323",
      address: "2323 Palm Drive, Springfield, IL 62733",
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
      username: "elizabeth.wright",
      name: "Elizabeth",
      surname: "Wright",
      email: "elizabeth.wright@student.edu",
      phone: "+1-555-0324",
      address: "2424 Beech Street, Springfield, IL 62734",
      bloodType: "A-",
      sex: UserSex.FEMALE,
      parentId: parents[8].id,
      gradeId: 5,
      classId: 9,
      birthday: new Date("2014-12-08"),
    },
    {
      id: "user_Y4Z5A6B7C8D9E0F1G2H3I4J5K6L7M8N",
      username: "jack.scott",
      name: "Jack",
      surname: "Scott",
      email: "jack.scott@student.edu",
      phone: "+1-555-0325",
      address: "2525 Alder Avenue, Springfield, IL 62735",
      bloodType: "B+",
      sex: UserSex.MALE,
      parentId: parents[9].id,
      gradeId: 5,
      classId: 9,
      birthday: new Date("2014-06-23"),
    },
    {
      id: "user_Z5A6B7C8D9E0F1G2H3I4J5K6L7M8N9O",
      username: "grace.green",
      name: "Grace",
      surname: "Green",
      email: "grace.green@student.edu",
      phone: "+1-555-0326",
      address: "2626 Larch Lane, Springfield, IL 62736",
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
      username: "henry.adams",
      name: "Henry",
      surname: "Adams",
      email: "henry.adams@student.edu",
      phone: "+1-555-0327",
      address: "2727 Hawthorn Drive, Springfield, IL 62737",
      bloodType: "AB-",
      sex: UserSex.MALE,
      parentId: parents[11].id,
      gradeId: 5,
      classId: 10,
      birthday: new Date("2014-02-28"),
    },
    {
      id: "user_1B7C8D9E0F1G2H3I4J5K6L7M8N9O0P1Q",
      username: "zoey.baker",
      name: "Zoey",
      surname: "Baker",
      email: "zoey.baker@student.edu",
      phone: "+1-555-0328",
      address: "2828 Laurel Street, Springfield, IL 62738",
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
      username: "leo.nelson",
      name: "Leo",
      surname: "Nelson",
      email: "leo.nelson@student.edu",
      phone: "+1-555-0329",
      address: "2929 Acacia Avenue, Springfield, IL 62739",
      bloodType: "B-",
      sex: UserSex.MALE,
      parentId: parents[13].id,
      gradeId: 6,
      classId: 11,
      birthday: new Date("2013-01-05"),
    },
    {
      id: "user_3D9E0F1G2H3I4J5K6L7M8N9O0P1Q2R3S",
      username: "nora.carter",
      name: "Nora",
      surname: "Carter",
      email: "nora.carter@student.edu",
      phone: "+1-555-0330",
      address: "3030 Sequoia Lane, Springfield, IL 62740",
      bloodType: "O+",
      sex: UserSex.FEMALE,
      parentId: parents[14].id,
      gradeId: 6,
      classId: 11,
      birthday: new Date("2013-05-20"),
    },
    {
      id: "user_4E0F1G2H3I4J5K6L7M8N9O0P1Q2R3S4T",
      username: "owen.mitchell",
      name: "Owen",
      surname: "Mitchell",
      email: "owen.mitchell@student.edu",
      phone: "+1-555-0331",
      address: "3131 Redwood Drive, Springfield, IL 62741",
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
      username: "stella.perez",
      name: "Stella",
      surname: "Perez",
      email: "stella.perez@student.edu",
      phone: "+1-555-0332",
      address: "3232 Eucalyptus Street, Springfield, IL 62742",
      bloodType: "A-",
      sex: UserSex.FEMALE,
      parentId: parents[1].id,
      gradeId: 6,
      classId: 12,
      birthday: new Date("2013-03-14"),
    },
    {
      id: "user_6G2H3I4J5K6L7M8N9O0P1Q2R3S4T5U6V",
      username: "ryan.roberts",
      name: "Ryan",
      surname: "Roberts",
      email: "ryan.roberts@student.edu",
      phone: "+1-555-0333",
      address: "3333 Ironwood Avenue, Springfield, IL 62743",
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
      title: "French Vocabulary & Dialogue Practice",
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
      title: "🎃 Halloween Costume Parade & Contest",
      description:
        "Dress up in your best costume! Prizes for most creative, scariest, and funniest costumes. Parade starts at noon.",
      startTime: new Date("2025-10-31T12:00:00"),
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
        "Track and field events, basketball, and soccer competitions. Wear your school colors!",
      startTime: new Date("2025-11-15T08:00:00"),
      endTime: new Date("2025-11-15T17:00:00"),
      classId: null,
    },
    {
      title: "🎭 Fall Theatre Production - Peter Pan",
      description:
        "Drama club presents Peter Pan. Evening performance with refreshments available.",
      startTime: new Date("2025-11-20T18:30:00"),
      endTime: new Date("2025-11-20T21:00:00"),
      classId: null,
    },
    {
      title: "🦃 Thanksgiving Assembly & Food Drive",
      description:
        "Community gratitude celebration. Bring non-perishable food items for local shelter.",
      startTime: new Date("2025-11-22T10:00:00"),
      endTime: new Date("2025-11-22T12:00:00"),
      classId: null,
    },
    {
      title: "📚 Book Fair & Author Meet",
      description:
        "Scholastic book fair with special guest author. Book signing and reading session.",
      startTime: new Date("2025-11-25T09:00:00"),
      endTime: new Date("2025-11-25T15:00:00"),
      classId: null,
    },
    {
      title: "🎄 Winter Concert Rehearsal - Grade 5",
      description:
        "Mandatory rehearsal for winter concert participants. Bring your instruments!",
      startTime: new Date("2025-12-02T15:00:00"),
      endTime: new Date("2025-12-02T17:00:00"),
      classId: 9,
    },
    {
      title: "🎅 Holiday Winter Concert",
      description:
        "School choir, band, and orchestra winter performance. Festive celebration for all!",
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
      title: "🎃 Halloween Tomorrow - Costume Guidelines",
      description:
        "Reminder: Halloween celebration tomorrow! Costumes must be school-appropriate (no weapons, scary masks, or gore). Parade starts at noon. Don't forget your candy bag!",
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
        "Reminder to Grade 3 parents: Science Museum field trip permission slips and $15 fee due by Friday, Nov 1st. Trip scheduled for Nov 8.",
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
      title: "🍂 Thanksgiving Food Drive Starts Monday",
      description:
        "Join us in giving back! Bring non-perishable food items for our community food drive from Nov 4-22. The class with most donations wins a pizza party!",
      date: new Date("2025-11-01"),
      classId: null,
    },
    {
      title: "⚽ After-School Sports Program Registration Open",
      description:
        "Winter sports registration now open! Basketball, indoor soccer, and volleyball. Registration closes Nov 8. Forms available in the main office.",
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
      title: "🎭 Theatre Auditions This Week",
      description:
        "Peter Pan auditions Nov 1-3 after school in the auditorium. All students welcome! No experience necessary. Scripts available in the drama room.",
      date: new Date("2025-10-28"),
      classId: null,
    },
    {
      title: "📸 School Picture Retakes - Nov 6",
      description:
        "Picture retakes scheduled for Thursday, Nov 6. If you were absent or want a retake, wear your best smile! No need to pre-order.",
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
      amount: 500.0,
      frequency: FeeFrequency.MONTHLY,
    },
    {
      name: "Grade 1-2 Tuition",
      description: "Special tuition rate for lower grades",
      amount: 450.0,
      frequency: FeeFrequency.MONTHLY,
      gradeId: 1,
    },
    {
      name: "Grade 1-2 Tuition",
      description: "Special tuition rate for lower grades",
      amount: 450.0,
      frequency: FeeFrequency.MONTHLY,
      gradeId: 2,
    },
    {
      name: "Library Fee",
      description: "Annual library maintenance and book fee",
      amount: 150.0,
      frequency: FeeFrequency.ANNUAL,
    },
    {
      name: "Lab Fee",
      description: "Science and computer lab equipment fee",
      amount: 200.0,
      frequency: FeeFrequency.SEMESTER,
    },
    {
      name: "Sports Fee",
      description: "Sports and physical education equipment fee",
      amount: 100.0,
      frequency: FeeFrequency.ANNUAL,
    },
    {
      name: "Bus Transportation",
      description: "Monthly bus transportation fee",
      amount: 120.0,
      frequency: FeeFrequency.MONTHLY,
    },
    {
      name: "Activity Fee",
      description: "Extracurricular activities and events fee",
      amount: 80.0,
      frequency: FeeFrequency.SEMESTER,
    },
    {
      name: "Exam Fee",
      description: "Semester examination and evaluation fee",
      amount: 75.0,
      frequency: FeeFrequency.SEMESTER,
    },
    {
      name: "Uniform Fee",
      description: "School uniform and dress code materials",
      amount: 200.0,
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
      amountDue: 450.0,
      amountPaid: 450.0,
      status: "PAID" as const,
      dueDate: new Date("2025-11-05"),
    },
    {
      studentId: students[1].id,
      feeStructureId: 2,
      amountDue: 450.0,
      amountPaid: 0,
      status: "PENDING" as const,
      dueDate: new Date("2025-11-05"),
    },
    {
      studentId: students[2].id,
      feeStructureId: 2,
      amountDue: 450.0,
      amountPaid: 225.0,
      status: "PARTIAL" as const,
      dueDate: new Date("2025-11-05"),
    },
    // Transportation fees
    {
      studentId: students[0].id,
      feeStructureId: 7,
      amountDue: 120.0,
      amountPaid: 120.0,
      status: "PAID" as const,
      dueDate: new Date("2025-11-05"),
    },
    {
      studentId: students[3].id,
      feeStructureId: 7,
      amountDue: 120.0,
      amountPaid: 0,
      status: "PENDING" as const,
      dueDate: new Date("2025-11-05"),
    },
    // Lab fees for semester
    {
      studentId: students[8].id,
      feeStructureId: 5,
      amountDue: 200.0,
      amountPaid: 200.0,
      status: "PAID" as const,
      dueDate: new Date("2025-11-15"),
    },
    {
      studentId: students[9].id,
      feeStructureId: 5,
      amountDue: 200.0,
      amountPaid: 100.0,
      status: "PARTIAL" as const,
      dueDate: new Date("2025-11-15"),
    },
  ];

  for (const feeRecord of feeRecords) {
    await prisma.feeRecord.create({ data: feeRecord });
  }

  console.log("Seeding completed successfully with realistic data.");
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
