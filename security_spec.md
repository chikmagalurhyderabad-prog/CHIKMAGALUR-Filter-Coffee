# Security Specification

## Data Invariants
1. A contact message must have a valid string name, email, and message.
2. The `createdAt` timestamp must be strictly validated against `request.time`.
3. Anyone can create a contact message (even unauthenticated users, as it's a public contact form).
4. No one can read, update, or delete contact messages except admins (but we don't have admins right now, so we just deny read/update/delete for everyone).

## The "Dirty Dozen" Payloads
1. Name too long.
2. Email too long.
3. Message too long.
4. Missing name.
5. Missing email.
6. Missing message.
7. Missing createdAt.
8. createdAt not a timestamp.
9. createdAt is in the past (not request.time).
10. Trying to add an extra field (e.g., `role`).
11. Trying to read contact messages.
12. Trying to update a contact message.

## The Test Runner
A `firestore.rules.test.ts` will verify these conditions.
