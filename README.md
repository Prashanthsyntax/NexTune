# NexTune – Music Streaming Platform

## Final folder structure

```bash
NexTune/
├── backend/
│   └── src/
│       └── main/
│           ├── java/com/nextune/backend/
│           │   ├── config/          ← Security, CORS, JWT config
│           │   ├── controller/      ← REST controllers
│           │   ├── service/         ← Business logic
│           │   ├── repository/      ← JPA repositories
│           │   ├── model/           ← Entity classes
│           │   ├── dto/             ← Request/Response DTOs
│           │   ├── security/        ← JWT filter, UserDetails
│           │   ├── exception/       ← Global exception handler
│           │   └── util/            ← Helper classes
│           └── resources/
│               ├── application.yml  ← DB + JWT config
│               └── static/          ← (optional static files)
│
├── frontend/
│   └── src/
│       ├── api/             ← Axios instances & API calls
│       ├── assets/          ← Images, icons, fonts
│       ├── components/
│       │   ├── common/      ← Button, Input, Modal, etc.
│       │   ├── layout/      ← Sidebar, Navbar, Player
│       │   └── player/      ← Audio player component
│       ├── hooks/           ← Custom React hooks
│       ├── pages/
│       │   ├── auth/        ← Login, Register, ForgotPassword
│       │   ├── home/
│       │   ├── search/
│       │   ├── playlist/
│       │   ├── artist/
│       │   ├── admin/
│       │   └── profile/
│       ├── store/           ← Zustand global state
│       ├── utils/           ← Helpers, constants
│       └── App.jsx
│
└── README.md
```
