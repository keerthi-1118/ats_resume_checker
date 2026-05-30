# ATS Resume Checker & Builder

A comprehensive web application designed to help job seekers optimize their resumes for Applicant Tracking Systems (ATS) and create professional, ATS-compliant resumes from scratch.

**Live Application:** https://ats-resume-checker-zoit.vercel.app/

---

## Project Overview

**ATS Resume Checker & Builder** is a full-stack web application built to address the critical challenge of getting resumes past Applicant Tracking Systems. The application consists of two core modules:

**1. ATS Resume Analyzer** - Leverages advanced Natural Language Processing (NLP) to compare your resume against job descriptions, providing detailed insights on skill matching, missing qualifications, and overall ATS compatibility. It calculates a comprehensive matching score based on hard skills analysis and semantic similarity.

**2. Resume Builder** - Enables users to create professional, ATS-optimized resumes from scratch using an intuitive multi-step form with real-time preview. The builder generates downloadable PDF resumes that are formatted to pass ATS screening.

The project uses modern web technologies with React.js on the frontend and Python/Flask on the backend, integrated with spaCy for advanced NLP processing, PyPDF2 and python-docx for document parsing, and sentence-transformers for semantic analysis.

**Key Capabilities:**
- Analyzes resumes against job descriptions using spaCy NER and pattern matching
- Calculates matching scores based on skill extraction and normalization
- Detects action verbs and resume sections for content optimization
- Extracts structured resume information (contact details, experience, projects, certifications)
- Builds ATS-compliant resumes with live preview functionality
- Exports resumes directly to PDF format

---

## System Architecture

```
                    [ React Frontend ]
                    (localhost:3000)
                            |
        ┌───────────────────┼───────────────────┐
        |                   |                   |
        v                   v                   v
  [ Home Page ]      [ Analyzer ]        [ Builder ]
        |                   |                   |
        └───────────────────┼───────────────────┘
                            |
                    [ Axios HTTP ]
                            |
        ┌───────────────────┼───────────────────┐
        |                   |                   |
        v                   v                   v
  [ /analyze ]     [ /resume_summary ]  [ /health ]
        |                   |                   |
        └───────────────────┼───────────────────┘
                            |
                    [ Flask Backend ]
                    (localhost:5000)
                            |
        ┌───────────────────┼───────────────────┐
        |                   |                   |
        v                   v                   v
  [ File Parser ]    [ NLP Pipeline ]    [ Data Extract ]
  - PyPDF2           - spaCy NER         - Contact Info
  - python-docx      - Pattern Match     - Sections
                     - Normalize         - Action Verbs
                            |
                            v
                    [ Results JSON ]
                            |
                    [ Frontend Display ]
```

---

## Features

### ATS Resume Checker

- **Intelligent Resume Analysis:** Upload resumes in PDF or DOCX format alongside job descriptions to receive automated ATS compatibility analysis powered by advanced NLP.

- **Skill Matching Engine:** Extracts and normalizes skills from both resume and job description, providing detailed comparison of:
  - **Matching Skills:** Hard skills explicitly present in both documents
  - **Missing Skills:** Critical requirements from job description absent in resume
  - **Extra Skills:** Resume skills exceeding job requirements (valuable for profile enhancement)

- **ATS Compatibility Scoring:** Generates an overall percentage score (0-100%) indicating resume alignment with job requirements, calculated based on matched hard skills against required qualifications.

- **Resume Content Analysis:**
  - Detects standard resume sections (Education, Experience, Skills, Projects, Certifications)
  - Identifies action verbs used in work descriptions for impact assessment
  - Extracts structured resume information for comprehensive review

- **Structured Resume Summary:** Automatically extracts and organizes:
  - Contact information (Name, Email, Phone, LinkedIn, GitHub, Portfolio)
  - Work experience and responsibilities
  - Projects with identified technology stack
  - Certifications and credentials

- **User-Friendly Interface:** Tabbed navigation between analysis results and resume summary with animated score gauge and visual indicators for skill matching status.

### Resume Builder

- **Multi-Step Resume Creation:** Guided form-based approach with dedicated sections for:
  - Contact Information (Name, Email, Phone, LinkedIn, GitHub, Portfolio)
  - Professional Summary
  - Education (Institution, Degree, Graduation Date)
  - Work Experience (Company, Position, Responsibilities)
  - Projects (Title, Description, Technology Stack)
  - Technical Skills (with categorization support)
  - Certifications (Name, Issuer, Date Earned)
  - Languages (Language, Proficiency Level)

- **Real-Time Live Preview:** Instant visual feedback as you enter information, showing exactly how your resume will appear with ATS-friendly formatting.

- **Dynamic Entry Management:** Add or remove multiple entries for education, experience, projects, and certifications as needed.

- **PDF Export Functionality:** Generate professional PDF resumes directly from the browser using client-side processing, with no server-side storage required.

- **ATS-Optimized Formatting:** Built-in formatting ensures resumes bypass ATS scanning without special characters or complex styling.

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
