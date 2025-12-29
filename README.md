# Company Blacklist System 🛡️

A comprehensive full-stack application for managing company blacklists with user approval workflow, built with NestJS and React.

## 🌟 Features

### User Management
- **Registration & Approval Workflow**: New users register and wait for admin approval
- **Three-Tier Status System**:
  - `PENDING`: New users waiting for approval
  - `APPROVED`: Users with full access to the system
  - `REJECTED`: Permanently blocked users (cannot re-register with same Tax ID)

### Blacklist Management
- **Search Functionality**: Search companies by name or Tax ID
- **Add Companies**: Add companies with detailed debt information
- **Debt Tracking**:
  - Debt amount and date
  - Reason for blacklisting
  - Status tracking (active/resolved)
  - Reporter tracking (who added the entry)

### Admin Panel
- View all pending user registrations
- Approve or reject users
- Permanent Tax ID blocking for rejected users

## 🛠 Technology Stack

### Backend
- **Framework**: NestJS
- **Database**: SQLite with TypeORM
- **Authentication**: JWT with Passport
- **Security**: bcrypt password hashing, role-based access control

### Frontend
- **Framework**: React 18
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Styling**: Custom CSS with modern design system

## 📁 Project Structure

```
companyblacklistV3/
├── backend/
│   ├── src/
│   │   ├── admin/          # Admin functionality
│   │   ├── auth/           # Authentication & guards
│   │   ├── blacklist/      # Blacklist management
│   │   ├── entities/       # Database entities
│   │   ├── users/          # User management
│   │   ├── app.module.ts   # Main app module
│   │   ├── main.ts         # Application entry point
│   │   └── seed.ts         # Database seeding
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/            # API integration layer
    │   ├── components/     # Reusable components
    │   ├── context/        # React context (Auth)
    │   ├── pages/          # Page components
    │   │   ├── Admin/      # Admin panel
    │   │   ├── Auth/       # Login & Register
    │   │   └── Dashboard/  # Main dashboard & waiting page
    │   ├── App.js          # Main app component
    │   └── index.js        # React entry point
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

1. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server** (Terminal 1)
   ```bash
   cd backend
   npm run start:dev
   ```
   
   The backend will run on `http://localhost:3001`
   
   ✅ **Admin account is automatically created**:
   - Tax ID: `000000000`
   - Password: `admin123`

2. **Start the Frontend** (Terminal 2)
   ```bash
   cd frontend
   npm start
   ```
   
   The frontend will run on `http://localhost:3000`

## 👤 Default Admin Account

On first startup, a default admin account is created:

- **Tax ID**: `000000000`
- **Company Name**: System Administrator
- **Password**: `admin123`

⚠️ **Important**: Change this password in production!

## 📖 User Workflow

### For Regular Users:
1. **Register** → Enter Tax ID, Company Name, and Password
2. **Wait for Approval** → See waiting page with verification message
3. **Get Approved** → Admin approves your account
4. **Access Dashboard** → Search and add companies to blacklist

### For Admins:
1. **Login** with admin credentials
2. **View Pending Users** → Click "Admin Panel" button in navbar
3. **Approve/Reject Users** → Use ✅ or ❌ buttons
4. **Manage Blacklist** → Access same features as regular users

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Status Guards**: Only approved users can access protected routes
- **Role Guards**: Admin-only endpoints protected
- **Permanent Blocking**: Rejected Tax IDs cannot re-register
- **CORS Protection**: Configured for frontend-backend communication

## 🎨 Design Features

- **Modern UI**: Gradient backgrounds and smooth animations
- **Responsive Design**: Works on desktop and mobile
- **Card-Based Layout**: Clean and organized information display
- **Status Badges**: Visual indicators for debt status
- **Loading States**: Smooth loading animations
- **Error Handling**: User-friendly error messages in Georgian

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Admin (Admin Only)
- `GET /api/admin/pending` - Get pending users
- `POST /api/admin/approve/:id` - Approve user
- `POST /api/admin/reject/:id` - Reject user

### Blacklist (Approved Users Only)
- `GET /api/blacklist` - Get all companies
- `GET /api/blacklist/search?q=query`  - Search companies
- `POST /api/blacklist/add` - Add company to blacklist

## 🧪 Testing

Test the complete workflow:

1. **Register a new user** → Should see waiting page
2. **Login as admin** (`000000000` / `admin123`)
3. **Approve the user** from admin panel
4. **Login as the new user** → Should see dashboard
5. **Add a company** to blacklist
6. **Search for the company** → Should appear in results

## 📝 License

This project is for educational and business purposes.

## 🤝 Support

For issues or questions, please contact the development team.

---

**Built with ❤️ in Georgia** 🇬🇪
