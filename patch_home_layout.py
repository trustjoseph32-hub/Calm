import re

with open('src/screens/Home.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<div className="flex-1 flex flex-col items-center px-4 py-8 max-w-2xl mx-auto w-full min-h-screen">',
    '<div className="flex-1 flex flex-col items-center px-4 py-4 sm:py-8 max-w-2xl mx-auto w-full h-full min-h-[100svh]">'
)

content = content.replace(
    '<header className="w-full flex justify-between items-center mb-12">',
    '<header className="w-full flex justify-between items-center mb-4 sm:mb-12">'
)

# Header icons size reduction on mobile
content = content.replace(
    '<Logo className="w-9 h-9" />',
    '<Logo className="w-7 h-7 sm:w-9 sm:h-9" />'
)
content = content.replace(
    '<h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-br from-indigo-400 to-indigo-200 bg-clip-text text-transparent">',
    '<h1 className="text-xl sm:text-2xl font-semibold tracking-tight bg-gradient-to-br from-indigo-400 to-indigo-200 bg-clip-text text-transparent">'
)

# Progress & Settings button
content = content.replace(
    'className="w-10 h-10 rounded-full',
    'className="w-9 h-9 sm:w-10 sm:h-10 rounded-full'
)
content = content.replace(
    'w-5 h-5 drop-shadow-md',
    'w-4 h-4 sm:w-5 sm:h-5 drop-shadow-md'
)

# Main gap reduction
content = content.replace(
    '<main className="w-full flex-1 flex flex-col justify-center gap-6 pb-20">',
    '<main className="w-full flex-1 flex flex-col justify-center gap-3 sm:gap-6 pb-2 sm:pb-20">'
)

# Buttons padding and text sizes
content = content.replace(
    'p-8 rounded-[2rem]',
    'p-4 sm:p-8 rounded-3xl sm:rounded-[2rem]'
)
content = content.replace(
    'w-16 h-16 rounded-full',
    'w-12 h-12 sm:w-16 sm:h-16 rounded-full'
)
content = content.replace(
    'w-8 h-8 fill-red-100',
    'w-6 h-6 sm:w-8 sm:h-8 fill-red-100'
)
content = content.replace(
    'w-8 h-8 text-indigo-50',
    'w-6 h-6 sm:w-8 sm:h-8 text-indigo-50'
)
content = content.replace(
    'w-8 h-8 drop-shadow-md',
    'w-6 h-6 sm:w-8 sm:h-8 drop-shadow-md'
)

# Gap between icon and text
content = content.replace(
    'gap-6 relative z-10',
    'gap-4 sm:gap-6 relative z-10'
)

# Headings and paragraphs in buttons
content = content.replace(
    '<h3 className="text-2xl font-medium text-red-100">',
    '<h3 className="text-lg sm:text-2xl font-medium text-red-100">'
)
content = content.replace(
    '<p className="text-base text-red-200/70 mt-2">',
    '<p className="text-sm sm:text-base text-red-200/70 mt-1 sm:mt-2">'
)
content = content.replace(
    '<h3 className="text-2xl font-medium text-indigo-100">',
    '<h3 className="text-lg sm:text-2xl font-medium text-indigo-100">'
)
content = content.replace(
    '<p className="text-base text-indigo-200/70 mt-2">',
    '<p className="text-sm sm:text-base text-indigo-200/70 mt-1 sm:mt-2">'
)
content = content.replace(
    '<h3 className="text-2xl font-medium text-neutral-100">',
    '<h3 className="text-lg sm:text-2xl font-medium text-neutral-100">'
)
content = content.replace(
    '<p className="text-base text-neutral-500 mt-2">',
    '<p className="text-sm sm:text-base text-neutral-500 mt-1 sm:mt-2">'
)

with open('src/screens/Home.tsx', 'w') as f:
    f.write(content)
