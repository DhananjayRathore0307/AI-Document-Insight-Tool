# 📄 AI-Powered Document Insight Tool

This project is an AI-powered web application designed to analyze PDF documents (primarily resumes) and generate concise summaries or insights. It includes features such as:

- 📤 PDF upload
- 🤖 AI-driven summarization (using Sarvam AI)
- 🧠 Historical record of uploaded documents and results


---

## 🧩 Tech Stack

### Backend (API & Processing)
- **Python**
- **FastAPI**
- **Uvicorn** (ASGI server)
- **Sarvam AI API** (for document summarization)
- **PyMuPDF** (for PDF text extraction)

### Frontend
- **React** (via Vite)
- **TailwindCSS** (optional for styling)

---

## 🚀 Getting Started

### 1️⃣ Backend Setup

#### 📦 Prerequisites

- Python 3.9+
- [Sarvam AI API Key](https://sarvam.ai) (ensure it’s stored securely via `.env`)

#### 🛠 Installation

**Backend Setup**
cd backend
pip install -r requirements.txt

 **Frontend Setup**
 cd frontend
npm install
npm run dev
