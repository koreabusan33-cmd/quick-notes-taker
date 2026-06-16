# quick-note-taker
## Group Information

Group Number: 10

Members:
- Hussain Jawad (2025891229) — Main Process (main.js) & IPC Communication
- Jorj Bappa Rahman (2024891072) — Renderer (UI, sidebar, note editor)
- Maleesha Werawala (2025791095) — Feature Development (search, categories, pin, dark mode)
- Pramasha Dahal (2025690051) — Testing, Debugging & App Packaging (.exe, README)
- Emon Al Shahriar (2024991067) - handles everything and review the final project.
- Quick Note Taker
5.1 Group Information

Member Name: Hussain Jawad
Student ID: 2025891229
Role: Main Process Development (main.js) and IPC Communication
Member Name: Jorj Bappa Rahman
Student ID: 2024891072
Role: Renderer Development (UI, Sidebar, Note Editor)
Member Name: Maleesha Werawala
Student ID: 2025791095
Role: Feature Development (Search, Categories, Pin Notes, Dark Mode)
Member Name: Pramasha Dahal
Student ID: 2025690051
Role: Testing, Debugging, App Packaging (.exe), and README Documentation
5.2 App Description
Quick Note Taker is a desktop note-taking application built using Electron, HTML, CSS, and JavaScript. The application allows users to create, edit, save, organize, search, and manage notes through an intuitive interface. Users can switch between light and dark themes, pin important notes, categorize notes, adjust font sizes, and save their work locally. The application is designed to provide a simple and efficient note-management experience.
5.3 New Features Added
Feature Name: Note Management Enhancements
Built By: Maleesha Werawala
Description:
Implemented several user-focused features to improve note organization and usability, including Search Notes, Categories, Pin Notes, and Dark Mode. These features help users organize, locate, and manage notes more efficiently.
Files Modified:
renderer.js
index.html
Feature Name: Main Process and IPC Communication
Built By: Hussain Jawad
Description:
Implemented the Electron main process and Inter-Process Communication (IPC) system, enabling secure communication between the renderer process and backend functionality such as file operations.
Files Modified:
main.js
preload.js
Feature Name: User Interface and Note Editor
Built By: Jorj Bappa Rahman
Description:
Designed and implemented the application's user interface, including the sidebar, note list, note editor, toolbar, and overall user interaction workflow.
Files Modified:
index.html
renderer.js
Feature Name: Testing, Debugging, and Application Packaging
Built By: Pramasha Dahal
Description:
Performed testing and debugging to ensure application stability and functionality. Created packaged application builds and prepared project documentation, including the README file.
Files Modified:
README.md
Packaging Configuration Files
Project Testing Documentation
5.4 How to Run the App
Step 1: Install Node.js
Download and install Node.js from:
https://nodejs.org
Step 2: Open a Terminal
Open a terminal or command prompt and navigate to the project folder.
Step 3: Install Dependencies
npm install
Step 4: Start the Application
npm start
The Electron application should launch automatically.
5.5 How to Install the App
Windows Installation
Open the dist folder.
Locate the generated .exe installer.
Run the installer.
Follow the installation wizard.
Launch the application from the Start Menu or Desktop shortcut.
macOS Installation
Open the generated .dmg file from the dist folder.
Drag the application icon into the Applications folder.
Open the application from the Applications folder.
Technologies Used
Electron
HTML5
CSS3
JavaScript
Node.js
