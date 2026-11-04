# Product Requirements Document: District Computer Centre Tinsukia Notes Portal

## 1. Product Overview

The District Computer Centre Tinsukia Notes Portal will be a web-based platform for publishing and distributing computer-related study notes in PDF format.

The system will support two primary user roles:

- **Administrator:** Can upload, manage, update, publish, and delete PDF notes.
- **Registered User:** Can register, log in, browse, view, and download published PDF notes.

Only authenticated administrators will have permission to upload documents. Registered users will have read-only access to published notes.

## 2. Objectives

The portal should:

- Provide a centralized repository for computer notes.
- Allow administrators to upload notes in PDF format.
- Ensure that only administrators can upload, edit, or delete notes.
- Allow registered users to view PDF notes online.
- Allow registered users to download PDF notes.
- Provide secure user registration and login.
- Make notes easy to search and organize.
- Reduce dependency on printed study material.

## 3. Scope

### 3.1 In Scope

- User registration.
- User login and logout.
- Administrator login.
- Role-based access control.
- Administrator dashboard.
- PDF note upload.
- PDF file validation.
- Notes categorization.
- Notes listing.
- Notes search and filtering.
- Online PDF viewing.
- PDF downloading for registered users.
- Note editing and deletion by administrators.
- User account management.
- Basic upload and download activity records.

### 3.2 Out of Scope for Initial Release

- Uploading Word, PowerPoint, image, or video files.
- Online editing of PDF documents.
- User comments and ratings.
- Online examinations.
- Assignment submission.
- Payment functionality.
- Mobile application.
- Automated note generation.
- Public access to notes without registration.

## 4. User Roles and Permissions

| Feature | Administrator | Registered User | Unregistered Visitor |
|---|---:|---:|---:|
| Register an account | No | Yes | Yes |
| Log in | Yes | Yes | No |
| View notes list | Yes | Yes | Optional |
| View PDF notes | Yes | Yes | No |
| Download notes | Yes | Yes | No |
| Upload notes | Yes | No | No |
| Edit note details | Yes | No | No |
| Delete notes | Yes | No | No |
| Manage users | Yes | No | No |
| View dashboard | Yes | Yes | No |

The system must enforce permissions on the server side. Hiding the upload option from users is not sufficient; unauthorized upload requests must also be rejected by the backend.

## 5. Functional Requirements

### 5.1 User Registration

Users should be able to create an account using:

- Full name.
- Email address.
- Mobile number, if required.
- Password.
- Password confirmation.
- Optional student or employee identification.

The system should:

- Validate all required fields.
- Prevent duplicate email addresses.
- Enforce a minimum password policy.
- Store passwords securely using hashing.
- Display a confirmation message after successful registration.
- Optionally require email verification or administrator approval.

### 5.2 User Login

Registered users should be able to log in using their email address and password.

The login system should:

- Validate credentials.
- Create a secure session.
- Redirect users to their dashboard or notes library.
- Display an appropriate message for invalid credentials.
- Provide a logout option.
- Support password reset.

Administrators should use a secure administrator login process.

### 5.3 Administrator Dashboard

The administrator dashboard should display:

- Total number of uploaded notes.
- Total number of registered users.
- Recently uploaded notes.
- Recently downloaded notes, if tracking is enabled.
- Storage usage.
- Quick actions for uploading and managing notes.

The dashboard should provide access to:

- Upload note.
- View all notes.
- Edit notes.
- Delete notes.
- Manage users.
- Review failed uploads.
- View basic activity logs.

### 5.4 PDF Note Upload

Only administrators can upload notes.

The upload form should contain:

- PDF file selector.
- Note title.
- Short description.
- Subject or category.
- Course, class, or level.
- Topic or chapter.
- Author or source name.
- Publication date.
- Optional tags.

The system should:

- Accept only valid PDF files.
- Reject unsupported file types.
- Validate the actual file type, not only the filename extension.
- Set a configurable maximum file size.
- Reject empty or corrupted files.
- Generate a unique stored filename.
- Store the original display title separately.
- Scan uploaded files for malware where supported.
- Display upload progress for large files.
- Show upload success or failure messages.
- Make notes available to users only after successful publication.

Suggested initial file limit: **25 MB per PDF**, configurable by the administrator.

### 5.5 Notes Management

Administrators should be able to:

- View all uploaded notes.
- Search notes by title, category, or uploader.
- Edit note metadata.
- Replace an existing PDF.
- Publish or unpublish a note.
- Archive a note.
- Delete a note.
- Restore recently deleted notes, if a recycle-bin feature is implemented.

Deleting a note should require confirmation.

### 5.6 Notes Library

Registered users should see a notes library containing:

