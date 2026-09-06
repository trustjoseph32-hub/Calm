with open('src/screens/PracticeEngine.tsx', 'r') as f:
    content = f.read()

content = content.replace("  const [sessionState, setSessionState] = useState<SessionState>('countdown');", "  const isSOS = location.state?.isSOS || false;\n  const [sessionState, setSessionState] = useState<SessionState>('countdown');")

with open('src/screens/PracticeEngine.tsx', 'w') as f:
    f.write(content)
