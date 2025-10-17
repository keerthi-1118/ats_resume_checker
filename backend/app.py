from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import PyPDF2
import docx
from collections import Counter
import re
import spacy
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from spacy.matcher import Matcher

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

ALLOWED_EXTENSIONS = {'pdf', 'docx'}
app.config['ALLOWED_EXTENSIONS'] = ALLOWED_EXTENSIONS

# --- NLP Model Initialization ---
nlp = spacy.load("en_core_web_sm")
matcher = Matcher(nlp.vocab)
skill_model = SentenceTransformer('all-MiniLM-L6-v2')

# --- Global Skill Lists and Mappings ---
COMMON_SKILLS = {
    "python", "java", "javascript", "react", "angular", "vue.js", "sql", "nosql", "aws", "azure", "google cloud",
    "docker", "kubernetes", "communication", "problem-solving", "teamwork", "leadership", "project management",
    "agile", "scrum", "waterfall", "testing", "debugging", "data analysis", "machine learning", "deep learning",
    "natural language processing", "frontend development", "backend development", "full-stack development",
    "network administration", "cybersecurity", "technical writing", "customer service",
    "html", "css", "php", "mongodb", "c++", "c", "dsa", "power bi", "laravel", "restful api", "cpanel", "github",
    "react native", "typescript", "expo", "tailwindcss", "nativewind", "react-native-video", "react-navigation",
    "react-query", "axios", "file upload", "media handling", "amazon web services", "google cloud platform",
    "software development", "web applications", "mobile applications", "apis", "api", "databases", "database management",
    "version control", "git", "ci/cd", "devops", "troubleshoot", "optimize", "ui/ux",
    "computer science", "engineering", "algorithms", "data structures", "spring boot", "node.js", "django",
    "firebase", "graphql", "rest apis", "mysql", "postgresql", "sqlite", "bootstrap", "opencv", "mediapipe",
    "tensorflow", "scikit-learn", "pandas", "numpy", "matplotlib", "requests", "pillow", "beautifulsoup", "seaborn",
    "keras", "pytorch", "linux", "unix", "windows", "macos", "cloud", "security", "networking", "shell scripting",
    "data modeling", "etl", "data warehousing", "big data", "spark", "hadoop", "kafka", "tableau", "powerbi",
    "excel", "jira", "confluence", "trello", "scrum master", "product management", "stakeholder management",
    "client communication", "presentation skills", "analytical skills", "critical thinking", "adaptability",
    "innovation", "eager to learn", "problem solver", "team player", "collaborative mindset", "proactive",
    "responsive web design", "ui/ux principles", "mobile development", "fullstack", "full stack",
    "coding standards", "application performance", "industry trends", "coding", "clean code", "maintainable code",
    "cross-platform development", "mobile device compatibility", "backend integrations",
    "real-world applications", "software solutions", "front-end development", "back-end development", "integrations",
    "hosting", "deployment fundamentals", "deployment", "experience", "knowledge", "familiarity", "understanding",
    "restful api basics", "mysql database management", "hosting & deployment fundamentals", "core php programming",
    "mobile experience", "seamless mobile experience", "visually appealing ui", "clean code", "modular code",
    "maintainable code", "responsive mobile applications", "high-quality apps", "smooth apps", "debug",
    "optimize performance", "integrate rest apis", "graphql endpoints", "modern react native libraries",
    "video players", "image pickers", "gesture handlers", "follow best practices", "mobile development best practices",
    "version control", "app deployment", "cross-platform development", "mobile device compatibility",
    "firebase", "local storage", "backend integrations", "troubleshoot issues", "performance bottlenecks",
    "animation glitches",
    "rest api", # ADDED: The normalized form of "restful api" explicitly here
    "mysql" # ADDED: Ensure mysql is also in common skills explicitly if needed for filtering
}

