import re

with open('src/screens/Course.tsx', 'r') as f:
    content = f.read()

# Check how days are rendered. We might have a DAYS array or they are hardcoded.
