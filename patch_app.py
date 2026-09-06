import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Remove Settings import
content = re.sub(r"import \{ Settings \} from '\./screens/Settings';\n", "", content)

# Remove the Settings route
content = re.sub(r"\s*<Route path=\"/settings\" element=\{<Settings />\} />", "", content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
print("Removed Settings from App.tsx")
