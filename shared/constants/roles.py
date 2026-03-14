"""User role constants used across all services."""


class Roles:
    ADMIN = "admin"
    INSTRUCTOR = "instructor"
    STUDENT = "student"
    GUEST = "guest"

    CHOICES = [
        (ADMIN, "Admin"),
        (INSTRUCTOR, "Instructor"),
        (STUDENT, "Student"),
        (GUEST, "Guest"),
    ]

    ALL = [ADMIN, INSTRUCTOR, STUDENT, GUEST]
    STAFF = [ADMIN, INSTRUCTOR]
