INSERT INTO "user" (
    email,
	"firstName",
    "lastName",
    "employeeId",
    "roleId",
    "emailVerified",
    "isActive",
    "createdAt"
) VALUES (
    'rahulstart@example.com',
    'Rahul1',
    'Prasad',
    'PMA-0001',
    1,
    FALSE,
    FALSE,
    NOW()
);


--- ADD FEATURE ---
INSERT INTO feature (
    name,
    description,
    slug,
    "profilePicture",
    "internalCompanyId",
    "adminId",
    "activeSprintId"
) VALUES (
    'Booking',
    'Handles hotel room booking process',
    'booking',
    NULL,
    4,
    48,
    NULL
);
