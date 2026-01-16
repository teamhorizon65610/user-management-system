#  User Management System

> A modern, full-stack expense tracking application with beautiful UI and robust backend

[![CI Pipeline](https://github.com/yourusername/smart-expenseTracker-devops-assignment/workflows/CI%20Pipeline/badge.svg)](https://github.com/yourusername/smart-expenseTracker-devops-assignment/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)

## Features

- ✅ **User Authentication** - Secure registration and login
- ✅ **Expense Management** - Full CRUD operations
- ✅ **Real-time Statistics** - Track spending patterns
- ✅ **Category Tracking** - Organize expenses by category
- ✅ **Search & Filter** - Find expenses quickly
- ✅ **Responsive Design** - Works on all devices
- ✅ **Modern UI** - Beautiful, animated interface
- ✅ **CSV Database** - Zero setup required

## Quick Start

### 1. Install Dependencies
```bash
cd src/backend
pip install -r requirements.txt
```

### 2. Start Backend
```bash
python app.py
```

### 3. Start Frontend (New Terminal)
```bash
cd src/frontend
python -m http.server 8000
```

### 4. Open Browser
Navigate to `http://localhost:8000`

**Demo Account:**
- Email: `demo@expense.com`
- Password: `demo123`

## 📸 Screenshots

### Landing Page
Modern hero section with feature showcase

### Dashboard
Track expenses with real-time statistics

### Expense Management
Add, edit, and delete expenses with ease

##  Tech Stack

| Component | Technology |
|-----------|-----------|
| **Backend** | Python Flask 2.3.3 |
| **Frontend** | HTML5, CSS3, JavaScript ES6+ |
| **Database** | CSV File Storage |
| **Security** | Werkzeug Password Hashing |
| **CI/CD** | GitHub Actions |
| **Design** | Custom CSS with Animations |

## 📁 Project Structure

```
smart-expenseTracker-devops-assignment/
├── src/
│   ├── backend/          # Flask API
│   ├── frontend/         # Web interface
│   └── database/         # CSV storage
├── .github/workflows/    # CI/CD pipelines
└── docs/                 # Documentation
```

##  Documentation

- **[Setup Guide](SETUP_GUIDE.md)** - Detailed installation and configuration
- **[API Documentation](SETUP_GUIDE.md#api-documentation)** - Complete API reference
- **[Quick Start](QUICK_START.md)** - Get running in 5 minutes
- **[Project Summary](PROJECT_SUMMARY.md)** - Architecture and features

##  API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/users/register` | Register new user |
| POST | `/api/users/login` | User login |
| GET | `/api/expenses` | Get all expenses |
| POST | `/api/expenses` | Create expense |
| PUT | `/api/expenses/<id>` | Update expense |
| DELETE | `/api/expenses/<id>` | Delete expense |
| GET | `/api/expenses/stats/<user_id>` | Get statistics |

##  Deployment

### GitHub Actions CI/CD
Automated workflows for:
- ✅ Linting (flake8)
- ✅ Building
- ✅ Testing
- ✅ Deployment

### Deployment Options
- **PythonAnywhere** - Free hosting
- **Heroku** - Easy deployment
- **AWS/Azure** - Production scale

See [SETUP_GUIDE.md](SETUP_GUIDE.md#deployment) for details.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Branch Strategy
- `main` - Production
- `develop` - Integration
- `feature/*` - Features

## 👥 Team

- **Student 1** - [student1@email.com](mailto:student1@email.com)
- **Student 2** - [student2@email.com](mailto:student2@email.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Flask framework for the robust backend
- Google Fonts for beautiful typography
- GitHub Actions for CI/CD automation

## 📞 Support

For support, email support@example.com or open an issue on GitHub.

---

**⭐ Star this repository if you find it helpful!**

Built with ❤️ by Team Horizon
