import re

with open('src/screens/SynchronizedEngine.tsx', 'r') as f:
    content = f.read()

# Extract handleRoundComplete
handle_match = re.search(r'(  const handleRoundComplete = useCallback\(\(\) => \{.*?\n  \}, \[.*?\]\);\n)', content, re.DOTALL)
handle_code = handle_match.group(1)

# Remove it from its current position
content = content.replace(handle_code, '')

# Find useEffect for animate
animate_match = re.search(r'(  // Main animation loop\n  useEffect\(\(\) => \{)', content)
animate_pos = animate_match.start()

# Insert before useEffect
content = content[:animate_pos] + handle_code + '\n' + content[animate_pos:]

with open('src/screens/SynchronizedEngine.tsx', 'w') as f:
    f.write(content)
