export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Courses</h1>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">Create Course</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* CourseCard components */}
      </div>
    </div>
  );
}
