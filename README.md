# Event Organizer App

This is a React Native app for organizing and managing events, featuring:
- Firebase Authentication (Sign Up/Sign In)
- Firestore Database for event storage
- Event management: Add, edit, delete events
- Mark events as favorites and view favorites list

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/EventOrganizerApp.git
   cd EventOrganizerApp
Install dependencies:

bash
Copy code
npm install
Start the app:

bash
Copy code
npm start
Firebase Setup
Create a Firebase project.
Enable Email/Password Authentication and Firestore Database.
Add your Firebase configuration to firebase.js.
Features
Authentication: Secure login/signup with Firebase.
Event Management: Users can add, edit, or delete events.
Favorites: Mark/unmark events as favorites.
Dependencies
React Navigation
Firebase SDK
React Native Vector Icons
markdown
Copy code

---

### **Final Notes**
1. **Navigation Adjustments**:
   - Ensure that `AddEditEventScreen` is added to the stack navigation in `MainStack.js`.
   - Use `route.params` to pass event details and `eventId` when navigating to `AddEditEventScreen`.

2. **Testing Favorites**:
   - Add logic to toggle `isFavorite` in Firestore.
   - Fetch and display only favorite events in `FavoriteEventsScreen`.

If you'd like, I can help you integrate and refine specific parts of this project!