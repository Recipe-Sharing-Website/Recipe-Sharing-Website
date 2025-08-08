# 🍲 **TastyTales: Recipe Sharing Website (MERN)**

**TastyTales** is a community-driven recipe-sharing platform built using the MERN stack.  
It allows food lovers to explore, share, and manage recipes with rich features like voice search, image uploads, ratings, and comments.

---

## 🎯 **Objective**
The goal of TastyTales is to create a platform where:
- **Unauthenticated users** can browse recipes.
- **Authenticated users** can create, edit, and delete their own recipes.
- Users can search recipes (including **voice commands**), save favorites, and interact via ratings & comments.

---

## ✨ **Features**
- 🔐 **User Authentication** with JWT & Cookies
- 📝 Create, edit, and delete recipes
- 📷 Image upload via URL
- 🔍 Search recipes (voice-enabled search supported)
- ❤️ Save favorite recipes to personal profile
- ⭐ Rate and comment on recipes
- 📌 View featured recipes
- 🌐 Fully responsive design

---

## 🛠️ **Tech Stack**

| Layer        | Technology                                  | Purpose                                   |
|--------------|---------------------------------------------|-------------------------------------------|
| **Frontend** | React.js                                    | User Interface                            |
| **Backend**  | Node.js + Express.js                        | Server and API logic                      |
| **Database** | MongoDB                                     | Stores users, recipes, comments, ratings  |
| **Middleware** | JWT Auth                                  | Route protection & session management     |
| **Others**   | Axios, Mongoose                             | HTTP requests & MongoDB data modeling     |

---

## 📂 Project Structure

- frontend/ → React.js client code 
- backend/ → Express.js + Node.js server code
- models/ → Mongoose models (User, Recipe, Comment)
- routes/ → API endpoints
- public/ → Static assets

---

## 🚀 Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Recipe-Sharing-Website/Recipe-Sharing-Website.git
   cd Recipe-Sharing-Website


2. **Install Dependencies**

   * For backend:

     ```bash
     cd backend
     npm install
     ```
   * For frontend:

     ```bash
     cd ../frontend
     npm install
     ```

3. **Set Environment Variables**
   Create a `.env` file inside the **backend** folder:

   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

4. **Run the Application**

   * Start backend:

     ```bash
     cd backend
     npm start
     ```
   * Start frontend:

     ```bash
     cd frontend
     npm start
     ```

---

📸 **Screenshots**

 1. Login Page
    <img width="1919" height="910" alt="Screenshot 2025-08-08 184540" src="https://github.com/user-attachments/assets/7723e8d4-f42a-4bb8-b432-907786f53dc9" />

2. Home Page
   <img width="1919" height="908" alt="Screenshot 2025-08-08 185047" src="https://github.com/user-attachments/assets/66f4864a-389e-4b3c-bff3-b4d36399b8d6" />

3. Create Recipes
   <img width="1919" height="903" alt="Screenshot 2025-08-08 184637" src="https://github.com/user-attachments/assets/53be356c-aa36-4e50-b242-6e138fea782d" />

4. User Profile 
   <img width="1919" height="908" alt="Screenshot 2025-08-08 184649" src="https://github.com/user-attachments/assets/c4baf0f4-1a1f-401b-b467-6e1d37aa44c4" />

5. Saved Recipes
   <img width="1919" height="906" alt="Screenshot 2025-08-08 185108" src="https://github.com/user-attachments/assets/9cc6aa00-5d1e-4062-b2ab-57df8885b91f" />

6. My Recipes
   <img width="1919" height="900" alt="Screenshot 2025-08-08 185121" src="https://github.com/user-attachments/assets/48ecb048-06e7-42b7-b09e-cf1db9182d69" />


📜 **License**
This project is licensed under the MIT License.




   

   



