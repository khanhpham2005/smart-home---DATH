# 🚀 Complete Smart Home System Setup Guide

Complete instructions to run both Backend and Frontend locally.

---

## 📦 Project Repositories

- 🔗 Frontend (this repo): https://github.com/khanhpham2005/smart-home---DATH.git
- 🔗 Backend: https://github.com/nhtc2005/smart-home-system.git

## ✅ Prerequisites

### **Backend Requirements:**
- **Java 21** (JDK) 
- **Maven 3.8+** 
- **PostgreSQL 12+** 
- **Git** 

### **Frontend Requirements:**
- **Node.js 16+** 
- **npm 8+** (comes with Node.js)

### **External Services (Optional):**
- **Adafruit IO Account** - For IoT device integration 
- **MQTT Broker** - For device communication (can use Adafruit IO)

---

## 🏗️ Part 1: Backend Setup

### **Step 1: Configure Database**

1. **Install PostgreSQL** and start the service
2. **Create database:**
   ```sql
   createdb smart-home-system
   ```
   Or via pgAdmin:
   - Open pgAdmin
   - Right-click "Databases" → Create → Database
   - Name: `smart-home-system`
   - Click Save

3. **Verify connection:**
   ```bash
   psql -U postgres -d smart-home-system
   ```

### **Step 2: Create Backend Configuration**

1. Navigate to backend folder:
   ```bash
   cd d:\DATH\BE
   ```

2. Create `application.yml` from template:
   ```bash
   # Windows PowerShell
   Copy-Item src\main\resources\application.yml.example -Destination src\main\resources\application.yml
   
   # Or Windows CMD
   copy src\main\resources\application.yml.example src\main\resources\application.yml
   ```

3. **Edit `src/main/resources/application.yml`:**
   ```yaml
   server:
     port: 8080
     servlet:
       context-path: /api

   spring:
     application:
       name: smart-home-system
     profiles:
       active: dev
     datasource:
       url: jdbc:postgresql://localhost:5432/smart-home-system
       username: postgres
       password: your_postgres_password
     jpa:
       hibernate:
         ddl-auto: validate

   jwt:
     secret: your-secret-key-change-this-in-production
     expiration: 3600000

   mqtt:
     broker: tcp://io.adafruit.com:1883
     client: spring-backend-client-dev
     username: your_adafruit_username
     key: your_adafruit_api_key
     topics: your_adafruit_username/feeds/+
   ```

   **Important fields to update:**
   - `spring.datasource.password` - Your PostgreSQL password
   - `jwt.secret` - Change to a secure random string
   - `mqtt.username` - Your Adafruit IO username (optional)
   - `mqtt.key` - Your Adafruit API key (optional)

### **Step 3: Build Backend**

```bash
cd d:\DATH\BE

# Clean and build
mvn clean install

# If you want to skip tests (faster):
mvn clean install -DskipTests
```

**Expected output:** `BUILD SUCCESS`

### **Step 4: Run Backend**

```bash
cd d:\DATH\BE

# Option 1: Run with Maven
mvn spring-boot:run

# Option 2: Run the JAR file (after building)
java -jar target/smart-home-system-0.0.1.jar
```

**Expected output:**
```
Started SmartHomeSystemApplication in X seconds
```

Backend is now running on: `http://localhost:8080`
API documentation available at: `http://localhost:8080/swagger-ui.html`

---

## ⚛️ Part 2: Frontend Setup

### **Step 1: Install Dependencies**

```bash
cd d:\DATH\FE

npm install
```

This will install all dependencies listed in `package.json`.

### **Step 2: Configure Environment**

1. **Copy environment template:**
   ```bash
   # Windows PowerShell
   Copy-Item .env.example -Destination .env.local
   
   # Or Windows CMD
   copy .env.example .env.local
   ```

2. **Edit `.env.local`:**
   ```env
   REACT_APP_API_URL=http://localhost:8080/api
   REACT_APP_DEMO_MODE=false
   REACT_APP_ADAFRUIT_URL=https://io.adafruit.com/api/v2
   REACT_APP_ADAFRUIT_USERNAME=your_adafruit_username
   REACT_APP_ADAFRUIT_KEY=your_adafruit_api_key
   ```

   **Key settings:**
   - `REACT_APP_API_URL` - Point to backend (port 8080)
   - `REACT_APP_DEMO_MODE` - Set to `false` to use real backend
   - Adafruit settings are optional

### **Step 3: Start Frontend Development Server**

```bash
cd d:\DATH\FE

npm start
```

**Expected output:**
```
On Your Network: http://192.168.x.x:3000
Compiled successfully!
```

Frontend will automatically open in your browser at: `http://localhost:3000`

---

## 🚀 Part 3: Run Everything Together

### **Quick Start (Using Multiple Terminals)**

**Terminal 1 - Backend:**
```bash
cd d:\DATH\BE
mvn spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd d:\DATH\FE
npm start
```

Or use **Terminal Split** in VS Code:
1. Open VS Code
2. Press `Ctrl+J` to open terminal
3. Click the split terminal icon
4. Run backend in one, frontend in the other