SKILL_MAPPING = {
    "python programming": "python", "python skills": "python",
    "java development": "java",
    "js": "javascript", "javascipt": "javascript",
    "html5": "html", "html": "html",
    "css3": "css", "css": "css",
    "react.js": "react", "reactnative": "react native",
    "type script": "typescript", "ts": "typescript",
    "expo": "expo",
    "tailwind css": "tailwindcss",
    "nativewind": "nativewind",
    "amazon web services": "aws", "amazon web services (aws)": "aws",
    "google cloud platform": "google cloud", "googlecloud": "google cloud",
    "restful api": "rest api", "rest apis": "rest api", "api": "rest api", "apis": "rest api", "restful api basics": "rest api",
    "version control systems": "git", "github": "git", # Map github to git for broader matching
    "data structures and algorithms": "dsa", "data structures": "dsa", "algorithms": "dsa",
    "mysql database management": "sql", "database management": "sql", "databases": "sql", "mysql": "sql", # Map mysql to sql
    "ci/cd pipelines": "ci/cd", "ci cd": "ci/cd",
    "devops practices": "devops",
    "ui/ux principles": "ui/ux", "ui/ux": "ui/ux", "visually appealing ui": "ui/ux",
    "mobile app development": "mobile applications", "mobile application": "mobile applications", "mobile apps": "mobile applications", "responsive mobile applications": "mobile applications",
    "web app development": "web applications", "web application": "web applications",
    "communication skills": "communication", "good communication skills": "communication",
    "collaborative mindset": "collaboration", "teamwork abilities": "teamwork", "team player": "teamwork",
    "troubleshoot": "troubleshoot", "debug": "debug", "optimize": "optimize", "troubleshoot issues": "troubleshoot", "performance bottlenecks": "troubleshoot", "animation glitches": "troubleshoot",
    "software development": "software development",
    "full stack": "full-stack", "fullstack": "full-stack",
    "responsive web design": "responsive web design",
    "front-end development": "front-end development", "back-end development": "back-end development",
    "hosting": "hosting", "deployment fundamentals": "deployment", "deployment": "deployment", "hosting & deployment fundamentals": "deployment", "app deployment": "deployment",
    "integrations": "integrations", "backend integrations": "integrations",
    "core php programming": "php",
    "clean code": "clean code", "modular code": "clean code", "maintainable code": "clean code",
    "real-world applications": "real-world applications",
    "modern tools": "modern tools", "cutting-edge apps": "modern tools",
    "video players": "react native libraries", "image pickers": "react native libraries", "gesture handlers": "react native libraries",
    "react-native-video": "react native libraries", "react-navigation": "react native libraries", "react-query": "react native libraries", "axios": "react native libraries",
    "file upload": "file upload", "media handling": "media handling", "file upload and media handling libraries": "media handling",
    "cross-platform development": "cross-platform development", "mobile device compatibility": "mobile device compatibility",
    "firebase": "firebase", "local storage": "local storage"
}

HARD_SKILLS = {
    "python", "java", "javascript", "react", "angular", "vue.js", "sql", "nosql", "aws", "azure", "google cloud",
    "docker", "kubernetes", "html", "css", "php", "mongodb", "c++", "c", "dsa", "power bi", "laravel", "rest api", "cpanel", "git",
    "react native", "typescript", "expo", "tailwindcss", "nativewind", "react native libraries",
    "spring boot", "node.js", "django", "firebase", "graphql", "mysql", "postgresql", "sqlite", "bootstrap",
    "opencv", "mediapipe", "tensorflow", "scikit-learn", "pandas", "numpy", "matplotlib", "requests", "pillow",
    "beautifulsoup", "seaborn", "keras", "pytorch", "linux", "unix", "windows", "macos", "shell scripting",
    "jira", "confluence", "trello", "axios"
    # Removed broader terms like "deployment", "hosting", "integrations", "responsive web design", "software development" from HARD_SKILLS
}


SKILL_GROUPS = {
    "database management": {"sql", "mysql", "mongodb", "postgresql", "firebase", "local storage"},
    "frontend development": {"html", "css", "javascript", "react", "react.js", "react native", "frontend development", "typescript", "tailwindcss", "nativewind", "bootstrap", "ui/ux", "responsive web design"},
    "backend development": {"python", "php", "flask", "backend development", "rest api", "django", "node.js", "spring boot", "laravel", "integrations", "graphql", "backend integrations"},
    "mobile development": {"react native", "expo", "react-native-video", "react-navigation", "tailwindcss", "nativewind", "file upload", "media handling", "firebase", "mobile applications", "responsive mobile applications", "cross-platform development", "mobile device compatibility"},
    "cloud technologies": {"aws", "azure", "google cloud", "amazon web services", "google cloud platform"},
    "methodologies": {"agile", "scrum", "waterfall"},
    "libraries": {"react-query", "axios", "file upload", "media handling", "pandas", "numpy", "matplotlib", "requests", "pillow", "tensorflow", "opencv", "scikit-learn", "beautifulsoup", "seaborn", "keras", "pytorch", "react native libraries"},
    "version control": {"git", "github"},
    "core programming": {"python", "java", "javascript", "c", "c++", "dsa", "algorithms", "data structures", "typescript", "clean code", "modular code", "maintainable code"},
    "devops": {"ci/cd", "devops", "kubernetes", "docker", "hosting", "deployment", "deployment fundamentals", "app deployment"},
    "project management": {"project management", "jira", "confluence", "trello", "scrum master"},
    "troubleshooting": {"troubleshoot", "debug", "optimize", "optimize performance", "troubleshoot issues", "performance bottlenecks", "animation glitches"}
}

