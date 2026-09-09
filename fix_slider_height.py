import re

with open('src/screens/Course.tsx', 'r') as f:
    content = f.read()

# Let's also adjust the card body padding on mobile
target_card_body = """            <div className={`flex flex-col h-full bg-neutral-900 border transition-all ${
              isCurrent 
                ? 'border-neutral-800 shadow-md' 
                : isAvailable 
                  ? 'border-neutral-700 hover:border-neutral-600 shadow-sm' 
                  : 'border-neutral-700 opacity-60'
            }`}>"""

replacement_card_body = """            <div className={`flex flex-col h-full bg-neutral-900 border transition-all rounded-xl p-5 sm:p-6 ${
              isCurrent 
                ? 'border-neutral-800 shadow-md' 
                : isAvailable 
                  ? 'border-neutral-700 hover:border-neutral-600 shadow-sm' 
                  : 'border-neutral-700 opacity-60'
            }`}>"""

if target_card_body in content:
    content = content.replace(target_card_body, replacement_card_body)
    print("Replaced card body classes")
else:
    print("Failed to replace card body classes")
    
# Remove double padding that might be present due to earlier changes or standard card classes
target_card_outer = """            <div 
              className={`p-6 rounded-xl border ${
                isCurrent 
                  ? 'border-neutral-800 shadow-md' 
                  : isAvailable 
                    ? 'border-neutral-700 hover:border-neutral-600 shadow-sm' 
                    : 'border-neutral-700 opacity-60'
              }`}
            >"""
            
replacement_card_outer = """            <div 
              className={`p-5 sm:p-6 rounded-xl border ${
                isCurrent 
                  ? 'border-neutral-800 shadow-md' 
                  : isAvailable 
                    ? 'border-neutral-700 hover:border-neutral-600 shadow-sm' 
                    : 'border-neutral-700 opacity-60'
              }`}
            >"""
            
if target_card_outer in content:
    content = content.replace(target_card_outer, replacement_card_outer)
    print("Replaced outer card classes")

with open('src/screens/Course.tsx', 'w') as f:
    f.write(content)