- Note title.
- Subject.
- Category.
- Topic.
- Short description.
- Publication date.
- File size.
- View button.
- Download button.

The notes library should support:

- Keyword search.
- Filtering by subject.
- Filtering by course or class.
- Filtering by topic.
- Sorting by newest, oldest, title, or most downloaded.
- Pagination or lazy loading.
- Empty-state messaging when no notes are available.

Only published notes should appear in the user-facing notes library.

### 5.7 Online PDF Viewing

Registered users should be able to open a PDF in an online viewer.

The viewer should provide:

- Page navigation.
- Zoom controls.
- Full-screen mode.
- Search within the document, where supported.
- Download option.
- Mobile-friendly rendering.

Access to the PDF should be checked before the file is streamed to the user. Stored files should not be exposed through unrestricted public URLs.

### 5.8 PDF Download

A registered and authenticated user should be able to download published PDF notes.

The system should:

- Verify that the user is logged in.
- Verify that the requested note exists and is published.
- Record the download event, if analytics are enabled.
- Provide the PDF using a secure download response.
- Prevent unauthorized direct access to stored files.

### 5.9 User Dashboard

A registered user dashboard may include:

- Recently viewed notes.
- Recently downloaded notes.
- Saved or bookmarked notes.
- Profile information.
- Password change option.
- Logout option.

Bookmarks are optional for the first release.

### 5.10 User Management

Administrators should be able to:

- View registered users.
- Search users by name or email.
- Activate or deactivate accounts.
- Initiate password resets.
- Delete user accounts, subject to applicable requirements.
- Assign or revoke administrator access.

Administrator access must not be granted through public registration. It must be assigned by an existing authorized administrator or through a controlled deployment process.

## 6. Note Organization

The system should support the following note attributes:

- **Subject:** For example, Computer Fundamentals, MS Office, Internet, Programming, Database, or Hardware.
- **Course or Class:** Applicable course, batch, or learner level.
- **Topic:** Specific chapter or subject area.
- **Academic Session:** Optional.
- **Language:** Optional.
- **Status:** Draft, published, unpublished, or archived.

Example note title:

```text
Computer Fundamentals - Chapter 1: Introduction to Computers
```

## 7. Security Requirements

The system should include:

- Role-based access control.
- Server-side authorization checks.
- Secure password hashing.
- HTTPS for all pages.
- CSRF protection for forms.
- Input validation and sanitization.
- Secure session management.
- Login rate limiting.
- Brute-force protection.
- File-type validation.
- File-size validation.
- Malware scanning where available.
- Protection against path traversal.
- Protection against unauthorized direct file access.
- Secure administrator routes.
- Automatic session expiration after prolonged inactivity.
- Audit logging for administrator actions.
- Regular backups.
- Error messages that do not expose sensitive system details.

The backend must inspect the uploaded file content and confirm that it is a valid PDF. It must not rely only on the file extension supplied by the user.

## 8. Privacy Requirements

The system should collect only the information required for account management and service delivery.

It should provide:

- A privacy notice.
- A clear explanation of collected data.
- Secure storage of user account information.
- Account deactivation or deletion procedures.
- Restricted access to administrator logs.
- No public display of users' email addresses or personal information.

Download and activity records should be retained only as long as necessary for administration and reporting.

## 9. Non-Functional Requirements

### 9.1 Usability

- The interface should be simple and suitable for students.
- Important actions should be clearly labeled.
- The system should be usable by people with basic computer knowledge.
- Forms should display clear validation messages.
- The interface should be responsive on desktop, tablet, and mobile screens.

### 9.2 Performance

- Normal pages should load quickly under expected usage.
- PDF listings should use pagination.
- Large files should be streamed instead of unnecessarily loaded into memory.
- Search results should appear without significant delay.
- The system should support the expected number of simultaneous users.

### 9.3 Availability

- The application should be available during normal operating hours and preferably continuously.
- Scheduled maintenance should be communicated to administrators.
- Backups should be automated.

### 9.4 Accessibility

The portal should support:

- Keyboard navigation.
- Sufficient color contrast.
- Descriptive form labels.
- Alternative text for meaningful images.
- Visible focus indicators.
- Accessible error messages.
- Readable font sizes.

### 9.5 Scalability

The system should support future growth in:

- Number of users.
- Number of PDF files.
- Number of categories.
- Storage capacity.
- Number of administrators.

## 10. Suggested Page Structure

### 10.1 Public Pages

- Home page.
- About District Computer Centre Tinsukia.
- Registration page.
- Login page.
- Password reset page.
- Contact or help page.

### 10.2 Registered User Pages

- User dashboard.
- Notes library.
- Search results.
- Note details page.
- PDF viewer.
- Profile settings.
- Change password page.

### 10.3 Administrator Pages

