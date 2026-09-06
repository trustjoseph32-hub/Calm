import re

with open('src/screens/SosInstruction.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<div className="flex-1 flex flex-col px-4 py-8 max-w-2xl mx-auto w-full min-h-screen">',
    '<div className="flex-1 flex flex-col px-4 py-4 sm:py-8 max-w-2xl mx-auto w-full h-full min-h-[100svh]">'
)

content = content.replace(
    '<header className="flex items-center mb-12">',
    '<header className="flex items-center mb-4 sm:mb-8">'
)

content = content.replace(
    '<button \n          onClick={() => navigate(\'/\')}\n          className="w-10 h-10',
    '<button \n          onClick={() => navigate(\'/\')}\n          className="w-8 h-8 sm:w-10 sm:h-10'
)

content = content.replace(
    '<ArrowLeft className="w-5 h-5 drop-shadow-md" />',
    '<ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow-md" />'
)

content = content.replace(
    '<h1 className="text-xl font-medium ml-2 text-neutral-100">',
    '<h1 className="text-lg sm:text-xl font-medium ml-2 sm:ml-4 text-neutral-100">'
)

content = content.replace(
    '<main className="flex-1 flex flex-col justify-center gap-12 max-w-md mx-auto w-full pb-12">',
    '<main className="flex-1 flex flex-col justify-center gap-4 sm:gap-8 max-w-md mx-auto w-full pb-4 sm:pb-8">'
)

content = content.replace(
    '<div className="text-4xl font-light text-neutral-500">1</div>',
    '<div className="text-2xl sm:text-4xl font-light text-neutral-500">1</div>'
)
content = content.replace(
    '<div className="text-4xl font-light text-neutral-500">2</div>',
    '<div className="text-2xl sm:text-4xl font-light text-neutral-500">2</div>'
)
content = content.replace(
    '<div className="text-4xl font-light text-neutral-500">3</div>',
    '<div className="text-2xl sm:text-4xl font-light text-neutral-500">3</div>'
)

content = content.replace(
    '<p className="text-2xl font-medium text-neutral-100 leading-tight">',
    '<p className="text-lg sm:text-2xl font-medium text-neutral-100 leading-tight">'
)

content = content.replace(
    '<div className="mt-auto pt-8 flex flex-col gap-6">',
    '<div className="mt-auto pt-2 sm:pt-6 flex flex-col gap-3 sm:gap-6">'
)

content = content.replace(
    '<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">',
    '<div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">'
)

content = content.replace(
    'className={`py-3 rounded-2xl',
    'className={`py-2 sm:py-3 rounded-xl sm:rounded-2xl'
)

content = content.replace(
    'className={`py-3 flex justify-center',
    'className={`py-2 sm:py-3 flex justify-center'
)

content = content.replace(
    '<button\n          onClick={handleStart}\n          className="w-full py-5 rounded-full',
    '<button\n          onClick={handleStart}\n          className="w-full py-3 sm:py-5 rounded-full mt-2 sm:mt-0'
)

with open('src/screens/SosInstruction.tsx', 'w') as f:
    f.write(content)
