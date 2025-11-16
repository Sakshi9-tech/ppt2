# EtherXPPT - PowerPoint Replica

A complete PowerPoint-like presentation application built with React and Node.js.

## Features

- 🎨 **Modern UI** - Dark theme with custom colors (#1B1A17 background, #F0A500 accents)
- 🔐 **Authentication** - Login, signup, and OTP-based password reset
- 📧 **Email Integration** - Gmail SMTP for OTP delivery
- 🎯 **Slide Management** - Create, edit, and organize presentation slides
- 🖼️ **Rich Editor** - Text formatting, drawing tools, and layout options
- 📊 **Charts & Graphics** - Multiple chart types and drawing capabilities
- 🎭 **Slideshow Mode** - Full-screen presentation view
- 💾 **Auto-save** - Automatic saving of presentations
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios for API calls
- Tailwind CSS for styling
- Vite for build tooling

### Backend
- Node.js with Express
- JWT authentication
- Nodemailer for email services
- bcryptjs for password hashing
- Rate limiting and security middleware

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Gmail account for SMTP (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Gella-Uday-kumar/Ether-x-ppt.git
cd Ether-x-ppt
```

2. Install dependencies:
```bash
npm run install-all
```

3. Configure environment variables:
```bash
# In server/.env
PORT=3000
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password
```

4. Start the application:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Project Structure

```
etherxppt-organized/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── styles/         # CSS and theme files
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
├── server/                 # Node.js backend
│   ├── production-server.js # Main server file
│   ├── .env               # Environment variables
│   └── test-otp.js        # OTP testing utility
└── docs/                  # Documentation
```

## Features Overview

### Authentication System
- User registration and login
- JWT-based session management
- OTP-based password reset via email
- Rate limiting for security

### Presentation Editor
- Slide creation and management
- Text formatting and styling
- Drawing tools and shapes
- Chart integration
- Layout templates
- Auto-save functionality

### Email Integration
- Professional HTML email templates
- OTP delivery for password reset
- Gmail SMTP integration
- Security notifications

## Development

### Available Scripts

```bash
# Start development servers
npm run dev

# Start only client
npm run client

# Start only server
npm run server

# Build for production
npm run build

# Install all dependencies
npm run install-all
```

### Testing OTP Functionality

```bash
cd server
node test-otp.js
```

## Deployment

1. Build the client:
```bash
cd client
npm run build
```

2. Configure production environment variables

3. Start the production server:
```bash
cd server
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue on GitHub.

---

Built with ❤️ by Gella Uday Kumar