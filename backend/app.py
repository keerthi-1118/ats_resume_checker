from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import PyPDF2
import docx
from collections import Counter
import re
import spacy
from spacy.matcher import Matcher

app = Flask(__name__)
# Enable CORS for all routes and origins, allowing credentials and all methods
CORS(
    app,
    resources={
        r"/*": {
            "origins": [
                "https://ats-resume-checker-zoit.vercel.app",
                "http://localhost:3000"
            ]
        }
    }
)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

ALLOWED_EXTENSIONS = {'pdf', 'docx'}
app.config['ALLOWED_EXTENSIONS'] = ALLOWED_EXTENSIONS

# --- NLP Model Initialization (Lazy Loading) ---
nlp = None
matcher = None

def get_nlp():
    global nlp, matcher
    if nlp is None:
        nlp = spacy.load("en_core_web_sm")
        matcher = Matcher(nlp.vocab)
        # Re-add patterns to the new matcher instance
        add_skill_patterns(matcher) 
    return nlp, matcher

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


def add_skill_patterns(matcher):
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

def extract_skills_with_ner_and_patterns(text):
    """Extracts skills from text using spaCy's NER and custom patterns."""
    nlp, matcher = get_nlp()
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
    # Patterns are now added via add_skill_patterns during get_nlp()
    # if "SKILL_PATTERN" in matcher:
    #     matcher.remove("SKILL_PATTERN")


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
def _is_section_header(line, keywords):
    """Return True when a stripped line is purely a section heading.
    A section heading is short (<= 6 words), matches one of the keywords,
    and contains no sentence-level punctuation (commas, periods mid-line, etc.)
    that would indicate it's a prose sentence.
    """
    stripped = line.strip()
    lower = stripped.lower()
    if not stripped:
        return False
    # Must be <= 6 words (headings are short)
    if len(stripped.split()) > 6:
        return False
    # Must contain at least one of the keywords
    if not any(kw in lower for kw in keywords):
        return False
    # Prose sentences usually have commas or mid-sentence periods
    if ',' in stripped:
        return False
    # If it ends with a colon it's definitely a heading
    if stripped.endswith(':'):
        return True
    # If it's all uppercase or title-case and short it's a heading
    if stripped.isupper() or stripped.istitle():
        return True
    # Otherwise accept it if it's very short (<=3 words)
    return len(stripped.split()) <= 3


