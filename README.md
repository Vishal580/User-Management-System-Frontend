# Admin Panel Frontend

A modern React.js admin dashboard for user management with clean UI and responsive design.

## 🚀 Features

- **Admin Authentication** - Secure login with JWT tokens
- **User Management** - Complete CRUD operations with search and pagination
- **Admin Settings** - Profile and password management
- **Responsive Design** - Mobile-friendly interface
- **Modern UI** - Clean design with Font Awesome icons and Bootstrap
- **Real-time Validation** - Form validation with error handling

## 🛠️ Tech Stack

- **React.js** - Frontend framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Bootstrap** - CSS framework
- **Font Awesome** - Icon library
- **CSS3** - Custom styling

## 🔧 Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:
   ```
   REACT_APP_API_URL=http://localhost:3000/api
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 🎨 Pages & Components

### **Authentication**
- Login page with form validation

### **Layout**
- Responsive sidebar navigation
- Header with admin dropdown
- Mobile-friendly design

### **Users Management**
- User list with search and pagination
- Add/Edit user modal forms
- Delete confirmation dialogs
- Status management (Active/Inactive)

### **Settings**
- Admin profile management
- Password change functionality
- Tabbed interface

## 🔐 Default Login

- **Email:** admin@admin.com
- **Password:** Please contact me for the password

## 🌐 Deployment

Deployed on **Vercel** with automatic deployments from Git repository.

## 📁 Project Structure

```
src/
├── components/
│   ├── Auth/         # Login components
│   ├── Layout/       # Sidebar, Header, Layout
│   ├── Users/        # User management
│   ├── Settings/     # Admin settings
│   └── Common/       # Reusable components
├── services/         # API service layer
├── utils/           # Helper functions
├── App.js           # Main app component
└── index.js         # Entry point
```

## 🎯 Key Features

- **JWT Token Management** - Automatic token refresh and logout
- **Form Validation** - Client-side validation with real-time feedback
- **Error Handling** - User-friendly error messages
- **Loading States** - Smooth loading indicators
- **Responsive Tables** - Mobile-optimized data display
- **Modal System** - Clean popup forms for CRUD operations