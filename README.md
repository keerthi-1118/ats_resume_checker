# ATS Resume Checker & Builder

A powerful web application designed to help job seekers optimize their resumes for Applicant Tracking Systems (ATS) and easily create professional, ATS-friendly resumes from scratch.

---

## 🌟 Features

### ATS Resume Checker
* **Resume Analysis:** Upload your resume (PDF or DOCX) and a job description to get an instant analysis.
* **Matching Score:** Receive an overall percentage score indicating how well your resume matches the job description.
* **Detailed Skill Comparison:**
    * **Matching Skills:** See a clean, line-by-line list of skills present in your resume that are explicitly required by the job description (e.g., HTML, CSS, JavaScript, Python, SQL, Git, REST API).
    * **Missing Skills:** Identify key skills listed in the job description that are absent from your resume.
    * **Extra Skills:** Discover skills present in your resume that are not specifically requested by the job description but might still be valuable.
* **Semantic Similarity:** Get a score indicating the conceptual overlap between your resume and the job description.
* **Action Verb Detection:** Identify strong action verbs used in your resume.
* **Section Identification:** Confirms standard resume sections found in your document.
* **Interactive UI:** Modern UI with tabbed navigation, animated score gauge, and clear visual cues for matched and missing skills.

### Resume Builder
* **Multi-Step Form:** A guided, intuitive multi-page form to input all your resume details (Contact, Summary, Education, Experience, Projects, Skills, Certificates, Languages).
* **Live Preview:** See a real-time, ATS-friendly preview of your resume as you fill out the form.
* **Structured Data Entry:** Ensures all necessary details like project tech stacks, work experience responsibilities, and certification details are captured.
* **PDF Download:** Generate and download your professional resume as a PDF directly from the browser.

---

## 🛠️ Technology Stack

This project is built as a full-stack application leveraging modern web and machine learning technologies.

* **Frontend:**
    * **React.js:** A JavaScript library for building user interfaces.
    * **Axios:** Promise-based HTTP client for making API requests.
    * **`html2pdf.js`:** Client-side library for converting HTML content to PDF.
* **Backend:**
    * **Python:** The primary programming language.
    * **Flask:** A lightweight web framework for the API.
    * **Flask-CORS:** Enables Cross-Origin Resource Sharing for frontend-backend communication.
    * **`spaCy`:** Industrial-strength Natural Language Processing library for:
        * Tokenization and text processing.
        * Named Entity Recognition (NER) for initial skill identification.
        * Pattern matching (using `Matcher`) for robust skill extraction from varied text formats.
    * **`sentence-transformers`:** For generating advanced sentence embeddings to calculate semantic similarity.
    * **`PyPDF2`:** For extracting text from PDF resumes.
    * **`python-docx`:** For extracting text from DOCX resumes.
    * **`scikit-learn`:** (Used for `cosine_similarity` in semantic analysis).

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* **Python 3.8+**
* **Node.js & npm (or Yarn)** (npm 6+ or Yarn 1.22+)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/keerthi-1118/ats_resume_checker.git
    cd ats_resume_checker
    ```

2.  **Backend Setup (Python/Flask):**
    * Navigate into the `backend` directory:
        ```bash
        cd backend
        ```
    * (Optional but recommended) Create and activate a virtual environment:
        ```bash
        python -m venv venv
        # On Windows:
        .\venv\Scripts\activate
        # On macOS/Linux:
        source venv/bin/activate
        ```
    * Install the required Python packages:
        ```bash
        pip install -r requirements.txt
        ```
    * Download the spaCy English language model:
        ```bash
        python -m spacy download en_core_web_sm
        ```
    * Create an `uploads` directory for temporary file storage:
        ```bash
        mkdir uploads
        ```

3.  **Frontend Setup (React):**
    * Navigate back to the root directory of the project, then into the `ats-frontend` directory:
        ```bash
        cd ../ats-frontend
        ```
    * Install the Node.js dependencies:
        ```bash
        npm install
        # or yarn install
        ```
    * Install `html2pdf.js` specifically:
        ```bash
        npm install html2pdf.js
        # or yarn add html2pdf.js
        ```

### Running the Application

1.  **Start the Backend Server:**
    * Open your terminal/command prompt.
    * Navigate to `YOUR_REPO_NAME/backend`.
    * Activate your virtual environment (if you created one):
        ```bash
        # On Windows:
        .\venv\Scripts\activate
        # On macOS/Linux:
        source venv/bin/activate
        ```
    * Run the Flask application:
        ```bash
        python app.py
        ```
        The server will usually run on `http://127.0.0.1:5000`.

