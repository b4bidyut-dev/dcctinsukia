import prisma from "../src/lib/prisma";

async function main() {
  const users = await prisma.user.findMany({
    select: {
      name: true,
      email: true,
      phone: true,
      studentId: true,
      role: true,
      status: true,
      createdAt: true,
      lastLoginAt: true,
      _count: {
        select: {
          downloadLogs: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  console.log("\n========================================================");
  console.log("   DCC TINSUKIA - REGISTERED USERS & STUDENT DIRECTORY   ");
  console.log("========================================================\n");

  const formatted = users.map((u, i) => ({
    "#": i + 1,
    Name: u.name,
    Email: u.email,
    Phone: u.phone || "N/A",
    "Student ID": u.studentId || "N/A",
    Role: u.role,
    Status: u.status,
    Downloads: u._count.downloadLogs,
    "Registered On": new Date(u.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    "Last Login": u.lastLoginAt
      ? new Date(u.lastLoginAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "Never",
  }));

  console.table(formatted);

  const studentCount = users.filter((u) => u.role === "USER").length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;

  console.log(`\nSummary: ${users.length} total users (${studentCount} Students, ${adminCount} Administrators)\n`);
}

main()
  .catch((e) => {
    console.error("Error reading users:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
