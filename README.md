# ATS Resume Checker & Builder

A comprehensive web application designed to help job seekers optimize their resumes for Applicant Tracking Systems (ATS) and create professional, ATS-compliant resumes from scratch.

**Live Application:** https://ats-resume-checker-zoit.vercel.app/

---

## Features

### ATS Resume Checker

- **Resume Analysis:** Upload your resume (PDF or DOCX) and a job description to receive instant comprehensive analysis.
- **Matching Score:** Obtain an overall percentage score indicating how well your resume aligns with the job description.
- **Detailed Skill Comparison:**
  - **Matching Skills:** View a detailed list of skills present in your resume that are explicitly required by the job description.
  - **Missing Skills:** Identify key skills listed in the job description that are absent from your resume.
  - **Additional Skills:** Discover skills in your resume that exceed job requirements but may still be valuable.
- **Semantic Similarity Analysis:** Receive a score indicating the conceptual overlap between your resume and job description.
- **Action Verb Detection:** Identify strong action verbs used throughout your resume.
- **Section Identification:** Confirms standard resume sections found in your document.
- **Intuitive User Interface:** Modern UI with tabbed navigation, animated score display, and clear visual indicators for matched and missing skills.

### Resume Builder

- **Multi-Step Form:** Guided, intuitive multi-page form for entering all resume details (Contact, Summary, Education, Experience, Projects, Skills, Certificates, Languages).
- **Live Preview:** Real-time, ATS-compliant preview of your resume as you input information.
- **Structured Data Entry:** Ensures comprehensive capture of project tech stacks, work experience responsibilities, and certification details.
- **PDF Export:** Generate and download your professional resume as a PDF directly from the browser.

---

## Technology Stack

This project is built as a full-stack application leveraging modern web and machine learning technologies.

### Frontend

- **React.js:** JavaScript library for building dynamic user interfaces.
- **Axios:** Promise-based HTTP client for API communication.
- **html2pdf.js:** Client-side library for converting HTML content to PDF format.

### Backend

- **Python:** Primary programming language.
- **Flask:** Lightweight web framework for API development.
- **Flask-CORS:** Enables Cross-Origin Resource Sharing for frontend-backend communication.
- **spaCy:** Industrial-strength Natural Language Processing library for:
  - Tokenization and text processing
  - Named Entity Recognition (NER) for skill identification
  - Pattern matching using Matcher for robust skill extraction
- **sentence-transformers:** Generates advanced sentence embeddings for semantic similarity calculation.
- **PyPDF2:** Extracts text from PDF resumes.
- **python-docx:** Extracts text from DOCX resumes.
- **scikit-learn:** Provides cosine_similarity function for semantic analysis.

---

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

- Python 3.8 or higher
- Node.js and npm (version 6+) or Yarn (version 1.22+)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/keerthi-1118/ats_resume_checker.git
   cd ats_resume_checker
   ```

2. **Backend Setup (Python/Flask):**
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Create and activate a virtual environment (recommended):
     ```bash
     python -m venv venv
     # On Windows:
     .\venv\Scripts\activate
     # On macOS/Linux:
     source venv/bin/activate
     ```
   - Install Python dependencies:
     ```bash
     pip install -r requirements.txt
     ```
   - Download the spaCy English language model:
     ```bash
     python -m spacy download en_core_web_sm
     ```
   - Create an uploads directory for temporary file storage:
     ```bash
     mkdir uploads
     ```

3. **Frontend Setup (React):**
   - Navigate to the frontend directory from the project root:
     ```bash
     cd ../ats-frontend
     ```
   - Install Node.js dependencies:
     ```bash
     npm install
     # or yarn install
     ```
   - Install html2pdf.js:
     ```bash
     npm install html2pdf.js
     # or yarn add html2pdf.js
     ```

### Running the Application

1. **Start the Backend Server:**
   - Open terminal/command prompt.
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Activate your virtual environment:
     ```bash
     # On Windows:
     .\venv\Scripts\activate
     # On macOS/Linux:
     source venv/bin/activate
     ```
   - Run the Flask application:
     ```bash
     python app.py
     ```
     The server will run on `http://127.0.0.1:5000`

2. **Start the Frontend Development Server:**
   - Open a new terminal/command prompt window.
   - Navigate to the frontend directory:
     ```bash
     cd ats-frontend
     ```
   - Start the React application:
     ```bash
     npm start
     # or yarn start
     ```
     The application will open in your browser at `http://localhost:3000`

---

## Usage

### Home Screen

Upon launching the application, you will be presented with two options:
- **Create My Resume:** Navigate to the resume builder to design your resume.
- **Analyze Existing Resume:** Proceed to the ATS checker to evaluate an existing resume.

### ATS Resume Checker

1. Upload your resume using drag-and-drop or file browser (PDF or DOCX formats supported).
2. Paste the job description text into the provided textarea (optional for basic analysis).
3. Click "Analyze Resume" to process your inputs.
4. View Results:
   - **ATS Analysis Tab:** Overall matching score, side-by-side skill comparison, semantic similarity, detected sections, and action verbs.
   - **Resume Summary Tab:** Structured summary including contact information, projects with tech stack, work experience, and certifications.

### Resume Builder

1. Click **"Create My Resume"** from the home screen.
2. Navigate through tabs (Contact, Summary, Education, etc.) to input resume details.
3. View real-time, ATS-compliant preview in the live preview window.
4. Use "Add" and "Remove" buttons to manage multiple entries in Education, Experience, Projects, Skills, and Certificates sections.
5. Click "Download PDF" to generate and download your professional resume.

---

## Project Structure

```
ats_resume_checker/
├── backend/                        # Flask Backend Application
│   ├── app.py                      # Main Flask app with NLP logic and API endpoints
│   ├── uploads/                    # Temporary storage for uploaded resumes
│   ├── requirements.txt            # Python dependencies
│   └── venv/                       # Python virtual environment (ignored by Git)
├── ats-frontend/                   # React Frontend Application
│   ├── public/                     # Static assets and index.html
│   ├── src/
│   │   ├── App.js                  # Main React application and routing
│   │   ├── App.css                 # Global and ATS-specific styling
│   │   ├── index.js                # React entry point
│   │   ├── components/             # Reusable UI components
│   │   │   ├── ResumeBuilder.js    # Resume builder forms and preview component
│   │   │   ├── ResumeBuilder.css   # Resume builder layout and form styling
│   │   │   ├── InputField.js       # Reusable input field component
│   │   │   ├── InputField.css      # InputField styling
│   │   │   ├── ArrayField.js       # Component for dynamic lists
│   │   │   ├── ArrayField.css      # ArrayField styling
│   │   │   ├── SectionHeader.js    # Reusable section header component
│   │   │   └── SectionHeader.css   # SectionHeader styling
│   │   └── utils/                  # Utility functions
│   │       └── resumePdfGenerator.js # PDF generation logic
│   ├── package.json                # Node.js dependencies and metadata
│   ├── package-lock.json           # Exact dependency versions
│   └── node_modules/               # Node.js packages (ignored by Git)
├── .gitignore                      # Git ignore configuration
└── README.md                       # Project documentation
```

---

## Contributing

Contributions are welcome. If you have suggestions for improvements or find bugs, please open an issue or submit a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details.

---

## Acknowledgments

- spaCy for comprehensive NLP capabilities
- sentence-transformers for robust semantic similarity analysis
- Flask for the backend framework
- React.js for the frontend library
- html2pdf.js for client-side PDF generation
