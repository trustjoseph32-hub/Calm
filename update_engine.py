import re

with open('src/screens/SynchronizedEngine.tsx', 'r') as f:
    content = f.read()

# 1. Update EngineState type
content = content.replace("  | 'PAUSED'\n  | 'QUICK_FINISH';", "  | 'PAUSED';")

# 2. Update the Controls overlay condition and button
content = content.replace("engineState !== 'SAFE_CLOSING' && engineState !== 'QUICK_FINISH' && (", "engineState !== 'SAFE_CLOSING' && (")
content = content.replace("onClick={() => setEngineState('QUICK_FINISH')}", "onClick={() => { audioRef.current?.stopAll(); setEngineState('SOS_OUTRO'); }}")

# 3. Remove the QUICK_FINISH screen block
quick_finish_pattern = r"\s*\{engineState === 'QUICK_FINISH' && \(\s*<motion\.div key=\"quick_finish\"(.*?)</motion\.div>\s*\)\}"
content = re.sub(quick_finish_pattern, "", content, flags=re.DOTALL)

with open('src/screens/SynchronizedEngine.tsx', 'w') as f:
    f.write(content)
print("Updated successfully")
