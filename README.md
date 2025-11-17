# 🧩 MeowCollab – Real-Time Collaborative Code Editor

## 🚀 Overview

MeowCollab is a full-stack web platform that enables developers, students, and teams to write, run, and collaborate on code in real time — directly from their browsers.

It combines a powerful live code editor, secure backend execution, and real-time collaboration, making it perfect for coding sessions, interviews, and learning environments.

## ⚙️ Core Features

### 🧠 1. Real-Time Collaborative Editor

- Multiple users can edit the same file simultaneously
- Live syntax highlighting with CodeMirror editor
- Powered by Socket.IO for smooth, low-latency updates
- Each user's changes are instantly visible to others
- See who's currently online in the room

### 💻 2. Code Execution (Multi-Language Support)

- Supports **16 programming languages**: Python3, Java, C++, C, Node.js, Ruby, Go, Scala, Bash, SQL, Pascal, C#, PHP, Swift, Rust, and R
- Code is executed securely on the backend using JDoodle API
- Displays real-time output and error logs
- Built-in compiler panel for testing code

### 👥 3. Room-Based Collaboration

- Create or join collaborative rooms using unique shareable room IDs
- No authentication required - quick and easy collaboration
- Share room IDs with team members to start coding together instantly

### 🎨 4. Modern Developer Interface

- Clean, responsive UI with a dark theme
- Built using React with Bootstrap for styling
- CodeMirror editor with Dracula theme for syntax highlighting
- Real-time member list showing active collaborators
- Easy room ID copying and sharing

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Bootstrap CSS, CodeMirror Editor |
| Backend | Node.js (Express) |
| Realtime Collaboration | Socket.IO |
| Code Execution | JDoodle API |
| Build Tool | React Scripts (Create React App) |
| Routing | React Router DOM |

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- JDoodle API credentials (for code execution)

## 🚀 Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd meowcollab
   ```

2. Install dependencies for both client and server:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables:

   **Server** (`server/.env`):
   ```env
   PORT=5001
   jDoodle_clientId=your_jdoodle_client_id
   kDoodle_clientSecret=your_jdoodle_client_secret
   ```

   **Client** (`client/.env`):
   ```env
   REACT_APP_BACKEND_URL=http://localhost:5001
   ```

4. Start the development servers:
   ```bash
   # Start the backend server (from server directory)
   npm start

   # Start the frontend (from client directory, in a new terminal)
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## 🎯 Usage

1. **Create a Room**: Click "New Room" to generate a unique room ID
2. **Join a Room**: Enter a room ID and your username, then click "JOIN"
3. **Start Coding**: Write code in the collaborative editor
4. **Select Language**: Choose from 16 supported programming languages
5. **Run Code**: Click "Open Compiler" to test and execute your code
6. **Share**: Copy the room ID and share it with collaborators

## 📝 Supported Languages

- Python3
- Java
- C++
- C
- Node.js (JavaScript)
- Ruby
- Go
- Scala
- Bash
- SQL
- Pascal
- C#
- PHP
- Swift
- Rust
- R

## 🔧 Configuration

### JDoodle API Setup

To enable code execution, you need to set up JDoodle API credentials:

1. **Sign up for JDoodle**:
   - Go to https://www.jdoodle.com/
   - Click "Sign Up" or "Login" if you already have an account
   - JDoodle offers a free tier with limited requests

2. **Get API Credentials**:
   - After logging in, go to your account dashboard
   - Navigate to "API" or "Credentials" section
   - Copy your **Client ID** and **Client Secret**

3. **Add to Environment File**:
   - Open `server/.env` file
   - Add the following lines:
     ```
     PORT=5001
     jDoodle_clientId=your_client_id_here
     kDoodle_clientSecret=your_client_secret_here
     ```
   - Replace `your_client_id_here` and `your_client_secret_here` with your actual credentials

4. **Restart the Server**:
   - Stop the server (Ctrl+C)
   - Start it again with `npm start`
   - The code execution should now work!

**Note**: The free tier of JDoodle has usage limits. For production use, consider upgrading to a paid plan.

## 📝 License

ISC
