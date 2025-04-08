# NoteWorthy

Live Link: https://noteworthy-3gfa.onrender.com/

## Overview

NoteWorthy is a note-taking web application inspired by Evernote. It allows users to create, manage, and organize notebooks, notes, tasks, and tags efficiently.

## Getting Started

### Installation & Setup

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-repo/noteworthy.git
   ```

2. **Install dependencies:**
   ```sh
   cd noteworthy
   npm install
   ```

3. **Set up the database:**
   ```sh
   npx sequelize db:migrate
   npx sequelize db:seed:all
   ```

4. **Start the backend server:**
   ```sh
   npm run dev
   ```

5. **Start the frontend server:**
   ```sh
   cd frontend
   npm start
   ```

## Features

- User authentication (sign-up, login, logout, demo user)
- Create, edit, and delete notebooks
- Create, edit, and delete notes within notebooks
- Assign tags to notes for organization
- Create and manage tasks with due dates
- Fully functional API for seamless integration

## Database Schema

### Users Table

| Column       | Type        |
|-------------|------------|
| id          | integer (PK) |
| first_name  | varchar(25) |
| last_name   | varchar(25) |
| username    | varchar(25) |
| email       | varchar(25) |
| password    | varchar(25) |
| created_at  | timestamp   |
| updated_at  | timestamp   |

### NoteBooks Table

| Column      | Type        |
|------------|------------|
| id         | integer (PK) |
| name       | varchar(25) |
| user_id    | integer (FK -> Users) |
| created_at | timestamp   |
| updated_at | timestamp   |

### Notes Table

| Column      | Type        |
|------------|------------|
| id         | integer (PK) |
| title      | varchar(25) |
| content    | text        |
| notebook_id| integer (FK -> Notebooks) |
| created_at | timestamp   |
| updated_at | timestamp   |

### Tasks Table

| Column      | Type        |
|------------|------------|
| id         | integer (PK) |
| title      | varchar(25) |
| description| text        |
| due_date   | datetime    |
| completed  | boolean     |
| notebook_id| integer (FK -> Notebooks) |
| created_at | timestamp   |
| updated_at | timestamp   |

### Tags Table

| Column      | Type        |
|------------|------------|
| id         | integer (PK) |
| name       | varchar(25) |
| created_at | timestamp   |
| updated_at | timestamp   |

### NoteTags Table (Many-to-Many Relationship between Notes and Tags)

| Column      | Type        |
|------------|------------|
| id         | integer (PK) |
| note_id    | integer (FK -> Notes) |
| tag_id     | integer (FK -> Tags) |
| created_at | timestamp   |
| updated_at | timestamp   |

## API Routes

### Notebooks

- **GET** `/api/notebooks` - Retrieve all notebooks owned by the user.
- **POST** `/api/notebooks` - Create a new notebook.
- **GET** `/api/notebooks/:notebookId` - Get details of a specific notebook.
- **PUT** `/api/notebooks/:notebookId` - Edit a notebook's details.
- **DELETE** `/api/notebooks/:notebookId` - Delete a notebook.

### Notes (Nested under Notebooks)

- **POST** `/api/notes/new` - Create a new note within a notebook.
- **GET** `/api/notes/notebook/:notebookId` - Get all notes in a notebook.
- **GET** `/api/notes/:noteId` - Get details of a note.
- **PUT** `/api/notes/:noteId` - Edit a note.
- **DELETE** `/api/notes/:noteId` - Delete a note.

### Tasks (Nested under Notebooks)

- **POST** `/api/tasks` - Create a task.
- **GET** `/api/tasks/notebook/:notebookId` - Get all tasks within a notebook.
- **PUT** `/api/tasks/:taskId` - Edit a task.
- **DELETE** `/api/tasks/:taskId` - Delete a task.

### Tags (Nested under Notebooks)

- **POST** `/api/tags/:noteId` - Add a tag to a note.
- **GET** `/api/tags/:noteId` - Get all tags for a specific note.
- **DELETE** `/api/tags/:noteId` - Remove a tag from a note.

## User Stories

### Authentication

- Users can sign up, log in, and log out.
- Users can log in as a demo user.

### Notebooks

- Users can create, view, edit, and delete notebooks.
- Users can see all their notebooks in one place.

### Notes

- Users can create, view, edit, and delete notes inside notebooks.
- Notes support tagging for better organization.

### Tasks

- Users can create, view, edit, and delete tasks with due dates.
- Tasks are linked to specific notebooks.

### Tags

- Users can create, view, edit, and delete tags.
- Users can assign multiple tags to notes.

## Technologies Used

- **Frontend:** React, Redux, React Router
- **Backend:** Flask, SQLAlchemy, PostgreSQL
- **Authentication:** JWT & bcrypt
- **Deployment:** Render

## Future Enhancements

- Implement real-time collaboration features.
- Add rich text editing for notes.
- Enable file attachments for notes.
- Improve search functionality across notes and tasks.


[Render.com]: https://render.com/
[Dashboard]: https://dashboard.render.com/
[Live link]: https://github.com/Mortemus763/Noteworthy/wiki