# --- CRITICAL CHANGE FOR REST API ---
# Removed 'rest' from WHOLE_WORD_SKILLS to allow patterns like 'restful api' to match correctly.
# Added 'rest api' explicitly to WHOLE_WORD_SKILLS for robust matching of the normalized form.
WHOLE_WORD_SKILLS = {"c", "r", "java", "aws", "git", "sql", "php", "css", "html", "api", "apis", "ui/ux", "expo", "mysql", "html5", "css3", "react", "django", "node.js", "spring", "boot", "laravel", "cpanel", "github", "rest api"}

# --- Helper Functions (No changes from previous turn) ---
def allowed_file(filename):
    """Checks if the uploaded file has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def extract_text(filepath):
    """Extracts text from PDF or DOCX files."""
    file_extension = filepath.rsplit('.', 1)[1].lower()
    if file_extension == 'pdf':
        return extract_text_from_pdf(filepath)
    elif file_extension == 'docx':
        return extract_text_from_docx(filepath)
    return ""

def extract_text_from_pdf(pdf_path):
    """Extracts text from a PDF file."""
    text = ""
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text += page.extract_text()
    except Exception as e:
        return f"Error reading PDF: {e}"
    return text

def extract_text_from_docx(docx_path):
    """Extracts text from a DOCX file."""
    text = ""
    try:
        doc = docx.Document(docx_path)
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
    except Exception as e:
        return f"Error reading DOCX: {e}"
    return text

def normalize_skill(skill):
    """Normalizes skill names to a consistent format."""
    skill = skill.lower().strip()
    if skill in SKILL_MAPPING:
        return SKILL_MAPPING[skill]
    if skill == "react.js":
        return "react"
    if skill == "react native":
        return "react native"
    return skill

def extract_skills_with_ner_and_patterns(text):
    """Extracts skills from text using spaCy's NER and custom patterns."""
    doc = nlp(text.lower())
    skills = set()

    # --- Step 1: NER based extraction ---
    potential_skill_labels = ["SKILL", "TECHNOLOGY", "PRODUCT", "ORG", "PERSON", "GPE", "NORP", "FAC", "LOC", "MISC"]
    for ent in doc.ents:
        is_noise_entity = (
            (len(ent.text.split()) == 1 and len(ent.text) <= 2 and ent.text.lower() not in WHOLE_WORD_SKILLS and ent.text.lower() not in COMMON_SKILLS) or
            (ent.label_ in ["PERSON", "ORG", "GPE", "DATE", "CARDINAL", "ORDINAL"] and ent.text.lower() not in COMMON_SKILLS)
        )
        if not is_noise_entity and (ent.label_ in potential_skill_labels or ent.text.lower() in COMMON_SKILLS):
            skills.add(ent.text.lower())

    # --- Step 2: Pattern matching for skills ---
    if "SKILL_PATTERN" in matcher:
        matcher.remove("SKILL_PATTERN")

    patterns = [
        # Programming Languages (Core)
        [{'LOWER': 'javascript'}], [{'LOWER': 'python'}], [{'LOWER': 'java'}],
        [{'LOWER': 'html'}], [{'LOWER': 'css'}], [{'LOWER': 'php'}],
        [{'LOWER': 'c++'}], [{'LOWER': 'c'}], [{'LOWER': 'typescript'}],

        # Frameworks & Libraries (Web/Mobile)
        [{'LOWER': 'react'}], [{'LOWER': 'django'}], [{'LOWER': 'node.js'}],
        [{'LOWER': 'spring'}, {'LOWER': 'boot'}], [{'LOWER': 'laravel'}],
        [{'LOWER': 'vue.js'}], [{'LOWER': 'angular'}],
        [{'LOWER': 'flask'}], [{'LOWER': 'bootstrap'}],

        # Mobile Specific
        [{'LOWER': 'react'}, {'LOWER': 'native'}], [{'LOWER': 'expo'}],
        [{'LOWER': 'tailwindcss'}], [{'LOWER': 'nativewind'}],
        [{'LOWER': 'react'}, {'LOWER': '-'}, {'LOWER': 'native'}, {'LOWER': '-'}, {'LOWER': 'video'}],
        [{'LOWER': 'react'}, {'LOWER': '-'}, {'LOWER': 'navigation'}],
        [{'LOWER': 'react'}, {'LOWER': '-'}, {'LOWER': 'query'}], [{'LOWER': 'axios'}],

        # Databases
        [{'LOWER': 'sql'}], [{'LOWER': 'mysql'}], [{'LOWER': 'mongodb'}],
        [{'LOWER': 'postgresql'}], [{'LOWER': 'databases'}], [{'LOWER': 'database'}, {'LOWER': 'management'}],

        # Cloud Platforms
        [{'LOWER': 'aws'}], [{'LOWER': 'azure'}], [{'LOWER': 'google'}, {'LOWER': 'cloud'}],
        [{'LOWER': 'amazon'}, {'LOWER': 'web'}, {'LOWER': 'services'}],
        [{'LOWER': 'google'}, {'LOWER': 'cloud'}, {'LOWER': 'platform'}], [{'LOWER': 'cloud'}, {'LOWER': 'platforms'}],

        # Tools & Concepts
        [{'LOWER': 'git'}], [{'LOWER': 'version'}, {'LOWER': 'control'}],
        [{'LOWER': 'data'}, {'LOWER': 'structures'}], [{'LOWER': 'algorithms'}],
        [{'LOWER': 'dsa'}], # Direct match for DSA
        [{'LOWER': 'api'}], [{'LOWER': 'apis'}], [{'LOWER': 'rest'}, {'LOWER': 'api'}],
        [{'LOWER': 'ci/cd'}], [{'LOWER': 'devops'}], [{'LOWER': 'agile'}], [{'LOWER': 'scrum'}],
        [{'LOWER': 'ui/ux'}], [{'LOWER': 'web'}, {'LOWER': 'applications'}],
        [{'LOWER': 'mobile'}, {'LOWER': 'applications'}],
        [{'LOWER': 'troubleshoot'}], [{'LOWER': 'debug'}], [{'LOWER': 'optimize'}],
        [{'LOWER': 'file'}, {'LOWER': 'upload'}], [{'LOWER': 'media'}, {'LOWER': 'handling'}],
        [{'LOWER': 'linux'}], [{'LOWER': 'unix'}], [{'LOWER': 'windows'}], [{'LOWER': 'macos'}],
        [{'LOWER': 'shell'}, {'LOWER': 'scripting'}],
        [{'LOWER': 'coding'}, {'LOWER': 'standards'}], [{'LOWER': 'application'}, {'LOWER': 'performance'}],
        [{'LOWER': 'industry'}, {'LOWER': 'trends'}], [{'LOWER': 'clean'}, {'LOWER': 'code'}],
        [{'LOWER': 'maintainable'}, {'LOWER': 'code'}], [{'LOWER': 'software'}, {'LOWER': 'development'}],
        [{'LOWER': 'responsive'}, {'LOWER': 'web'}, {'LOWER': 'design'}],
        [{'LOWER': 'front-end'}, {'LOWER': 'development'}],
        [{'LOWER': 'back-end'}, {'LOWER': 'development'}],
        [{'LOWER': 'hosting'}], [{'LOWER': 'deployment'}], [{'LOWER': 'deployment'}, {'LOWER': 'fundamentals'}],
        [{'LOWER': 'integrations'}], # Specific from Web Dev JD
        [{'LOWER': 'html5'}], [{'LOWER': 'css3'}], # Direct match for HTML5, CSS3
        [{'LOWER': 'core'}, {'LOWER': 'php'}, {'LOWER': 'programming'}],
        [{'LOWER': 'mysql'}, {'LOWER': 'database'}, {'LOWER': 'management'}],
        [{'LOWER': 'restful'}, {'LOWER': 'api'}, {'LOWER': 'basics'}], # Precise pattern
        [{'LOWER': 'cpanel'}],
        [{'LOWER': 'github'}] # Specific for GitHub in JD
    ]
    matcher.add("SKILL_PATTERN", patterns, on_match=None)

    matches = matcher(doc)
    for match_id, start, end in matches:
        span = doc[start:end]
        skills.add(span.text)

    # Filter out single-character skills unless they are specifically in WHOLE_WORD_SKILLS
    final_skills = set()
    for skill_text in skills:
        if len(skill_text) <= 1 and skill_text.lower() not in WHOLE_WORD_SKILLS:
            continue
        final_skills.add(skill_text)

    normalized_skills = {normalize_skill(s) for s in final_skills}
    return normalized_skills