2.  **Start the Frontend Development Server:**
    * Open a **new** terminal/command prompt window.
    * Navigate to `YOUR_REPO_NAME/ats-frontend`.
    * Start the React app:
        ```bash
        npm start
        # or yarn start
        ```
        The application will usually open in your browser at `http://localhost:3000`.

---

## 🚀 Usage

### Home Screen
Upon launching the application, you will be greeted with a choice:
* **"Create My Resume"**: Navigate to the resume builder to design your own resume.
* **"Analyze Existing Resume"**: Proceed to the ATS checker to evaluate an existing resume.

### ATS Resume Checker
1.  **Upload your resume:** Drag and drop your resume file (PDF or DOCX) into the designated area, or click to browse.
2.  **Paste Job Description:** Copy and paste the text of the job description into the provided textarea (optional for basic analysis).
3.  **Click "Analyze Resume"**: The application will process your inputs.
4.  **View Results:**
    * **ATS Analysis Tab:** See the overall matching score, side-by-side matching and missing skills, semantic similarity, detected sections, and action verbs.
    * **Resume Summary Tab:** Click this tab to view a structured summary of your resume, including contact info, projects (with tech stack), work experience, and certifications.

### Resume Builder
1.  Click **"Create My Resume"** from the home screen.
2.  **Navigate through tabs:** Use the tabs (Contact, Summary, Education, etc.) at the top to fill in your resume details.
3.  **Live Preview:** As you type, see your resume take shape in the live preview window on the right.
4.  **Add/Remove Items:** Use "Add" and "Remove" buttons within sections like Education, Experience, Projects, Skills, and Certificates to manage multiple entries.
5.  **Download PDF:** Once satisfied, click the "Download PDF" button to generate and download your resume as a professional PDF document.

---

## 📂 Project Structure
```
ats_resume_checker/
├── backend/                        # Flask Backend Application
│   ├── app.py                      # Main Flask app, NLP logic, API endpoints
│   ├── uploads/                    # Temporary storage for uploaded resumes
│   ├── requirements.txt            # Python dependencies
│   └── venv/                       # Python virtual environment (ignored by Git)
├── ats-frontend/                   # React Frontend Application
│   ├── public/                     # Static assets (index.html)
│   ├── src/
│   │   ├── App.js                  # Main React app, routing, ATS logic
│   │   ├── App.css                 # Global styling & ATS specific styles
│   │   ├── index.js                # React entry point
│   │   ├── components/             # Reusable UI components for builder and ATS
│   │   │   ├── ResumeBuilder.js    # Main component for the resume builder forms and preview
│   │   │   ├── ResumeBuilder.css   # Styles for the resume builder layout and form
│   │   │   ├── InputField.js       # Reusable input field component
│   │   │   ├── InputField.css      # Styles for InputField
│   │   │   ├── ArrayField.js       # Reusable component for dynamic lists (edu, exp, proj)
│   │   │   ├── ArrayField.css      # Styles for ArrayField
│   │   │   └── SectionHeader.js    # Reusable section header for forms
│   │   │   └── SectionHeader.css   # Styles for SectionHeader
│   │   └── utils/                  # Utility functions
│   │       └── resumePdfGenerator.js # PDF generation logic
│   ├── package.json                # Node.js dependencies and project metadata
│   ├── package-lock.json           # Exact dependency versions (or yarn.lock)
│   └── node_modules/               # Node.js packages (ignored by Git)
├── .gitignore                      # Specifies intentionally untracked files to ignore
└── README.md                       # This file

```
---

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or find bugs, please open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.


---

## 🙏 Acknowledgments

* `spaCy` for powerful NLP capabilities.
* `sentence-transformers` for robust semantic similarity.
* `Flask` for the backend framework.
* `React.js` for the frontend library.
* `html2pdf.js` for client-side PDF generation.
* To my AI assistant for guiding through the development process! :)

---

