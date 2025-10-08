# 📇 SmartContact - Intelligent Global Phonebook System

> Transform your contacts into an intelligent, relationship-aware network powered by AI

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.0-black.svg)](https://bun.sh/)

---

## 🌟 Overview

SmartContact is a next-generation contact management system that goes beyond traditional phonebooks. It understands relationships, learns from interactions, and lets you query your network using natural language.

**Ask questions like:**
- "Who's my dentist?"
- "Show me John's phone number"
- "Find all my colleagues at Google"
- "Which of my friends live in New York?"

---

## ✨ Key Features

### 🧠 **AI-Powered Intelligence**
- Natural language queries using Gemini
- Smart contact recommendations
- Automatic relationship discovery
- Duplicate contact detection

### 🕸️ **Relationship Mapping**
- Visual relationship graphs
- Multi-dimensional connections (family, work, social, services)
- Network traversal and discovery
- Mutual connection identification

### 🔒 **Privacy First**
- Granular privacy controls (Private, Trusted Circle, Public)
- End-to-end field-level permissions
- Audit logs for access tracking
- GDPR-compliant data handling

### 🔍 **Advanced Search**
- Full-text search with Elasticsearch
- Fuzzy matching for names and numbers
- Context-aware filtering
- Tag-based organization

### 🤝 **Social Features**
- Contact sharing with trusted users
- Service provider recommendations
- Group management
- Activity feeds

---

## 🏗️ Architecture

### **Tech Stack**

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Runtime** | Bun 1.0 | Ultra-fast JavaScript runtime |
| **Framework** | ExpressJS | High-performance web framework |
| **Language** | TypeScript 5.0 | Type-safe development |
| **Primary DB** | PostgreSQL 15 | Relational data storage |
| **Primary ORM** | Prisma ORM| Type-safe database access |
| **Validation** | Zod| Validation of inputs and Outputs |
| **Graph DB** | Neo4j 5.x | Relationship mapping |
| **Cache** | Redis 7.x | Session & query caching |
| **Search** | Elasticsearch 8.x | Full-text search engine |
| **Queue** | BullMQ | Background job processing |
| **Auth** | JWT(as per now) | Secure authentication |
| **AI** | Gemini 2.5 Flash/Pro | Natural language processing |
| **Vectors** | Pinecone | Semantic search embeddings | (Optional)

### **System Architecture**

```
┌─────────────────────────────────────────────────────┐
│                   Client Layer                       │
│  (React Web App / Mobile App / Browser Extension)   │
└──────────────────┬──────────────────────────────────┘
                   │ REST API / GraphQL
┌──────────────────▼──────────────────────────────────┐
│              API Gateway (ExpressJS)                   │
│  • Rate Limiting  • Auth Middleware  • Validation    │
└──────────────────┬──────────────────────────────────┘
                   │
    ┌──────────────┼──────────────┐
    │              │              │
┌───▼────┐   ┌────▼─────┐   ┌───▼────┐
│ User   │   │ Contact  │   │   AI   │
│Service │   │ Service  │   │Service │
└───┬────┘   └────┬─────┘   └───┬────┘
    │             │              │
┌───▼─────────────▼──────────────▼─────┐
│         Data Layer                    │
│  • PostgreSQL (Core Data)             │
│  • Neo4j (Relationships)              │
│  • Redis (Cache + Sessions)           │
│  • Elasticsearch (Search Index)       │
│  • Pinecone (Vector Embeddings)       │
└───────────────────────────────────────┘
```

---

## 🚀 Getting Started

### **Prerequisites**

- [Bun](https://bun.sh) >= 1.0.0
- [Docker](https://www.docker.com/) >= 24.0.0
- [PostgreSQL](https://www.postgresql.org/) >= 15.0
- [Node.js](https://nodejs.org/) >= 18.0 (for tooling)

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/smartcontact.git
cd smartcontact
```

2. **Install dependencies**
```bash
bun install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Application
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/smartcontact
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password

# Redis
REDIS_URL=redis://localhost:6379

# Elasticsearch
ELASTICSEARCH_NODE=http://localhost:9200

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# OpenAI
OPENAI_API_KEY=sk-your-api-key-here

# Pinecone
PINECONE_API_KEY=your-pinecone-key
PINECONE_ENVIRONMENT=us-west1-gcp
PINECONE_INDEX=smartcontact
```

4. **Start infrastructure with Docker**
```bash
docker-compose up -d
```

5. **Run database migrations**
```bash
bun run migrate
```

6. **Seed sample data (optional)**
```bash
bun run seed
```

7. **Start the development server**
```bash
bun run dev
```

The API will be available at `http://localhost:3000`

---

## 📚 API Documentation

### **Authentication**

#### Register a new user
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

### **Contacts**

#### Create a contact
```http
POST /api/v1/contacts
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Jane Smith",
  "phone": "+1234567890",
  "email": "jane@example.com",
  "address": "123 Main St, New York, NY",
  "tags": ["friend", "colleague"],
  "privacyLevel": "private",
  "notes": "Met at conference 2024"
}
```

#### Get all contacts
```http
GET /api/v1/contacts?page=1&limit=20&tag=friend
Authorization: Bearer {token}
```

#### Update a contact
```http
PUT /api/v1/contacts/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "phone": "+9876543210",
  "tags": ["friend", "best-friend"]
}
```

#### Delete a contact
```http
DELETE /api/v1/contacts/:id
Authorization: Bearer {token}
```

---

### **Relationships**

#### Create a relationship
```http
POST /api/v1/relationships
Authorization: Bearer {token}
Content-Type: application/json

{
  "contactId": "456",
  "relatedContactId": "789",
  "type": "sibling",
  "strength": 9
}
```

#### Get contact relationships
```http
GET /api/v1/contacts/:id/relationships
Authorization: Bearer {token}
```

---

### **AI Queries**

#### Natural language search
```http
POST /api/v1/ai/query
Authorization: Bearer {token}
Content-Type: application/json

{
  "query": "Show me all my dentists in New York"
}
```

**Response:**
```json
{
  "results": [
    {
      "id": "789",
      "name": "Dr. Smith",
      "phone": "+1234567890",
      "address": "456 Park Ave, New York, NY",
      "relevance": 0.95
    }
  ],
  "interpretation": "Searching for contacts tagged as 'dentist' located in New York",
  "count": 1
}
---

## 🚢 Deployment

### **Docker Production Build**

1. Build the image:
```bash
docker build -t smartcontact:latest .
```

2. Run the container:
```bash
docker run -p 3000:3000 --env-file .env.production smartcontact:latest
```

### **Using Docker Compose**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📊 Database Schema

### **Core Tables**

#### Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Contacts
```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  notes TEXT,
  privacy_level VARCHAR(20) DEFAULT 'private',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Relationships
```sql
CREATE TABLE relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  related_contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  relationship_type VARCHAR(50) NOT NULL,
  strength INTEGER CHECK (strength >= 1 AND strength <= 10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔐 Security

- **Authentication**: JWT tokens with secure HTTP-only cookies
- **Password Hashing**: Bcrypt with salt rounds of 12
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **SQL Injection**: Parameterized queries via ORM
- **XSS Protection**: Content Security Policy headers
- **CORS**: Configurable allowed origins
- **Data Encryption**: AES-256 for sensitive fields

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Workflow**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Code Style**

- Follow the [TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- Run `bun run lint` before committing
- Write tests for new features
- Update documentation as needed


## 🙏 Acknowledgments

- Google Gemini
- Neo4j for graph database technology
- The open-source community


## 💡 Use Cases

### **Personal**
- Organize family contacts with relationships
- Find service providers recommended by friends
- Never lose important contact information

### **Professional**
- Manage client relationships
- Track professional network
- Find experts through connections

### **Small Business**
- Customer relationship management
- Vendor directory
- Team collaboration


**Made with ❤️ by the SmartContact Team(Pushkar)**