# --- Main Analysis Function ---
def analyze_resume(text, job_description=None):
    results = {}

    resume_skills = extract_skills_with_ner_and_patterns(text)
    # Filter out noise from resume_skills that are not in COMMON_SKILLS (e.g., names, random words)
    resume_skills = {s for s in resume_skills if s in COMMON_SKILLS}

    if job_description:
        # Focus JD skill extraction on relevant sections
        import re
        relevant_jd = job_description
        match = re.search(r'(What You Will Learn & Work On|Key Responsibilities|Qualifications|Preferred Skills|About the Internship|Job Description|Role|Responsibilities|Requirements|Skills|Experience|Qualifications & Skills|Integrations|Front-End Development|Back-End Development)(.*?)(\n\n[A-Z][A-Za-z ]+:|\Z|\n\nJob Description:|\n\nAbout the Company:)', job_description, re.DOTALL | re.IGNORECASE)
        if match:
            relevant_jd = match.group(2).strip()
        else:
            relevant_jd = job_description.strip()

        job_description_skills_raw = extract_skills_with_ner_and_patterns(relevant_jd)
        
        # Filter JD skills strictly by COMMON_SKILLS (as these are what we can match against)
        required_jd_skills = {s for s in job_description_skills_raw if s in COMMON_SKILLS}

        # Handle soft skills separately if needed, or ensure they are well-covered by COMMON_SKILLS
        if "communication" in job_description.lower() and "communication" in COMMON_SKILLS:
            if "communication" in resume_skills:
                required_jd_skills.add("communication")
                resume_skills.add("communication")


        matching_skills = set(resume_skills) & set(required_jd_skills)
        missing_skills = set(required_jd_skills) - set(resume_skills)
        extra_skills = set(resume_skills) - set(required_jd_skills)

        # Special handling for "software development" or other broad terms if they are causing issues
        if "software development" in required_jd_skills:
            if "full-stack" in resume_skills or "web applications" in resume_skills or "mobile applications" in resume_skills or "software development" in resume_skills:
                matching_skills.add("software development")
                missing_skills.discard("software development")
        
        # --- Print for debugging ---
        print(f"\n--- Debugging Analysis ---")
        print(f"Resume Skills (Normalized & Cleaned): {resume_skills}")
        print(f"JD Relevant Text Used for Skills: \n{relevant_jd[:500]}...")
        print(f"Job Description Skills (Extracted & Normalized, before COMMON_SKILLS filter): {job_description_skills_raw}")
        print(f"Required JD Skills (Filtered by COMMON_SKILLS): {required_jd_skills}")
        print(f"Calculated Matching Skills: {matching_skills}")
        print(f"Calculated Missing Skills: {missing_skills}")
        print(f"Calculated Extra Skills: {extra_skills}")
        print(f"--- End Debugging ---")

        def clean_skill_list(skill_set, filter_hard_skills=False):
            if filter_hard_skills:
                return sorted([s for s in list(skill_set) if s in HARD_SKILLS])
            return sorted([s for s in list(skill_set) if s in COMMON_SKILLS])

        results['matching_skills'] = clean_skill_list(matching_skills, filter_hard_skills=True)
        results['missing_skills'] = clean_skill_list(missing_skills, filter_hard_skills=True)
        results['extra_skills'] = clean_skill_list(extra_skills, filter_hard_skills=True)
        results['resume_skills'] = clean_skill_list(resume_skills)

        # Score calculation: More robust to empty sets
        if len(required_jd_skills) == 0:
            overall_score = 0.00
            if len(resume_skills) > 0:
                overall_score = 10.00
        else:
            matched_hard_skills = set(matching_skills) & set(HARD_SKILLS)
            required_hard_jd_skills = set(required_jd_skills) & set(HARD_SKILLS)

            if len(required_hard_jd_skills) == 0:
                overall_score = (len(matching_skills) / len(required_jd_skills)) * 100
            else:
                overall_score = (len(matched_hard_skills) / len(required_hard_jd_skills)) * 100

        results['overall_score'] = f"{overall_score:.2f}"

    else:
        results['extracted_skills'] = sorted(list(resume_skills))

    sections = ["experience", "education", "skills", "summary", "objective", "projects", "work experience", "about", "certifications"]
    found_sections = [section for section in sections if section in text.lower()]
    results['sections_found'] = sorted(found_sections)

    action_verbs = ["managed", "led", "developed", "implemented", "created", "analyzed", "designed", "improved", "increased", "reduced", "build", "maintain", "write", "participate", "troubleshoot", "debug", "optimize", "integrate", "use", "follow", "design"]
    found_action_verbs = [verb for verb in action_verbs if verb in text.lower()]
    results['action_verbs_found'] = sorted(list(set(found_action_verbs)))

    return results

