# Todo App - Phase 4: Kubernetes Deployment

A full-stack todo application with user authentication and task management, now containerized and deployed on Kubernetes.

## Tech Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS, Better Auth
- **Backend**: FastAPI, SQLModel, PostgreSQL (Neon)
- **Infrastructure**: Docker, Kubernetes, Helm
- **Authentication**: Better Auth with JWT

## Features

✅ User authentication (sign up, sign in, sign out)  
✅ Task CRUD operations (create, read, update, delete)  
✅ Task filtering (all, active, completed)  
✅ User isolation (users only see their own tasks)  
✅ Premium dark theme UI with smooth animations  
✅ Responsive design

## Quick Start

### 1. Create Frontend Environment File

Create `frontend/.env.local`:

```env
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
DATABASE_URL=
NEXT_PUBLIC_API_URL=
```

### 2. Setup Database

```bash
cd frontend
npx prisma db push
```

### 3. Start Backend

```bash
cd backend
uvicorn main:app --reload
```

Backend runs on

### 4. Start Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on

## Usage

1. Navigate to
2. Click "Sign Up" to create an account
3. Sign in with your credentials
4. Start creating and managing tasks!

## Project Structure

```
todo/
├── backend/
│   ├── main.py          # FastAPI app with CRUD endpoints
│   ├── models.py        # SQLModel schemas
│   ├── db.py            # Database connection
│   └── auth.py          # JWT verification
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/    # Dashboard page
│   │   │   ├── sign-in/      # Sign in page
│   │   │   └── sign-up/      # Sign up page
│   │   ├── components/
│   │   │   └── tasks/        # Task components
│   │   └── lib/
│   │       ├── auth.ts       # Better Auth config
│   │       ├── auth-client.ts # Auth client
│   │       └── api.ts        # API client
│   └── prisma/
│       └── schema.prisma     # Database schema
└── specs/                    # Project specifications
```

## API Endpoints

- `POST /api/tasks` - Create task
- `GET /api/tasks` - List tasks
- `PATCH /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

All endpoints require authentication via `Authorization: Bearer <token>` header.

## License

MIT

## Phase 4: Kubernetes Deployment

This project is now fully containerized and ready for Kubernetes deployment.

### Quick Deployment

Run the automated workflow script to build images and deploy to your local cluster (minikube/Docker Desktop):

```bash
./deployment-workflow.sh
```

### Detailed Documentation

For step-by-step setup, troubleshooting, and manual deployment instructions, please refer to:

- [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)

### Deployment Artifacts

- **Dockerfiles**: `frontend/Dockerfile`, `backend/Dockerfile`
- **Kubernetes Manifests**: `kubernetes/base/`
- **Helm Chart**: `helm/todo-app-chart/`
- **Specifications**: `specs/phase4/`
