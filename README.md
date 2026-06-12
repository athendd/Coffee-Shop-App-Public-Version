# ☕ Coffee Shop Customer Service Chatbot 🚀

An AI-powered, agent-based customer service chatbot integrated into a full-stack React Native coffee shop application.

This project leverages **Large Language Models (LLMs)**, **Natural Language Processing (NLP)**, **Retrieval-Augmented Generation (RAG)**, and a **Market Basket Recommendation Engine** to create a production-ready intelligent ordering system.

---

## 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Enhancements & Improvements](#-enhancements--improvements)
- [Agent-Based Architecture](#-agent-based-architecture)
- [Agent Workflow](#-agent-workflow)
- [React Native Application](#-react-native-application)
- [Deployment](#-deployment)
- [Technologies Used](#-technologies-used)

---

# 🎯 Project Overview

The goal of this project is to build a modular, scalable AI chatbot capable of:

- ✅ Handling real-time customer orders  
- ✅ Answering menu questions (ingredients, allergens, calories, ratings) using RAG  
- ✅ Providing personalized product recommendations  
- ✅ Supporting dynamic pricing based on size & flavor customizations  
- ✅ Blocking irrelevant or harmful queries  
- ✅ Integrating seamlessly into a React Native mobile app  

This system simulates a real-world AI deployment for a digital coffee shop experience.

---

# 🆕 Enhancements & Improvements

After completing the base project, I significantly improved the system architecture, runtime performance, and application features.

---

## ⚡ Performance & Infrastructure Improvements

- Switched to **direct Hugging Face model calls** during development  
- Use **RunPod only for production deployment**
- Removed chain-of-thought prompting to improve runtime
- Optimized Classification Agent to output only the agent name
- Reduced token usage and improved response latency

---

## 🛡 Guard & Classification Improvements

### Guard Agent
- Improved filtering of:
  - Irrelevant queries
  - Useless or off-topic questions
  - Unsafe inputs

### Classification Agent
- Simplified output format:

```python
"order_agent"
"details_agent"
"recommendation_agent"
```

---

## 🧾 Order Agent Improvements

### Order Validation Features
- Ensures required fields (size, syrup) are included
- Prevents invalid item combinations
- Structures order into clean JSON format
- Validates dark chocolate (drinking chocolate) customization

### Supports:
- Sizes (Small, Medium, Large)
- Syrups / flavor add-ons
- Dynamic pricing calculation
  - Size-based price adjustment
  - Syrup-based price adjustment

 ---

 ## 🍫 Menu Enhancements

 ### Added:
- Sizes & syrups for:
  - Latte
  - Cappuccino
  - Dark Chocolate (Drinking Chocolate)
- Calories for menu items
- Ratings for menu items
- Accurate price calculation with customizations

---

## 🔍 Search Engine

- Implemented a fully functional search engine:
  - Search by product name
  - Integrated with product metadata
  - Works directly inside the app
  - Enhances product discoverability
 
---

## 📱 App Improvements

- Added an About Us page
- Improved Cart functionality
- Enhanced chatbot integration
- Implemented real-time price updates
- Working search functionality
- Cleaned UI flow and navigation

---

# 🧠 Agent-Based Architecture

The chatbot uses a modular pipeline architecture where each agent has a single responsibility.

---

## 🤖 Core Agents

### 🛡 Guard Agent

- First line of defense
- Filters unsafe or irrelevant queries
- Prevents harmful interactions

### 🧠 Classification Agent

- Determines user intent
- Routes query to correct agent
- Outputs only the agent name

### 🧾 Order Agent

- Handles structured order creation
- Uses Python validation class
- Supports sizes and syrups
- Handles dark chocolate customization
- Calculates total price dynamically

### 📚 Details Agent (RAG)

- Uses vector database for retrieval
- Answers:
  - Ingredients
  - Calories
  - Ratings
  - About Us

- Combines retrieval with LLM response generation

### 🎯 Recommendation Agent

- Powered by Market Basket Analysis
- Suggests complementary items
- Boosts upselling opportunities

---

# ⚙️ Agent Workflow

```text
User Input
    ↓
Guard Agent
    ↓
Classification Agent
    ↓
┌──────────────────────────────┐
│ Order Agent                  │
│ Details Agent (RAG)          │
│ Recommendation Agent         │
└──────────────────────────────┘
```

---

# 📱 React Native Application

The React Native mobile app serves as the front-end interface for customers.

---

## ✨ Key Features

- Landing Page
- Home Page
- Item Details Page
- Ingredients
- Calories
- Ratings
- Cart Page
- Chatbot Interface
- About Us Page
- Working Search Engine
- Dynamic pricing updates

---

The app communicates directly with the Python backend API hosting the agent-based system.

---

# 🚀 Deployment

## Development Mode
- Direct Hugging Face model calls
- Faster iteration
- Lower infrastructure cost

## Production Mode
- RunPod deployment
- Scalable LLM hosting
- Fully integrated mobile backend

---

# 🛠 Technologies Used

- Python
- Hugging Face Transformers
- RunPod
- Pinecone (Vector Database)
- Firebase
- React Native
- Market Basket Analysis
- Retrieval-Augmented Generation (RAG)
- REST API Architecture
