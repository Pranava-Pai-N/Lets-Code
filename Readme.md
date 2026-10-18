# Let's Code 

**Let's Code** is a high-performance, full-stack DSA (Data Structures and Algorithms) preparation platform. It is designed for developers to solve algorithmic challenges, follow structured learning paths, and engage in meaningful technical discussions with peers.





## Live Demo
Experience the platform here: [View Demo Here](https://lets-code.pranava-pai.live)



## Tech Stack

### Frontend
* **React.js (Vite)** – High-performance component-based UI.
* **Tailwind CSS** – Modern utility-first styling.
* **React Context API** – Centralized state management for Authentication.
* **Axios** – Secure API communication with interceptors.
* **React Toastify** – Real-time user feedback and notifications.

### Backend
* **Node.js & Express.js** – Scalable and fast server-side architecture.
* **MongoDB & Mongoose** – Flexible NoSQL data modeling and storage.
* **Judge0** - Online code execution engine for support with 20+ Languages support.
* **Passport.js** – Secure Google OAuth 2.0 integration and Github Login.
* **JWT (JSON Web Tokens)** – Cookie-based, stateless session management.
* **Multer and Cloudinary** - For file upload and providing links to the files

### Deployment
* **Vercel** – Frontend hosting with advanced API rewrites/proxies.
* **Render** – Reliable backend service deployment.



## Key Features

* **Structured Learning Paths:** Curriculum-based progress tracking for specific DSA topics.
* **Test Mode Enablement:** To promote distraction free learning enviroment while practicing problems.
* **Community Discussions:** Interactive discussion system and comments for every problem to share insights and solutions.
* **HandPicked Questions** - Questions are handpicked and given with details like acceptance rate, difficulty meter etc

---
## Folder Structure

### Frontend
```
frontend
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── public
│   └── assets    
├── README.md
├── .env
├── .env.example
├── src
│   ├── App.css
│   ├── App.jsx
│   ├── components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── CodeEditor.jsx
│   │   ├── CompilerOutput.jsx
│   │   ├── CountdownTimer.jsx
│   │   ├── Discussion.jsx
│   │   ├── Loader.jsx
│   │   ├── Modal.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── Sidebar.jsx
│   ├── constants
│   │   └── boilerplates.js
│   ├── context
│   │   ├── AuthContext.jsx
│   │   ├── compilerContext.jsx
│   │   └── themecontext.jsx
│   ├── hooks
│   │   ├── useCompiler.js
│   │   ├── useFetchProblems.js
│   │   └── useMobile.js
│   ├── main.jsx
│   ├── pages
│   │   ├── AboutPage.jsx
│   │   ├── AddQuestionPage.jsx
│   │   ├── CompleteProfile.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── NotFound.jsx
│   │   ├── Privacy.jsx
│   │   ├── ProblemDetail.jsx
│   │   ├── ProblemList.jsx
│   │   ├── Register.jsx
│   │   ├── SubmissionDetails.jsx
│   │   ├── SubmissionsPage.jsx
│   │   ├── Terms.jsx
│   │   ├── UserProfile.jsx
│   │   └── VerifyEmail.jsx
│   └── utils
│       ├── faceMask.js
│       ├── formatDate.js
│       ├── languageMap.js
│       └── validation.js
├── tailwind.config.js
├── vercel.json
└── vite.config.js
```

### Backend
```
backend
├── .gitignore
├── .env
├── .env.example
├── controllers
│   ├── comment.controller.js
│   ├── discussions.controllers.js
│   ├── notifications.controller.js
│   ├── paths.controllers.js
│   ├── questions.contollers.js
│   └── user.controllers.js
├── middleware
│   ├── adminProtected.middleware.js
│   ├── auth.middleware.js
│   ├── multer.middleware.js
│   └── userProtected.middleware.js
├── models
│   ├── comments.models.js
│   ├── discussions.models.js
│   ├── notifications.models.js
│   ├── paths.models.js
│   ├── questions.models.js
│   ├── submissions.models.js
│   └── user.models.js
├── package-lock.json
├── package.json
├── routes
│   ├── comments.routes.js
│   ├── discussion.routes.js
│   ├── notifications.routes.js
│   ├── paths.routes.js
│   ├── questions.routes.js
│   └── user.routes.js
├── server.js
├── temp
│   └── profile_urls
├── utils
│   ├── asyncHandler.js
│   ├── cloudinary.js
│   ├── dbConnect.js
│   ├── EmailServices
│   │   ├── otpemailpasswordforgot.js
│   │   ├── sendEmail.js
│   │   └── sendVerifyEmail.js
│   ├── errorHandler.js
│   ├── expressError.js
│   ├── geminiHelp.js
│   ├── getLeetcodeData.js
│   ├── isValidObjectId.js
│   └── passport.js
└── validations
    ├── addCommentValidation.js
    ├── commentReplyValidation.js
    ├── discussionPost.js
    ├── forgotPassword.js
    ├── passwordresetValidation.js
    ├── profileEditValidation.js
    ├── profileValidation.js
    └── registrationValidation.js
```
---


## Installation & Local Setup

### A. Clone the repository
```bash
git clone https://github.com/your-userName/Lets-Code.git

cd Lets-Code
```

### B. Two Methods for working with the project

1. ### Run backend and frontend seperately

- Backend Configuration:

    ```bash
    cd backend

    npm install

    npm run dev:setup  # This command scans sample env file and generates hex values for .env file

    npm run dev
    ```

- Frontend Configuration:
    ```bash
    cd frontend

    npm install

    cp .env.example .env

    npm run dev
    ```

2. ### Run backend and frontend together
    ```bash
    cd Lets-Code

    npm install  # First install the concurrently module to run both the backend and frontend together

    npm install-all    # Uses concurrently module - Frontend is denoted by red and backend is denoted by blue

    npm run dev   # Run both the frontend and backend together in a single terminal
    ```

## Docker Setup
This repository includes a `docker-compose.yml` in the root-directory that builds both frontend and backend services.

### Prerequisites
- Docker installed locally and running
- Docker Compose

### 1. Copy env files
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

##### `Note` : Replace all the required keys with the respective values in the env files

### 2. Build and start services
From the `project root`:
1. Normal Mode
```bash
docker compose up --build
```

2. Detached Mode - Background
```bash
docker compose up -d --build
```

### 3. Access the app
* Frontend: `http://localhost:5173`
* Backend: `http://localhost:3000`

### 4. Stop services
```bash
docker compose down
```


## Contribution Options
Any contributions you make are greatly appreciated.

### Report Bugs: 
Open an issue to describe bugs or glitches.

### Feature Requests: 
Suggest new features by opening an issue with the enhancement label.

### Pull Requests:
```
Fork the Project.
```
### Create your Feature Branch 
```
git checkout -b feature/AmazingFeature
```
### Commit your Changes 
```
git commit -m 'Add some AmazingFeature'
```

### Push to the Branch 
```
git push origin feature/AmazingFeature
```

### Open a Pull Request
```
Open a PR with a valid feature name and comments
```

## License
The project is licensed under the terms included in the [LICENSE](./LICENSE) file


## Contact
#### Project Link: 
```
https://lets-code.pranava-pai.live
```
#### Github Repo:
```
https://github.com/Pranava-Pai-N/Lets-Code
```

Developed with &#10084; by [Pranava Pai N](https://github.com/pranava-pai-n)