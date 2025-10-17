#!/usr/bin/env bash
set -e
pip install --upgrade pip
pip --default-timeout=300 install -r requirements.txt

# install spaCy model wheel that matches spacy version in requirements.txt
pip --default-timeout=300 install https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.6.0/en_core_web_sm-3.6.0-py3-none-any.whl

# pre-cache sentence-transformers model during build to avoid runtime download
python - <<'PY'
from sentence_transformers import SentenceTransformer
SentenceTransformer('all-MiniLM-L6-v2')
print("sentence-transformers cached")
PY