# --- Resume Summary Extraction Helper ---
def extract_resume_summary(text):
    summary = {}
    # Name: Assume the first line or first capitalized phrase (very basic)
    lines = text.split('\n')
    name = None
    for line in lines:
        if line.strip() and len(line.strip().split()) <= 4 and line.strip()[0].isupper():
            name = line.strip()
            break
    summary['name'] = name

    # Clean up text to remove line breaks in the middle of words (especially for emails)
    cleaned_text = re.sub(r'(?<=\w)[\r\n]+(?=\w)', '', text)

    # Improved email regex: requires a TLD (e.g., .com, .in, .org, etc.)
    email_matches = re.findall(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', cleaned_text)
    summary['email'] = email_matches[0] if email_matches else None

    # Phone
    phone_match = re.search(r'(\+?\d{1,3}[\s-]?)?(\(?\d{3}\)?[\s-]?)?\d{3}[\s-]?\d{4}', text)
    summary['phone'] = phone_match.group(0) if phone_match else None

    # Address: Look for lines with numbers and common address words
    address = None
    for line in lines:
        if any(word in line.lower() for word in ['street', 'st.', 'road', 'rd.', 'ave', 'block', 'city', 'state', 'zip', 'pincode', 'village', 'district']) and any(char.isdigit() for char in line):
            address = line.strip()
            break
    summary['address'] = address

    # Projects and Tech Stack
    projects = []
    tech_stack = []
    in_projects = False
    for i, line in enumerate(lines):
        if 'project' in line.lower() and not in_projects:
            in_projects = True
            continue
        if in_projects:
            if line.strip() == '' or any(section in line.lower() for section in ['experience', 'education', 'certification', 'work']):
                in_projects = False
                continue
            # Exclude section headers or repeated 'Projects' lines
            if line.strip().lower() in ['projects', 'project']:
                continue
            projects.append(line.strip())
            # Extract tech stack keywords from the line
            for skill in COMMON_SKILLS:
                if skill.lower() in line.lower() and skill not in tech_stack:
                    tech_stack.append(skill)
    summary['projects'] = [p for p in projects if p]
    summary['tech_stack'] = tech_stack

    # Work Experience
    work_exp = []
    in_exp = False
    for i, line in enumerate(lines):
        if 'experience' in line.lower() or 'work experience' in line.lower():
            in_exp = True
        if in_exp:
            if line.strip() == '' or any(section in line.lower() for section in ['project', 'education', 'certification']):
                in_exp = False
                continue
            work_exp.append(line.strip())
    summary['work_experience'] = [w for w in work_exp if w]

    # Certifications
    certifications = []
    in_cert = False
    for i, line in enumerate(lines):
        if 'certification' in line.lower() or 'certificate' in line.lower():
            in_cert = True
        if in_cert:
            if line.strip() == '' or any(section in line.lower() for section in ['project', 'education', 'experience', 'work']):
                in_cert = False
                continue
            certifications.append(line.strip())
    summary['certifications'] = [c for c in certifications if c]

    return summary

# --- Flask Routes ---
@app.route('/analyze', methods=['POST'])
def analyze():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    file = request.files['file']
    job_description = request.form.get('job_description')

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        text = extract_text(filepath)
        os.remove(filepath)
        analysis_results = analyze_resume(text, job_description)
        return jsonify({'filename': filename, 'analysis': analysis_results}), 200
    return jsonify({'error': 'Invalid file format. Only PDF and DOCX files are allowed'}), 400

# --- New Resume Summary Endpoint ---
@app.route('/resume_summary', methods=['POST'])
def resume_summary():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        text = extract_text(filepath)
        os.remove(filepath)
        summary = extract_resume_summary(text)
        return jsonify({'filename': filename, 'summary': summary}), 200
    return jsonify({'error': 'Invalid file format. Only PDF and DOCX files are allowed'}), 400

# --- Flask App Run ---
# ...existing code...
if __name__ == "__main__":
    import os
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "False").lower() in ("1", "true")
    app.run(host=host, port=port, debug=debug)