# NexTune — Music Streaming Platform

A full-stack music streaming platform built with **React**, **Spring Boot**, and **MySQL**. NexTune supports song streaming, playlist management, artist uploads, admin moderation, and premium downloads.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [MySQL Database](#mysql-database)
   - [Setup](#database-setup)
   - [Schema / Table Structure](#schema--table-structure)
   - [All SQL Queries](#all-sql-queries)
5. [Backend — Spring Boot](#backend--spring-boot)
   - [Setup & Configuration](#backend-setup--configuration)
   - [Security — JWT](#security--jwt)
   - [API Endpoints Reference](#api-endpoints-reference)
6. [Frontend — React](#frontend--react)
   - [Setup](#frontend-setup)
   - [Folder Structure](#frontend-folder-structure)
   - [State Management](#state-management)
   - [Pages & Components](#pages--components)
7. [Features](#features)
8. [Running the Project](#running-the-project)
9. [Default Users & Test Flow](#default-users--test-flow)

---

## Project Overview

NexTune is a Spotify-inspired music streaming platform where:

- **Listeners** can stream songs, create playlists, like songs, and follow artists
- **Artists** can upload songs and albums, manage their profile, and view analytics
- **Admins** can approve/reject artist uploads, manage users, create genres, and view platform stats

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Tailwind CSS v4, Zustand, React Router v6, Axios |
| Backend | Spring Boot 3.3.5, Spring Security, Spring Data JPA, JWT |
| Database | MySQL 8.x |
| File Storage | Local filesystem (`./uploads/`) |
| Auth | JWT (JSON Web Tokens) + Role-based access control |

---

## Project Structure

```bash
NexTune/
├── backend/
│   └── src/
│       └── main/
│           ├── java/com/nextune/backend/
│           │   ├── config/
│           │   │   ├── SecurityConfig.java
│           │   │   └── WebConfig.java
│           │   ├── controller/
│           │   │   ├── AuthController.java
│           │   │   ├── SongController.java
│           │   │   ├── ArtistController.java
│           │   │   ├── AlbumController.java
│           │   │   ├── PlaylistController.java
│           │   │   ├── LikeController.java
│           │   │   ├── FollowController.java
│           │   │   ├── HistoryController.java
│           │   │   ├── GenreController.java
│           │   │   ├── AdminController.java
│           │   │   └── UserController.java
│           │   ├── dto/
│           │   │   ├── RegisterRequest.java
│           │   │   ├── LoginRequest.java
│           │   │   ├── AuthResponse.java
│           │   │   ├── ApiResponse.java
│           │   │   ├── SongResponse.java
│           │   │   ├── ArtistResponse.java
│           │   │   ├── ArtistProfileResponse.java
│           │   │   ├── AlbumResponse.java
│           │   │   ├── PlaylistResponse.java
│           │   │   ├── GenreResponse.java
│           │   │   ├── UserResponse.java
│           │   │   ├── UserProfileResponse.java
│           │   │   ├── HistoryResponse.java
│           │   │   └── AdminStatsResponse.java
│           │   ├── exception/
│           │   │   └── GlobalExceptionHandler.java
│           │   ├── model/
│           │   │   ├── User.java
│           │   │   ├── Role.java
│           │   │   ├── Artist.java
│           │   │   ├── Album.java
│           │   │   ├── Song.java
│           │   │   ├── Genre.java
│           │   │   ├── Playlist.java
│           │   │   ├── LikedSong.java
│           │   │   ├── Follow.java
│           │   │   └── ListeningHistory.java
│           │   ├── repository/
│           │   │   ├── UserRepository.java
│           │   │   ├── ArtistRepository.java
│           │   │   ├── AlbumRepository.java
│           │   │   ├── SongRepository.java
│           │   │   ├── GenreRepository.java
│           │   │   ├── PlaylistRepository.java
│           │   │   ├── LikedSongRepository.java
│           │   │   ├── FollowRepository.java
│           │   │   └── ListeningHistoryRepository.java
│           │   ├── security/
│           │   │   ├── JwtUtil.java
│           │   │   ├── JwtAuthFilter.java
│           │   │   └── CustomUserDetailsService.java
│           │   └── service/
│           │       ├── AuthService.java
│           │       ├── UserService.java
│           │       ├── SongService.java
│           │       ├── ArtistService.java
│           │       ├── AlbumService.java
│           │       ├── PlaylistService.java
│           │       ├── LikeService.java
│           │       ├── FollowService.java
│           │       ├── HistoryService.java
│           │       ├── GenreService.java
│           │       ├── AdminService.java
│           │       └── FileStorageService.java
│           └── resources/
│               └── application.yml
│
├── frontend/
│   └── src/
│       ├── api/
│       │   ├── axios.js
│       │   ├── authApi.js
│       │   ├── songsApi.js
│       │   ├── artistApi.js
│       │   ├── albumApi.js
│       │   ├── playlistApi.js
│       │   ├── likeApi.js
│       │   ├── historyApi.js
│       │   ├── genreApi.js
│       │   ├── adminApi.js
│       │   └── userApi.js
│       ├── components/
│       │   ├── admin/
│       │   │   ├── StatsOverview.jsx
│       │   │   ├── UsersTable.jsx
│       │   │   ├── PendingSongsList.jsx
│       │   │   └── GenreManager.jsx
│       │   ├── artist/
│       │   │   ├── BecomeArtist.jsx
│       │   │   ├── UploadSongModal.jsx
│       │   │   ├── CreateAlbumModal.jsx
│       │   │   └── EditArtistModal.jsx
│       │   ├── common/
│       │   │   ├── Input.jsx
│       │   │   ├── Button.jsx
│       │   │   └── ProtectedRoute.jsx
│       │   ├── layout/
│       │   │   └── Layout.jsx
│       │   ├── player/
│       │   │   ├── Player.jsx
│       │   │   ├── SongCard.jsx
│       │   │   ├── SongListItem.jsx
│       │   │   ├── LikeButton.jsx
│       │   │   ├── AddToPlaylistMenu.jsx
│       │   │   └── DownloadButton.jsx
│       │   └── playlist/
│       │       └── CreatePlaylistModal.jsx
│       ├── hooks/
│       │   └── useDebounce.js
│       ├── pages/
│       │   ├── admin/
│       │   │   └── AdminDashboard.jsx
│       │   ├── artist/
│       │   │   └── ArtistDashboard.jsx
│       │   ├── auth/
│       │   │   ├── Login.jsx
│       │   │   ├── Register.jsx
│       │   │   └── ForgotPassword.jsx
│       │   ├── home/
│       │   │   └── Home.jsx
│       │   ├── library/
│       │   │   └── Library.jsx
│       │   ├── playlist/
│       │   │   ├── PlaylistDetail.jsx
│       │   │   └── LikedSongs.jsx
│       │   ├── profile/
│       │   │   └── Profile.jsx
│       │   └── search/
│       │       └── Search.jsx
│       ├── store/
│       │   ├── authStore.js
│       │   └── playerStore.js
│       ├── utils/
│       │   └── constants.js
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
└── README.md
```

---

## MySQL Database

### Database Setup

```sql
CREATE DATABASE nextune_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'nextune_user'@'localhost' IDENTIFIED BY 'nextune@123';
GRANT ALL PRIVILEGES ON nextune_db.* TO 'nextune_user'@'localhost';
FLUSH PRIVILEGES;
```

---

### Schema / Table Structure

Hibernate auto-creates all tables from JPA entities when the app starts (`ddl-auto: update`). Below is the complete schema for reference.

#### `users`

```sql
CREATE TABLE users (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    username        VARCHAR(255) NOT NULL UNIQUE,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    profile_image   VARCHAR(255),
    bio             TEXT,
    role            ENUM('LISTENER', 'ARTIST', 'ADMIN') NOT NULL DEFAULT 'LISTENER',
    premium         TINYINT(1) NOT NULL DEFAULT 0,
    active          TINYINT(1) NOT NULL DEFAULT 1,
    email_verified  TINYINT(1) NOT NULL DEFAULT 0,
    created_at      DATETIME,
    updated_at      DATETIME
);
```

#### `genres`

```sql
CREATE TABLE genres (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    image_url   VARCHAR(255)
);
```

#### `artists`

```sql
CREATE TABLE artists (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT NOT NULL UNIQUE,
    artist_name  VARCHAR(255) NOT NULL UNIQUE,
    bio          TEXT,
    profile_image VARCHAR(255),
    cover_image  VARCHAR(255),
    followers    BIGINT DEFAULT 0,
    verified     TINYINT(1) NOT NULL DEFAULT 0,
    created_at   DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### `albums`

```sql
CREATE TABLE albums (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    title        VARCHAR(255) NOT NULL,
    artist_id    BIGINT NOT NULL,
    cover_image  VARCHAR(255),
    release_date DATE,
    description  TEXT,
    album_type   ENUM('ALBUM', 'SINGLE', 'EP') DEFAULT 'ALBUM',
    created_at   DATETIME,
    FOREIGN KEY (artist_id) REFERENCES artists(id)
);
```

#### `songs`

```sql
CREATE TABLE songs (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    artist_id   BIGINT NOT NULL,
    album_id    BIGINT,
    genre_id    BIGINT,
    audio_url   VARCHAR(255) NOT NULL,
    cover_image VARCHAR(255),
    duration    INT,
    play_count  BIGINT DEFAULT 0,
    like_count  BIGINT DEFAULT 0,
    premium     TINYINT(1) NOT NULL DEFAULT 0,
    active      TINYINT(1) NOT NULL DEFAULT 1,
    status      ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    created_at  DATETIME,
    updated_at  DATETIME,
    FOREIGN KEY (artist_id) REFERENCES artists(id),
    FOREIGN KEY (album_id)  REFERENCES albums(id),
    FOREIGN KEY (genre_id)  REFERENCES genres(id)
);
```

#### `playlists`

```sql
CREATE TABLE playlists (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image VARCHAR(255),
    is_public   TINYINT(1) NOT NULL DEFAULT 1,
    user_id     BIGINT NOT NULL,
    created_at  DATETIME,
    updated_at  DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### `playlist_songs` (join table)

```sql
CREATE TABLE playlist_songs (
    playlist_id BIGINT NOT NULL,
    song_id     BIGINT NOT NULL,
    PRIMARY KEY (playlist_id, song_id),
    FOREIGN KEY (playlist_id) REFERENCES playlists(id),
    FOREIGN KEY (song_id)     REFERENCES songs(id)
);
```

#### `liked_songs`

```sql
CREATE TABLE liked_songs (
    id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id  BIGINT NOT NULL,
    song_id  BIGINT NOT NULL,
    liked_at DATETIME,
    UNIQUE KEY uq_liked (user_id, song_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (song_id) REFERENCES songs(id)
);
```

#### `follows`

```sql
CREATE TABLE follows (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT NOT NULL,
    artist_id   BIGINT NOT NULL,
    followed_at DATETIME,
    UNIQUE KEY uq_follow (user_id, artist_id),
    FOREIGN KEY (user_id)   REFERENCES users(id),
    FOREIGN KEY (artist_id) REFERENCES artists(id)
);
```

#### `listening_history`

```sql
CREATE TABLE listening_history (
    id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id   BIGINT NOT NULL,
    song_id   BIGINT NOT NULL,
    played_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (song_id) REFERENCES songs(id)
);
```

---

### All SQL Queries

#### User queries

```sql
-- Register a new user
INSERT INTO users (username, email, password, role, premium, active, created_at, updated_at)
VALUES ('john', 'john@gmail.com', '<bcrypt_hash>', 'LISTENER', 0, 1, NOW(), NOW());

-- Find user by email (used for login)
SELECT * FROM users WHERE email = 'john@gmail.com';

-- Find user by username
SELECT * FROM users WHERE username = 'john';

-- Check if email exists
SELECT COUNT(*) FROM users WHERE email = 'john@gmail.com';

-- Update user profile
UPDATE users SET username = 'newname', bio = 'My bio', updated_at = NOW() WHERE id = 1;

-- Promote to admin
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@gmail.com';

-- Toggle user active status
UPDATE users SET active = 0 WHERE id = 2;  -- deactivate
UPDATE users SET active = 1 WHERE id = 2;  -- activate

-- Upgrade to premium
UPDATE users SET premium = 1 WHERE id = 1;

-- Count users by role
SELECT COUNT(*) FROM users WHERE role = 'LISTENER';
SELECT COUNT(*) FROM users WHERE role = 'ARTIST';
SELECT COUNT(*) FROM users WHERE role = 'ADMIN';

-- Count premium users
SELECT COUNT(*) FROM users WHERE premium = 1;

-- Fix existing users registered before Lombok Builder.Default fix
UPDATE users SET active = 1 WHERE active = 0;
```

#### Genre queries

```sql
-- Create genre
INSERT INTO genres (name, description, image_url) VALUES ('Pop', 'Popular music', '/uploads/genres/pop.jpg');

-- Get all genres
SELECT * FROM genres;

-- Find genre by name
SELECT * FROM genres WHERE name = 'Pop';

-- Check genre exists
SELECT COUNT(*) FROM genres WHERE name = 'Pop';

-- Delete genre
DELETE FROM genres WHERE id = 1;
```

#### Artist queries

```sql
-- Create artist profile
INSERT INTO artists (user_id, artist_name, bio, followers, verified, created_at)
VALUES (1, 'TestArtist', 'My bio', 0, 0, NOW());

-- Update user role to ARTIST after profile creation
UPDATE users SET role = 'ARTIST' WHERE id = 1;

-- Find artist by user ID
SELECT * FROM artists WHERE user_id = 1;

-- Find artist by ID
SELECT * FROM artists WHERE id = 1;

-- Get all artists
SELECT * FROM artists;

-- Update artist profile
UPDATE artists SET bio = 'Updated bio' WHERE id = 1;

-- Increment followers
UPDATE artists SET followers = followers + 1 WHERE id = 1;

-- Decrement followers
UPDATE artists SET followers = GREATEST(0, followers - 1) WHERE id = 1;

-- Verify artist
UPDATE artists SET verified = 1 WHERE id = 1;

-- Fix artists with NULL followers (Lombok Builder.Default bug)
UPDATE artists SET followers = 0 WHERE followers IS NULL;
```

#### Album queries

```sql
-- Create album
INSERT INTO albums (title, artist_id, cover_image, release_date, description, album_type, created_at)
VALUES ('My Album', 1, '/uploads/albums/covers/x.jpg', '2024-01-01', 'Description', 'ALBUM', NOW());

-- Get albums by artist
SELECT * FROM albums WHERE artist_id = 1;

-- Find album by ID
SELECT * FROM albums WHERE id = 1;

-- Search albums by title
SELECT * FROM albums WHERE LOWER(title) LIKE LOWER(CONCAT('%', 'salaar', '%'));

-- Get all albums
SELECT * FROM albums;
```

#### Song queries

```sql
-- Upload song
INSERT INTO songs (title, artist_id, album_id, genre_id, audio_url, cover_image,
                   play_count, like_count, premium, active, status, created_at, updated_at)
VALUES ('My Song', 1, NULL, NULL, '/uploads/songs/audio/x.mp3',
        '/uploads/songs/covers/x.jpg', 0, 0, 0, 1, 'PENDING', NOW(), NOW());

-- Approve song (admin)
UPDATE songs SET status = 'APPROVED' WHERE id = 1;

-- Reject song (admin)
UPDATE songs SET status = 'REJECTED' WHERE id = 1;

-- Get approved songs ordered by play count (top songs)
SELECT s.*, a.artist_name FROM songs s
JOIN artists a ON s.artist_id = a.id
WHERE s.status = 'APPROVED' AND s.active = 1
ORDER BY s.play_count DESC
LIMIT 10;

-- Get latest approved songs
SELECT s.*, a.artist_name FROM songs s
JOIN artists a ON s.artist_id = a.id
WHERE s.status = 'APPROVED' AND s.active = 1
ORDER BY s.created_at DESC
LIMIT 10;

-- Search songs by title or artist name
SELECT s.*, a.artist_name FROM songs s
JOIN artists a ON s.artist_id = a.id
WHERE s.status = 'APPROVED' AND s.active = 1
AND (LOWER(s.title) LIKE LOWER(CONCAT('%', 'salaar', '%'))
OR   LOWER(a.artist_name) LIKE LOWER(CONCAT('%', 'salaar', '%')));

-- Get pending songs (admin review queue)
SELECT s.*, a.artist_name FROM songs s
JOIN artists a ON s.artist_id = a.id
WHERE s.status = 'PENDING' AND s.active = 1;

-- Get songs by artist
SELECT * FROM songs WHERE artist_id = 1;

-- Get songs by album
SELECT * FROM songs WHERE album_id = 1;

-- Get songs by genre
SELECT * FROM songs WHERE genre_id = 2;

-- Increment play count
UPDATE songs SET play_count = play_count + 1 WHERE id = 1;

-- Increment like count
UPDATE songs SET like_count = like_count + 1 WHERE id = 1;

-- Decrement like count
UPDATE songs SET like_count = GREATEST(0, like_count - 1) WHERE id = 1;

-- Delete song
DELETE FROM songs WHERE id = 1;

-- Count songs by status
SELECT COUNT(*) FROM songs WHERE status = 'PENDING';
SELECT COUNT(*) FROM songs WHERE status = 'APPROVED';
SELECT COUNT(*) FROM songs WHERE status = 'REJECTED';

-- Get total plays across all songs
SELECT COALESCE(SUM(play_count), 0) AS total_plays FROM songs;

-- Fix existing songs with NULL values (Lombok Builder.Default bug)
UPDATE songs SET play_count = 0 WHERE play_count IS NULL;
UPDATE songs SET like_count = 0 WHERE like_count IS NULL;
UPDATE songs SET active = 1 WHERE active = 0;
```

#### Playlist queries

```sql
-- Create playlist
INSERT INTO playlists (name, description, cover_image, is_public, user_id, created_at, updated_at)
VALUES ('My Favorites', 'Songs I love', NULL, 1, 1, NOW(), NOW());

-- Get playlists by user
SELECT * FROM playlists WHERE user_id = 1;

-- Get public playlists
SELECT * FROM playlists WHERE is_public = 1;

-- Get playlist by ID
SELECT * FROM playlists WHERE id = 1;

-- Update playlist
UPDATE playlists SET name = 'New Name', description = 'New desc', updated_at = NOW() WHERE id = 1;

-- Delete playlist
DELETE FROM playlists WHERE id = 1;

-- Add song to playlist
INSERT INTO playlist_songs (playlist_id, song_id) VALUES (1, 5);

-- Remove song from playlist
DELETE FROM playlist_songs WHERE playlist_id = 1 AND song_id = 5;

-- Get all songs in a playlist
SELECT s.*, a.artist_name FROM playlist_songs ps
JOIN songs s ON ps.song_id = s.id
JOIN artists a ON s.artist_id = a.id
WHERE ps.playlist_id = 1;

-- Check if song is already in playlist
SELECT COUNT(*) FROM playlist_songs WHERE playlist_id = 1 AND song_id = 5;
```

#### Likes queries

```sql
-- Like a song
INSERT INTO liked_songs (user_id, song_id, liked_at) VALUES (1, 3, NOW());

-- Unlike a song
DELETE FROM liked_songs WHERE user_id = 1 AND song_id = 3;

-- Get all liked songs for a user
SELECT s.*, a.artist_name FROM liked_songs ls
JOIN songs s ON ls.song_id = s.id
JOIN artists a ON s.artist_id = a.id
WHERE ls.user_id = 1
ORDER BY ls.liked_at DESC;

-- Check if user liked a song
SELECT COUNT(*) FROM liked_songs WHERE user_id = 1 AND song_id = 3;
```

#### Follow queries

```sql
-- Follow an artist
INSERT INTO follows (user_id, artist_id, followed_at) VALUES (1, 2, NOW());

-- Unfollow an artist
DELETE FROM follows WHERE user_id = 1 AND artist_id = 2;

-- Get all artists a user follows
SELECT ar.* FROM follows f
JOIN artists ar ON f.artist_id = ar.id
WHERE f.user_id = 1;

-- Check if user follows an artist
SELECT COUNT(*) FROM follows WHERE user_id = 1 AND artist_id = 2;
```

#### Listening history queries

```sql
-- Record a play
INSERT INTO listening_history (user_id, song_id, played_at) VALUES (1, 5, NOW());

-- Get listening history for a user (most recent first)
SELECT lh.id, lh.played_at, s.*, a.artist_name FROM listening_history lh
JOIN songs s ON lh.song_id = s.id
JOIN artists a ON s.artist_id = a.id
WHERE lh.user_id = 1
ORDER BY lh.played_at DESC
LIMIT 50;

-- Clear user's history
DELETE FROM listening_history WHERE user_id = 1;
```

#### Admin stats query

```sql
-- Full platform stats in one query
SELECT
    (SELECT COUNT(*) FROM users)                              AS total_users,
    (SELECT COUNT(*) FROM users WHERE role = 'LISTENER')     AS total_listeners,
    (SELECT COUNT(*) FROM users WHERE role = 'ARTIST')       AS total_artists,
    (SELECT COUNT(*) FROM users WHERE role = 'ADMIN')        AS total_admins,
    (SELECT COUNT(*) FROM users WHERE premium = 1)           AS premium_users,
    (SELECT COUNT(*) FROM songs)                             AS total_songs,
    (SELECT COUNT(*) FROM songs WHERE status = 'PENDING')    AS pending_songs,
    (SELECT COUNT(*) FROM songs WHERE status = 'APPROVED')   AS approved_songs,
    (SELECT COUNT(*) FROM songs WHERE status = 'REJECTED')   AS rejected_songs,
    (SELECT COUNT(*) FROM albums)                            AS total_albums,
    (SELECT COUNT(*) FROM playlists)                         AS total_playlists,
    (SELECT COALESCE(SUM(play_count), 0) FROM songs)         AS total_plays;
```

---

## Backend — Spring Boot

### Backend Setup & Configuration

**`application.yml`**

```yaml
spring:
  application:
    name: nextune-backend

  datasource:
    url: jdbc:mysql://localhost:3306/nextune_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: nextune_user
    password: nextune@123
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    open-in-view: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
        format_sql: true

  servlet:
    multipart:
      enabled: true
      max-file-size: 50MB
      max-request-size: 50MB

server:
  port: 8082

jwt:
  secret: nextune_super_secret_jwt_key_2024_make_this_long_and_secure
  expiration: 86400000

file:
  upload-dir: ./uploads
```

**Run the backend:**

```bash
cd backend
./mvnw spring-boot:run
```

---

### Security — JWT

Every protected request must include:

```bash
Authorization: Bearer <token>
```

The token is issued on register/login and expires in 24 hours (`86400000` ms). Roles encoded in the token: `LISTENER`, `ARTIST`, `ADMIN`.

**Public endpoints (no token needed):**

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/songs/public/**`
- `GET /api/genres`
- `GET /uploads/**`

---

### API Endpoints Reference

#### Auth — `/api/auth`

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| POST | `/register` | No | `{username, email, password}` | Register new user, returns token |
| POST | `/login` | No | `{email, password}` | Login, returns token |
| GET | `/test` | No | — | Health check |

#### Users — `/api/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/me` | Yes | Get current user's profile |
| PUT | `/me` | Yes | Update profile (multipart: username, bio, profileImage) |
| PUT | `/me/premium` | Yes | Upgrade to Premium |
| PUT | `/me/premium/cancel` | Yes | Cancel Premium |

#### Songs — `/api/songs`

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/upload` | Yes | ARTIST/ADMIN | Upload song (multipart: title, audioFile, coverImage, albumId, genreId, premium) |
| GET | `/public/top` | No | — | Top songs by play count |
| GET | `/public/latest` | No | — | Latest approved songs |
| GET | `/public/search?query=` | No | — | Search songs/artists |
| GET | `/{id}` | Yes | — | Get song by ID |
| GET | `/artist/{artistId}` | Yes | — | Songs by artist |
| POST | `/{id}/play` | No | — | Increment play count |
| GET | `/{id}/download` | Yes | — | Download audio file (Premium gate for premium songs) |
| PUT | `/{id}/approve` | Yes | ADMIN | Approve song |
| PUT | `/{id}/reject` | Yes | ADMIN | Reject song |
| DELETE | `/{id}` | Yes | ARTIST/ADMIN | Delete song |

#### Artists — `/api/artists`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | Yes | Create artist profile (multipart: artistName, bio, profileImage, coverImage) |
| GET | `/me` | Yes | Get logged-in user's artist profile |
| GET | `/{id}` | No | Get artist by ID |
| GET | `/` | No | Get all artists |
| PUT | `/{id}` | Yes | Update artist profile (multipart) |

#### Albums — `/api/albums`

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/` | Yes | ARTIST/ADMIN | Create album (multipart: title, description, albumType, releaseDate, coverImage) |
| GET | `/{id}` | Yes | — | Get album with songs |
| GET | `/` | Yes | — | All albums |
| GET | `/artist/{artistId}` | Yes | — | Albums by artist |

#### Playlists — `/api/playlists`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | Yes | Create playlist (multipart: name, description, isPublic, coverImage) |
| GET | `/my` | Yes | Get logged-in user's playlists |
| GET | `/public` | Yes | Get all public playlists |
| GET | `/{id}` | Yes | Get playlist by ID (with songs) |
| PUT | `/{id}` | Yes | Update playlist |
| DELETE | `/{id}` | Yes | Delete playlist (owner only) |
| POST | `/{id}/songs/{songId}` | Yes | Add song to playlist |
| DELETE | `/{id}/songs/{songId}` | Yes | Remove song from playlist |

#### Likes — `/api/likes`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/{songId}` | Yes | Like a song |
| DELETE | `/{songId}` | Yes | Unlike a song |
| GET | `/` | Yes | Get all liked songs |
| GET | `/{songId}/status` | Yes | Check if song is liked |

#### Follows — `/api/follows`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/{artistId}` | Yes | Follow an artist |
| DELETE | `/{artistId}` | Yes | Unfollow an artist |
| GET | `/` | Yes | Get followed artists |
| GET | `/{artistId}/status` | Yes | Check follow status |

#### History — `/api/history`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/{songId}` | Yes | Record a song play |
| GET | `/?limit=50` | Yes | Get listening history |
| DELETE | `/` | Yes | Clear history |

#### Genres — `/api/genres`

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/` | No | — | All genres |
| GET | `/{id}` | No | — | Get genre by ID |
| POST | `/` | Yes | ADMIN | Create genre (multipart: name, description, image) |
| PUT | `/{id}` | Yes | ADMIN | Update genre |
| DELETE | `/{id}` | Yes | ADMIN | Delete genre |

#### Admin — `/api/admin`

All endpoints require `ADMIN` role.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/users` | Get all users |
| GET | `/users/{id}` | Get user by ID |
| PUT | `/users/{id}/status?active=` | Activate/deactivate user |
| PUT | `/users/{id}/role?role=` | Change user role |
| GET | `/songs/pending` | Get pending songs |
| GET | `/stats` | Platform statistics |

---

## Frontend — React

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open: `http://localhost:5173`

**Environment variables — `.env`:**

```
VITE_API_BASE_URL=http://localhost:8082/api
VITE_FILE_BASE_URL=http://localhost:8082
```

**Key dependencies:**

```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "axios": "^1.x",
  "zustand": "^4.x",
  "react-hot-toast": "^2.x",
  "react-icons": "^5.x",
  "@tailwindcss/vite": "^4.x"
}
```

---

### Frontend Folder Structure

```
src/
├── api/           → Axios API calls per domain (authApi, songsApi, etc.)
├── assets/        → Static images, icons
├── components/
│   ├── admin/     → Admin-only UI blocks (stats, users table, pending songs)
│   ├── artist/    → Become artist form, upload/album modals
│   ├── common/    → Reusable Input, Button, ProtectedRoute
│   ├── layout/    → Sidebar + Layout shell
│   ├── player/    → Audio player, song card, like/download buttons
│   └── playlist/  → Create playlist modal
├── hooks/         → useDebounce
├── pages/         → Full page components (one per route)
├── store/         → Zustand global state (auth + player)
└── utils/         → Constants, file URL helpers
```

---

### State Management

#### `authStore.js` (Zustand + persist)

Persists to `localStorage` under key `nextune-auth`.

```js
{
  token: null,          // JWT string
  user: {
    email, username,
    role,               // LISTENER | ARTIST | ADMIN
    premium             // boolean
  },
  login(data),          // set token + user
  logout(),             // clear token + user
  isAuthenticated(),    // returns !!token
  hasRole(role)         // returns user.role === role
}
```

#### `playerStore.js` (Zustand)

```js
{
  currentSong: null,    // song object currently playing
  queue: [],            // array of songs (the row/playlist being played)
  isPlaying: false,
  volume: 1,
  repeat: false,
  shuffle: false,
  playSong(song, queue),
  togglePlay(),
  setVolume(v),
  toggleRepeat(),
  toggleShuffle(),
  playNext(),
  playPrevious()
}
```

---

### Pages & Components

#### Routes

| Path | Component | Auth | Role |
|---|---|---|---|
| `/` | `Home` | No | — |
| `/login` | `Login` | No | — |
| `/register` | `Register` | No | — |
| `/forgot-password` | `ForgotPassword` | No | — |
| `/search` | `Search` | No | — |
| `/library` | `Library` | Yes | — |
| `/playlist/:id` | `PlaylistDetail` | Yes | — |
| `/liked-songs` | `LikedSongs` | Yes | — |
| `/profile` | `Profile` | Yes | — |
| `/artist/dashboard` | `ArtistDashboard` | Yes | — |
| `/admin` | `AdminDashboard` | Yes | ADMIN |

#### Key Components

**`Player.jsx`** — Global bottom audio player
- Single hidden `<audio>` element
- Controls: play/pause, next, previous, shuffle, repeat
- Progress bar seek, volume slider
- Auto-records play count + listening history on song change

**`SongCard.jsx`** — Horizontal grid card (used on Home page)
- Shows cover image, title, artist
- Green play button appears on hover
- Click-drag to scroll (no scrollbar shown)

**`SongListItem.jsx`** — Table row (used in Search, Playlists, History)
- Row number, cover, title/artist, album, like button, add-to-playlist menu, download button, duration
- Highlights green when currently playing

**`ProtectedRoute.jsx`** — Route guard
- Redirects unauthenticated users to `/login`
- Optionally checks `allowedRoles` array

**`LikeButton.jsx`** — Heart toggle button
- Checks like status on mount
- Optimistic UI update on click

**`AddToPlaylistMenu.jsx`** — Dropdown
- Fetches user's playlists on open
- Adds song to selected playlist

**`DownloadButton.jsx`** — Download song
- Fetches as blob, triggers browser download
- Shows toast if song is premium and user is not

---

## Features

### Listener features
- Register and log in
- Stream songs (play/pause/seek/volume/shuffle/repeat)
- Browse home page (latest releases, top tracks)
- Search songs and artists
- Create, edit, delete playlists
- Add/remove songs from playlists
- Like and unlike songs
- Follow and unfollow artists
- View listening history, clear history
- Edit profile (username, bio, avatar)
- Upgrade to Premium (enables downloads)
- Download songs (Premium required for premium-marked songs)

### Artist features
- Become an artist (any listener can apply)
- Upload songs (mp3/wav) with cover image — goes to admin approval queue
- Create albums (ALBUM / EP / SINGLE)
- Edit artist profile (bio, profile image, cover image)
- View analytics (total songs, plays, likes, followers)
- Delete songs

### Admin features
- View platform statistics (users, songs, plays, etc.)
- Manage users (change role, activate/deactivate)
- Approve or reject pending song uploads (with audio preview)
- Create, view, and delete genres

---

## Running the Project

### Prerequisites

- Java 21+
- Node.js 18+
- MySQL 8.x running locally

### Start MySQL

Make sure MySQL is running and the database is created:

```sql
CREATE DATABASE nextune_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'nextune_user'@'localhost' IDENTIFIED BY 'nextune@123';
GRANT ALL PRIVILEGES ON nextune_db.* TO 'nextune_user'@'localhost';
FLUSH PRIVILEGES;
```

### Start Backend

```bash
cd NexTune/backend
./mvnw spring-boot:run
```

Backend runs on: `http://localhost:8082`

### Start Frontend

```bash
cd NexTune/frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## Default Users & Test Flow

### Create an admin account

1. Register normally at `/register`
2. Promote via MySQL:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```

3. Log out and log back in to get a refreshed token with the `ADMIN` role.

### Full test flow

```bash
1. Register a new account (/register)
2. Log in (/login)
3. Browse home — see latest releases and top tracks
4. Search for songs (/search)
5. Like a song (heart icon)
6. Create a playlist (/library → Create playlist)
7. Add songs to the playlist (+ icon on any song row)
8. Go to /artist/dashboard → click "Become an Artist"
9. Upload a song (mp3 file required)
10. Log in as ADMIN → go to /admin → Pending songs tab
11. Approve the uploaded song
12. Song now appears on Home and in search results
13. Go to /profile → Upgrade to Premium
14. Download any song (download icon in song rows)
```

---

## Notes

- **File uploads** are stored in `backend/uploads/` (subfolders: `songs/audio`, `songs/covers`, `artists/profile`, `artists/cover`, `albums/covers`, `playlists/covers`, `genres`, `users/profile`)
- **JWT expiry** is 24 hours; after expiry the app auto-logs out (401 interceptor in `axios.js`)
- **Song status flow:** `PENDING` → (admin) → `APPROVED` or `REJECTED`; only `APPROVED` songs appear on the home page and search
- **Premium gate:** songs marked `premium = true` can only be downloaded by users with `premium = true`; streaming is always free
- **Lombok `@Builder.Default`** must be used on all entity fields with default values (`playCount`, `likeCount`, `active`, `followers`, etc.) — without it, Lombok's builder skips field initializers and the field stays `null`
