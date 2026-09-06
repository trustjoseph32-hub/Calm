with open('src/screens/SynchronizedEngine.tsx', 'r') as f:
    content = f.read()

import re

# Fix syntax
content = content.replace("        </div>\n      )}}", "        </div>\n      )}")

with open('src/screens/SynchronizedEngine.tsx', 'w') as f:
    f.write(content)
print("Syntax fixed")
