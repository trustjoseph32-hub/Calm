with open('src/components/Logo.tsx', 'r') as f:
    content = f.read()

content = content.replace("duration: 4,", "duration: 8,")

with open('src/components/Logo.tsx', 'w') as f:
    f.write(content)
print("Logo speed updated")