- Administrator login.
- Administrator dashboard.
- Upload note page.
- Manage notes page.
- Edit note page.
- Manage users page.
- Activity logs.
- System settings.

## 11. Note Publishing Workflow

1. Administrator logs in.
2. Administrator opens the upload page.
3. Administrator selects a PDF file.
4. Administrator enters the title, subject, topic, and description.
5. The system validates the PDF and metadata.
6. The system uploads and stores the file securely.
7. The administrator previews the note information.
8. The administrator publishes the note.
9. The note becomes visible in the registered-user notes library.
10. A registered user logs in.
11. The user searches for the note.
12. The user views the PDF online or downloads it.

A note saved as a draft or marked unpublished must not be visible to registered users.

## 12. Basic Data Model

### 12.1 Users

- User ID.
- Full name.
- Email address.
- Mobile number, if collected.
- Password hash.
- Role.
- Account status.
- Registration date.
- Last login date.
- Updated date.

### 12.2 Notes

- Note ID.
- Title.
- Description.
- Subject.
- Course or class.
- Topic.
- Secure file identifier.
- Original filename.
- File size.
- MIME type.
- Uploaded by administrator.
- Status.
- Publication date.
- Created date.
- Updated date.
- Download count.

### 12.3 Categories

- Category ID.
- Category name.
- Description.
- Active status.

### 12.4 Download Logs

- Log ID.
- User ID.
- Note ID.
- Download date and time.
- IP address, subject to privacy requirements.
- User-agent information, if required.

### 12.5 Activity Logs

- Activity ID.
- Administrator or user ID.
- Action type.
- Affected record.
- Date and time.
- Status.
- Additional details.

## 13. Acceptance Criteria

### 13.1 Registration and Login

- A visitor can register with valid information.
- Duplicate email addresses are rejected.
- A registered user can log in and log out.
- Invalid credentials are rejected.
- An administrator can log in through the administrator authentication process.

### 13.2 Upload and Administration

- A registered user cannot see the upload option.
- A registered user cannot upload a PDF by directly calling the upload endpoint.
- An administrator can upload a valid PDF.
- Non-PDF files are rejected.
- Files exceeding the configured size limit are rejected.
- The administrator can enter and save note metadata.
- The administrator can publish, unpublish, edit, and delete notes.

### 13.3 Viewing and Downloading

- An authenticated registered user can view published notes.
- An authenticated registered user can download published notes.
- An unauthenticated visitor cannot access protected notes.
- An unpublished note is not visible to registered users.
- A user cannot access a note through an unauthorized direct file path.
- Downloaded files open as valid PDFs.

### 13.4 Security

- Backend role checks prevent unauthorized uploads.
- Passwords are not stored in plain text.
- Protected pages require authentication.
- Administrator actions are logged.
- Uploaded files cannot execute as server-side code.
- Sessions are invalidated after logout.

## 14. Error and Empty States

The system should provide clear messages for common scenarios:

- `Please log in to view or download notes.`
- `No notes are available at this time.`
- `No notes match your search.`
- `Only PDF files are allowed.`
- `The selected file exceeds the maximum permitted size.`
- `The file could not be uploaded. Please try again.`
- `This note is currently unavailable.`
- `You do not have permission to perform this action.`
- `Your account has been deactivated. Please contact the administrator.`

Error messages should not expose technical or security-sensitive information.

## 15. Reporting and Analytics

The first release may include:

- Total registered users.
- Total published notes.
- Total downloads.
- Most downloaded notes.
- Notes uploaded during a selected date range.
- Recently active users.

Analytics should be limited to information needed for administration and should respect privacy requirements.

## 16. Deployment and Maintenance Requirements

The deployment should include:

- Testing and production environments.
- Database backup schedule.
- PDF storage backup.
- Server availability monitoring.
- Storage capacity monitoring.
- Secure administrator account recovery.
- Software and security updates.
- Application and document restoration procedures.

Backups must include both the database and uploaded PDF files. Backing up only the database will not be sufficient.

## 17. Future Enhancements

Potential future improvements include:

- Bookmarks and favorites.
- Notifications when new notes are published.
- Email announcements.
- Multiple administrator levels.
- Bulk PDF upload.
- PDF preview thumbnails.
- OCR-based search inside PDFs.
- Notes version history.
- Multilingual interface.
- Mobile application.
- Usage dashboards.
- Integration with training or examination systems.

## 18. Product Success Measures

The product will be successful if:

- Administrators can upload and publish notes without technical assistance.
- Registered users can quickly find required notes.
- Unauthorized users cannot upload or access protected documents.
- The use of printed notes is reduced.
- Users can reliably view and download valid PDF files.
- The system remains easy to maintain as the notes collection grows.