### **Using Docker (Optional)**

If you have Docker installed, you can use the provided `docker-compose.yml` files:

```bash
# Build and run backend with Docker
cd d:\DATH\BE
docker build -t smart-home-backend .
docker run -p 8080:8080 smart-home-backend

# Build and run frontend with Docker
cd d:\DATH\FE
docker build -t smart-home-frontend .
docker run -p 3000:3000 smart-home-frontend
```

---

## ✅ Verification Checklist

After starting both services, verify everything works:

### **Backend Verification:**

1. **Check API is running:**
   ```bash
   curl http://localhost:8080/api/auth/me
   # Should return 401 (Unauthorized) - this is expected without a token
   ```

2. **Check Swagger UI:**
   - Open: `http://localhost:8080/swagger-ui.html`
   - Should show all API endpoints

3. **Check logs for errors:**
   - Look for "Started SmartHomeSystemApplication"
   - No database connection errors

### **Frontend Verification:**

1. **Page loads:**
   - Open: `http://localhost:3000`
   - Should see login page

2. **Check console for errors:**
   - Press `F12` → Console tab
   - Should not see CORS errors

3. **Test login:**
   - In backend, check what users exist in database
   - Try logging in (might fail if no users exist yet)

### **Full Integration Test:**

1. **Create test user (via backend or direct DB query):**
   ```sql
   -- Connect to PostgreSQL
   psql -U postgres -d smart-home-system
   
   -- Insert test user
   INSERT INTO "user" (email, first_name, last_name, password, role, created_at)
   VALUES ('test@example.com', 'Test', 'User', 'hashed_password', 'USER', NOW());
   ```

2. **Login with test user:**
   - Email: `test@example.com`
   - Password: (the one set in the backend)

3. **Navigate to Dashboard:**
   - Should see sensor data
   - Should see devices and actuators

4. **Test WebSocket (Optional):**
   - Open browser DevTools (F12)
   - Check Network → WS tab
   - Should see WebSocket connection to `ws://localhost:8080/api/ws`

---

## 🐛 Troubleshooting

### **Backend Issues:**

| Issue | Solution |
|-------|----------|
| **Port 8080 already in use** | Change port in `application.yml` or kill process using port 8080 |
| **Database connection failed** | Verify PostgreSQL is running, check credentials in `application.yml` |
| **Maven build fails** | Ensure Java 21 is installed: `java -version` |
| **MQTT connection error** | Optional - can ignore if not using Adafruit IO |

### **Frontend Issues:**

| Issue | Solution |
|-------|----------|
| **API connection error** | Verify backend is running on port 8080, check `.env.local` |
| **CORS error** | Backend CORS configuration issue - already configured |
| **npm install fails** | Try `npm cache clean --force` then `npm install` again |
| **Port 3000 already in use** | Run on different port: `PORT=3001 npm start` |

### **Database Issues:**

```bash
# Check if PostgreSQL is running
pg_isready -h localhost -p 5432

# Connect to database
psql -U postgres -d smart-home-system

# View tables
\dt

# Reset database (WARNING: deletes all data)
dropdb smart-home-system
createdb smart-home-system
# Then restart backend to recreate schema
```

---

## 📡 Architecture Overview

```
┌─────────────────────────────────────────┐
│  Browser (localhost:3000)               │
│  ├─ React Frontend (FE)                 │
│  └─ WebSocket Client (STOMP)            │
└────────────┬────────────────────────────┘
             │ HTTP/REST + WebSocket
             │
┌────────────▼────────────────────────────┐
│  Spring Boot Server (localhost:8080)    │
│  ├─ REST API Controllers                │
│  ├─ WebSocket STOMP Broker              │
│  └─ JWT Authentication                  │
└────────────┬────────────────────────────┘
             │ JDBC
┌────────────▼────────────────────────────┐
│  PostgreSQL Database (localhost:5432)   │
│  ├─ Users                               │
│  ├─ Devices                             │
│  ├─ Sensors & Actuators                 │
│  └─ Sensor Data History                 │
└─────────────────────────────────────────┘
```

---

## 🔐 Security Notes

- Change `jwt.secret` in production
- Use environment variables for sensitive data
- Enable HTTPS for production
- Use strong database password
- Keep PostgreSQL protected from public access

---

## 📚 Common Commands

```bash
# Frontend
npm start              # Start development server
npm run build         # Build for production
npm test              # Run tests
npm run eject         # Eject from create-react-app (irreversible)

# Backend
mvn clean             # Clean build artifacts
mvn build             # Build project
mvn clean install     # Clean + build + install
mvn spring-boot:run   # Run application
mvn test              # Run tests

# Database (PostgreSQL)
psql -U postgres                              # Connect to PostgreSQL
\l                                            # List databases
\d                                            # List tables
\q                                            # Quit
```

---

## 🎯 Next Steps

1. ✅ Start both Backend and Frontend
2. ✅ Create test user in database
3. ✅ Login to frontend
4. ✅ Test device control and sensor readings
5. ✅ Review API documentation at Swagger UI
6. ✅ Check WebSocket real-time updates

