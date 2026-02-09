## 📁 Step-by-Step Instructions

### Step 1: Create Specification Structure

Create this folder structure in your repository:

```
specs/
└── phase4/
    ├── overview.md
    ├── environment-setup.md
    ├── frontend-container.md
    ├── backend-container.md
    ├── image-build.md
    ├── kubernetes/
    │   ├── namespace.md
    │   ├── configmaps.md
    │   ├── secrets.md
    │   ├── deployments.md
    │   ├── services.md
    │   └── ingress.md
    ├── helm/
    │   ├── chart-structure.md
    │   ├── chart-metadata.md
    │   ├── values-schema.md
    │   ├── templates.md
    │   └── helpers.md
    ├── deployment-workflow.md
    ├── ingress-config.md
    ├── testing.md
    └── documentation.md
```

---

### Step 2: Write Your First Specification

**Example:** `/specs/phase4/frontend-container.md`

```markdown
# Frontend Container Specification

## Purpose
Create a production-ready Docker container for the Next.js frontend application.

## Requirements

### Base Configuration
- Base image: node:20-alpine
- Build type: Multi-stage (builder + runner)
- Working directory: /app
- Exposed port: 3000

### Builder Stage
1. Use node:20-alpine as base
2. Copy package.json and package-lock.json
3. Run npm ci (clean install)
4. Copy all source files
5. Build Next.js app with standalone output mode
6. Build command: npm run build

### Runner Stage  
1. Use node:20-alpine as base
2. Set NODE_ENV=production
3. Copy built files from builder:
   - public/ folder
   - .next/standalone/
   - .next/static/
4. Run as non-root user (create user 'nextjs' with UID 1001)
5. Command: node server.js

### Optimization Requirements
- Final image size: < 150MB
- No development dependencies in final image
- Use .dockerignore to exclude:
  - node_modules
  - .git
  - .env.local
  - .next (build artifacts)
  - README.md

### Health Check
- Endpoint: /api/health must exist in Next.js app
- Should return 200 OK when healthy
- Include in deployment, not in Dockerfile

### Security
- Run as non-root user
- No secrets in image
- Scan with docker scout (no high/critical vulnerabilities)

## Acceptance Criteria
- [ ] Image builds without errors
- [ ] Image size is under 150MB
- [ ] Container starts and serves on port 3000
- [ ] Health endpoint returns 200
- [ ] Security scan passes
- [ ] Application functions correctly

## Testing
```bash
# Build
docker build -t todo-frontend:test -f frontend/Dockerfile frontend/

# Check size
docker images todo-frontend:test

# Run
docker run -p 3000:3000 todo-frontend:test

# Test
curl http://localhost:3000/api/health
```

## Notes
- Ensure next.config.js has output: 'standalone'
- Health endpoint must be implemented in Next.js app
```

---
### Step 3: Use Claude Code to Generate Implementation

Open Claude Code and use this prompt pattern:

```
@specs/phase4/frontend-container.md

Please read this specification and create the Dockerfile in frontend/Dockerfile 
according to all requirements listed.

Also create frontend/.dockerignore as specified.

Follow Docker best practices for Next.js production builds.
```

---

### Step 4: Validate and Iterate

**A. Test the generated Dockerfile:**

```bash
# Build the image
docker build -t todo-frontend:test -f frontend/Dockerfile frontend/

# Check the size
docker images todo-frontend:test
```

**B. If it doesn't meet requirements:**

1. **Identify the issue:**
   - Image too large? (> 150MB)
   - Build fails?
   - Missing functionality?

2. **Refine the specification:**
   - Add more specific details
   - Include examples
   - Clarify ambiguous requirements

3. **Update spec version:**
   ```markdown
   ## Version History
   - v1.0 (Jan 2, 2026): Initial spec
   - v1.1 (Jan 2, 2026): Added specific npm ci command, clarified standalone output
   ```

4. **Ask Claude Code to regenerate:**
   ```
   @specs/phase4/frontend-container.md
   
   The previous Dockerfile resulted in a 400MB image. Please regenerate 
   with focus on the size optimization requirements (target: <150MB).
   
   Key changes needed:
   - Use Alpine base
   - Multi-stage build
   - Copy only necessary files
   ```

