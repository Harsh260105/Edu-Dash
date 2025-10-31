# School Management System

A comprehensive full-stack school management dashboard built with Next.js, TypeScript, Prisma, and PostgreSQL.

## Features

### 📚 Core Functionality

- **User Management**: Admin, Teacher, Student, and Parent roles with authentication via Clerk
- **Class & Subject Management**: Create and manage classes, subjects, and lessons
- **Attendance Tracking**: Mark and view student attendance with detailed reports
- **Grade Management**: Bulk grading interface for teachers with authorization controls
- **Schedule Management**: Interactive calendar views for classes and teachers
- **Results & Exams**: Comprehensive exam and assignment result tracking
- **Announcements & Events**: School-wide communication system

### 👥 Role-Based Dashboards

- **Admin**: Full system access with analytics, user management, and finance tracking
- **Teacher**: Schedule view, attendance marking, grade submission, and class management
- **Student**: Personal schedule, attendance history, grades, and assignments
- **Parent**: Children's schedules, grades, and attendance monitoring

### 🎨 UI Features

- Responsive design with Tailwind CSS
- Interactive charts and graphs (Recharts)
- Big calendar integration for schedule visualization
- Real-time data updates
- Modern, clean interface

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Calendar**: React Big Calendar
- **Forms**: React Hook Form + Zod validation
- **Image Handling**: Next Cloudinary

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Clerk account for authentication

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd full-stack-school-main
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory with:

```env
DATABASE_URL="your-postgresql-connection-string"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

4. Set up the database:

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
├── prisma/              # Database schema and migrations
├── public/              # Static assets
├── src/
│   ├── app/            # Next.js app router pages
│   │   ├── (dashboard)/ # Protected dashboard routes
│   │   └── api/        # API routes
│   ├── components/     # React components
│   │   └── forms/      # Form components
│   └── lib/            # Utilities and configurations
│       ├── actions.ts  # Server actions
│       ├── prisma.ts   # Prisma client
│       └── formValidationSchemas.ts
```

## Key Features Implementation

### Bulk Grading

Teachers can grade multiple students at once for exams or assignments with proper authorization checks.

### Attendance System

- Mark attendance for entire classes
- View attendance history
- Generate attendance reports
- Role-based access control

### Schedule Management

- Interactive calendar with weekly/monthly views
- Color-coded lessons by subject
- Hover tooltips with lesson details
- Responsive on all devices

### Authentication & Authorization

- Secure authentication via Clerk
- Role-based access control
- Protected API routes
- User profile management

## Database Models

- Admin, Teacher, Student, Parent
- Class, Grade, Subject, Lesson
- Exam, Assignment, Result
- Attendance, Event, Announcement

## API Routes

- `/api/attendance` - Attendance management
- `/api/results` - Grade results
- `/api/results/bulk` - Bulk grade submission
- `/api/lessons/[id]` - Lesson details
- `/api/lessons/my-lessons` - Teacher's lessons
- `/api/classes/[id]/students` - Class students

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure environment variables
4. Deploy!

## Environment Variables

Make sure to set these in your production environment:

- `DATABASE_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is for educational purposes.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Inspired by modern school management systems
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)