def extract_resume_summary(text):
    summary = {}

    lines = text.split('\n')

    # Collapse all whitespace so emails split across PDF lines are joined
    collapsed = re.sub(r'\s+', ' ', text)

    # --- Name ---
    # Use the original lines so we don't pick up merged garbage from collapsed text
    SKIP_HEADERS = {
        'experience', 'education', 'skills', 'projects', 'certifications',
        'summary', 'objective', 'work experience', 'about', 'contact',
        'profile', 'references', 'languages', 'interests', 'hobbies'
    }
    name = None
    for line in lines:
        stripped = line.strip()
        if (stripped
                and len(stripped.split()) <= 4
                and stripped[0].isupper()
                and not any(ch.isdigit() for ch in stripped)
                and stripped.lower() not in SKIP_HEADERS):
            name = stripped
            break
    summary['name'] = name

    # --- Email ---
    # Find e-mail on its own line first (most reliable) then fall back to collapsed text.
    # The line-by-line approach avoids picking up a stray label char (e.g. the 'p'
    # from "Phone" that gets merged into the email in collapsed mode).
    EMAIL_RE = re.compile(r'[a-zA-Z0-9][a-zA-Z0-9_.+\-]*@[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)*\.[a-zA-Z]{2,}')
    email_found = None
    for line in lines:
        m = EMAIL_RE.search(line)
        if m:
            email_found = m.group(0)
            break
    if not email_found:
        # fallback: search collapsed but require the match to start after a space or start
        m = re.search(r'(?<!\w)' + EMAIL_RE.pattern, collapsed)
        if m:
            email_found = m.group(0)
    summary['email'] = email_found

    # --- Phone ---
    phone_match = re.search(
        r'(\+?\d{1,3}[\s\-]?)?(\(?\d{3}\)?[\s\-]?)?\d{3}[\s\-]?\d{4}',
        text
    )
    summary['phone'] = phone_match.group(0).strip() if phone_match else None

    # --- LinkedIn / GitHub / Portfolio ---
    linkedin_match = re.search(
        r'(?:https?://)?(?:www\.)?linkedin\.com/in/[a-zA-Z0-9_\-]+',
        collapsed, re.IGNORECASE
    )
    summary['linkedin'] = linkedin_match.group(0) if linkedin_match else None

    github_match = re.search(
        r'(?:https?://)?(?:www\.)?github\.com/[a-zA-Z0-9_\-]+',
        collapsed, re.IGNORECASE
    )
    summary['github'] = github_match.group(0) if github_match else None

    portfolio_match = re.search(
        r'(?:https?://)[a-zA-Z0-9_\-]+\.[a-zA-Z]{2,}(?:/[^\s]*)?',
        collapsed, re.IGNORECASE
    )
    # Only store portfolio if it's not already linkedin/github
    if portfolio_match:
        url = portfolio_match.group(0)
        if 'linkedin' not in url.lower() and 'github' not in url.lower():
            summary['portfolio'] = url
        else:
            summary['portfolio'] = None
    else:
        summary['portfolio'] = None

    # --- Address ---
    address = None
    for line in lines:
        if any(word in line.lower() for word in [
            'street', 'st.', 'road', 'rd.', 'ave', 'block',
            'city', 'state', 'zip', 'pincode', 'village', 'district'
        ]) and any(char.isdigit() for char in line):
            address = line.strip()
            break
    summary['address'] = address

    # ----------------------------------------------------------------
    # Section parsing — uses _is_section_header() so prose sentences
    # that merely mention "experience" / "project" never open a section.
    # Pattern: when we detect a header we set the flag and SKIP that line
    #          (continue before any append). When we detect the NEXT
    #          section header we close the current section and also skip
    #          that line. Content lines are only added when we're inside
    #          the section AND the line is non-empty AND not a header.
    # ----------------------------------------------------------------
    EXP_HDRS  = ['experience', 'work experience', 'employment', 'work history', 'internship']
    PROJ_HDRS = ['project', 'projects', 'personal projects', 'key projects']
    CERT_HDRS = ['certification', 'certifications', 'certificate', 'certificates',
                 'courses', 'awards', 'achievements']
    ANY_SECTION = EXP_HDRS + PROJ_HDRS + CERT_HDRS + [
        'education', 'skills', 'technical skills', 'summary', 'objective',
        'about', 'languages', 'hobbies', 'interests', 'references', 'volunteer'
    ]

    # --- Projects ---
    projects = []
    tech_stack = []
    in_projects = False
    for line in lines:
        stripped = line.strip()
        if not stripped:
            in_projects = False if in_projects and not stripped else in_projects
            continue
        lower = stripped.lower()
        if not in_projects:
            if _is_section_header(stripped, PROJ_HDRS):
                in_projects = True
            continue  # skip every line until we're inside a section
        # ---- we ARE inside projects ----
        if _is_section_header(stripped, ANY_SECTION):
            in_projects = False
            continue  # skip this header
        projects.append(stripped)
        for skill in COMMON_SKILLS:
            if skill.lower() in lower and skill not in tech_stack:
                tech_stack.append(skill)
    summary['projects'] = projects
    summary['tech_stack'] = tech_stack

    # --- Work Experience ---
    work_exp = []
    in_exp = False
    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
        if not in_exp:
            if _is_section_header(stripped, EXP_HDRS):
                in_exp = True
            continue  # skip every line until we enter the section
        # ---- we ARE inside work experience ----
        if _is_section_header(stripped, ANY_SECTION):
            in_exp = False
            continue  # skip this header
        work_exp.append(stripped)
    summary['work_experience'] = work_exp

    # --- Certifications ---
    certifications = []
    in_cert = False
    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
        if not in_cert:
            if _is_section_header(stripped, CERT_HDRS):
                in_cert = True
            continue  # skip every line until we enter the section
        # ---- we ARE inside certifications ----
        if _is_section_header(stripped, ANY_SECTION):
            in_cert = False
            continue  # skip this header
        certifications.append(stripped)
    summary['certifications'] = certifications

    return summary

# --- Flask Routes ---
@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'ATS Backend is running'}), 200

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
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
            try:
                text = extract_text(filepath)
            finally:
                if os.path.exists(filepath):
                    os.remove(filepath)
            
            analysis_results = analyze_resume(text, job_description)
            return jsonify({'filename': filename, 'analysis': analysis_results}), 200
        return jsonify({'error': 'Invalid file format. Only PDF and DOCX files are allowed'}), 400
    except Exception as e:
        print(f"Error in analyze route: {str(e)}")
        # Log the full traceback if possible in a real app
        return jsonify({'error': f"Internal Server Error: {str(e)}"}), 500

@app.route('/resume_summary', methods=['POST'])
def resume_summary():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            try:
                text = extract_text(filepath)
            finally:
                if os.path.exists(filepath):
                    os.remove(filepath)

            # Extract structured summary using the helper function
            summary_data = extract_resume_summary(text)
            
            return jsonify({'summary': summary_data}), 200
        return jsonify({'error': 'Invalid file format'}), 400
    except Exception as e:
        print(f"Error in resume_summary: {str(e)}")
        return jsonify({'error': f"Internal Server Error: {str(e)}"}), 500





if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