**C. Document the iteration:**

In `/docs/SDD-PROCESS.md`:
```markdown
### Frontend Dockerfile - Iteration 1

**Problem:** Initial image was 400MB, exceeding 150MB target

**Spec Refinement:**
- Added explicit Alpine Linux requirement
- Clarified multi-stage build necessity  
- Specified exact files to copy

**New Prompt:**
[paste your refined prompt]

**Result:** ✅ Image size reduced to 120MB
```

---

### Step 5: Repeat for All Components

Apply the same process for:

1. **Backend Dockerfile** (`/specs/phase4/backend-container.md`)
2. **Kubernetes Namespace** (`/specs/phase4/kubernetes/namespace.md`)
3. **ConfigMaps** (`/specs/phase4/kubernetes/configmaps.md`)
4. **Secrets** (`/specs/phase4/kubernetes/secrets.md`)
5. **Deployments** (`/specs/phase4/kubernetes/deployments.md`)
6. **Services** (`/specs/phase4/kubernetes/services.md`)
7. **Ingress** (`/specs/phase4/kubernetes/ingress.md`)
8. **Helm Chart** (`/specs/phase4/helm/*.md`)
9. **Scripts** (`/specs/phase4/deployment-workflow.md`)

---
### Step 6: Use Gordon (Docker AI) if Available

# Generate Dockerfile
docker ai "Create an optimized production Dockerfile for Next.js 14 with:
- Multi-stage build
- Alpine Linux base  
- Final image under 150MB
- Health check support
- Non-root user"

# Get Gordon's output, then save to file and test

# Optimize further
docker ai "Analyze this Dockerfile and suggest size optimizations"
```

**Document everything Gordon suggests in `/docs/GORDON-USAGE.md`**

---

### Step 7: Use kubectl-ai and kagent

For Kubernetes operations, use natural language:

```bash
# Deployment
kubectl-ai "create a deployment for the todo frontend with 2 replicas"

# Debugging  
kubectl-ai "why are my backend pods crashing?"

# Scaling
kubectl-ai "scale the backend to handle more traffic"

# Cluster analysis
kagent "analyze cluster health and suggest optimizations"
```

**Document all commands in `/docs/KUBECTL-AI-COMMANDS.md`**

---

### Step 8: Create Helm Chart with Claude Code

1. **Write Helm specifications** in `/specs/phase4/helm/`

2. **Prompt Claude Code:**
```
@specs/phase4/helm/chart-structure.md
@specs/phase4/helm/chart-metadata.md  
@specs/phase4/helm/values-schema.md
@specs/phase4/helm/templates.md

Generate a complete Helm chart in helm/todo-app-chart/ that:
- Includes all Kubernetes resources as templates
- Uses Helm templating syntax {{ .Values.* }}
- Parameterizes all configurable values
- Passes helm lint validation
```

3. **Validate:**
```bash
helm lint helm/todo-app-chart
helm template todo-app helm/todo-app-chart --debug
```

---

### Step 9: Document Your SDD Process

Create `/docs/SDD-PROCESS.md` with these sections:

#### A. Overview
```markdown
# Spec-Driven Development Process - Phase IV

## Approach
I used Spec-Driven Development exclusively for Phase IV, writing detailed 
specifications before any code generation.

## Tools Used
- Claude Code (primary implementation agent)
- Gordon (Docker AI optimization)
- kubectl-ai (Kubernetes operations)
- kagent (cluster analysis)
- Spec-Kit Plus (specification management)

## Key Learnings
[Your main insights about SDD]
```

#### B. For Each Component (minimum 3 detailed examples)

```markdown
### Component: Frontend Dockerfile

#### Iteration 1
**Spec Location:** `/specs/phase4/frontend-container.md` v1.0

**Initial Specification:**
- Basic requirements for Next.js containerization
- Target: production-ready image

**Claude Code Prompt:**
```
@specs/phase4/frontend-container.md
Create Dockerfile for Next.js frontend
```
