import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

function createSamplePdfBuffer(title: string, subtitle: string): Buffer {
  const content = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
5 0 obj
<< /Length 450 >>
stream
BT
/F1 22 Tf
50 720 Td
(District Computer Centre, Tinsukia) Tj
/F1 15 Tf
0 -40 Td
(${title.replace(/[()]/g, "")}) Tj
/F1 12 Tf
0 -25 Td
(${subtitle.replace(/[()]/g, "")}) Tj
0 -30 Td
(District Computer Centre - Authorized IT Education Centre, Tinsukia, Assam) Tj
0 -20 Td
(Official Study Material for DCA / PGDCSA / DOA & FA Students) Tj
0 -30 Td
(Key Topics:) Tj
0 -20 Td
(- Comprehensive theory and conceptual walkthrough) Tj
0 -18 Td
(- Practical lab demonstrations and keyboard shortcuts) Tj
0 -18 Td
(- Practice questions and examination review) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000239 00000 n 
0000000315 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
820
%%EOF`;

  return Buffer.from(content, "utf-8");
}

async function main() {
  console.log("Seeding DCC Tinsukia database...");

  const storageDir = path.join(process.cwd(), "storage", "notes");
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }

  // 1. Admin User
  const adminPassword = await bcrypt.hash("AdminPassword@123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@dcctinsukia.in" },
    update: {},
    create: {
      name: "DCC Administrator",
      email: "admin@dcctinsukia.in",
      passwordHash: adminPassword,
      role: "ADMIN",
      status: "ACTIVE",
      phone: "+91 9876543210",
      studentId: "ADMIN-01",
    },
  });
  console.log("Admin account:", admin.email);

  // 2. Student User
  const studentPassword = await bcrypt.hash("Student@123", 10);
  const student = await prisma.user.upsert({
    where: { email: "student@dcctinsukia.in" },
    update: {},
    create: {
      name: "Bidyut Sharma",
      email: "student@dcctinsukia.in",
      passwordHash: studentPassword,
      role: "USER",
      status: "ACTIVE",
      phone: "+91 9123456780",
      studentId: "DCC-2026-001",
    },
  });
  console.log("Student account:", student.email);

  // 3. Categories
  const categoriesData = [
    { name: "Computer Fundamentals", description: "Core computing concepts, architecture, and hardware components." },
    { name: "MS Office Suite", description: "Microsoft Word, Excel, PowerPoint, and Access for office productivity." },
    { name: "Internet & Web Technologies", description: "Networking basics, browsers, email, HTML, and web security." },
    { name: "Programming in C & C++", description: "Structured programming, logic building, algorithms, and OOP fundamentals." },
    { name: "Database Management Systems", description: "Relational database concepts, SQL queries, and table operations." },
    { name: "Hardware & Networking", description: "PC assembly, troubleshooting, cabling, and IP addressing." },
    { name: "Assam IT Exam Preparation", description: "Practice MCQs and syllabus notes for state government IT exams." },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { name: cat.name },
      update: { description: cat.description },
      create: { name: cat.name, description: cat.description },
    });
    categoryMap.set(cat.name, created.id);
  }
  console.log("Categories seeded:", categoryMap.size);

  // 4. Sample Notes
  const sampleNotes = [
    {
      title: "Computer Fundamentals - Chapter 1: Introduction to Computing",
      description: "Detailed overview of input/output devices, memory hierarchy, CPU architecture, and generation of computers.",
      categoryName: "Computer Fundamentals",
      course: "DCA (Diploma in Computer Application)",
      topic: "Unit 1: Computer Hardware & Architecture",
      session: "2025-2026",
      fileName: "dcc_comp_fund_ch1.pdf",
    },
    {
      title: "MS Excel Mastery - Formulas, Pivot Tables & Data Analysis",
      description: "Comprehensive guide for spreadsheet formulas (VLOOKUP, XLOOKUP, IF), charting, and data management in Excel.",
      categoryName: "MS Office Suite",
      course: "PGDCSA",
      topic: "Advanced Spreadsheets",
      session: "2025-2026",
      fileName: "dcc_excel_formulas.pdf",
    },
    {
      title: "C Programming Language - Pointers, Structures & Memory Management",
      description: "In-depth notes on pointer arithmetic, dynamic memory allocation (malloc/free), and structure definitions.",
      categoryName: "Programming in C & C++",
      course: "ADCA",
      topic: "Pointers & Dynamic Memory",
      session: "2025-2026",
      fileName: "dcc_c_pointers.pdf",
    },
    {
      title: "Database Management - Relational Algebra & SQL Command Reference",
      description: "DDL, DML, DCL commands, normalization (1NF to 3NF), and subqueries for relational databases.",
      categoryName: "Database Management Systems",
      course: "PGDCSA",
      topic: "SQL Queries and Normalization",
      session: "2025-2026",
      fileName: "dcc_dbms_sql.pdf",
    },
  ];

  for (const note of sampleNotes) {
    const categoryId = categoryMap.get(note.categoryName);
    if (!categoryId) continue;

    const storedFileName = `sample_${Date.now()}_${note.fileName}`;
    const filePath = path.join(storageDir, storedFileName);
    const pdfBuffer = createSamplePdfBuffer(note.title, note.description);
    fs.writeFileSync(filePath, pdfBuffer);

    await prisma.note.upsert({
      where: { storedFileName },
      update: {},
      create: {
        title: note.title,
        description: note.description,
        categoryId: categoryId,
        course: note.course,
        topic: note.topic,
        academicSession: note.session,
        language: "English",
        storedFileName: storedFileName,
        originalFileName: note.fileName,
        fileSize: pdfBuffer.length,
        mimeType: "application/pdf",
        uploadedById: admin.id,
        status: "PUBLISHED",
        downloadCount: Math.floor(Math.random() * 25) + 5,
        viewCount: Math.floor(Math.random() * 50) + 15,
      },
    });
  }

  console.log("Sample notes seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

