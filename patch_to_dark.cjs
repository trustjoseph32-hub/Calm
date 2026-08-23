const fs = require('fs');
const path = require('path');

function replaceClasses(code) {
  // First, protect primary buttons which are "bg-neutral-900 text-white" by mapping them to a temp string
  code = code.replace(/bg-neutral-900 text-white/g, "__PRIMARY_BTN__");
  code = code.replace(/bg-neutral-800 text-white/g, "__PRIMARY_BTN_HOVER__"); // for settings/setup active buttons
  code = code.replace(/hover:bg-neutral-800/g, "__HOVER_PRIMARY__");
  
  // Also protect the gradient in PracticeEngine
  code = code.replace(/bg-gradient-to-br from-neutral-100 to-neutral-50/g, "bg-gradient-to-br from-neutral-900 to-neutral-800");

  // Colors
  const mappings = {
    // Backgrounds
    "bg-neutral-50": "bg-neutral-900",
    "bg-white": "bg-neutral-800",
    "bg-neutral-100": "bg-neutral-700",
    "bg-neutral-200": "bg-neutral-700",
    
    // Transparent backgrounds
    "bg-white/90": "bg-neutral-900/90",
    "bg-white/95": "bg-neutral-900/95",
    "bg-white/50": "bg-neutral-800/50",
    
    // Text colors
    "text-neutral-900": "text-white",
    "text-neutral-800": "text-neutral-100",
    "text-neutral-700": "text-neutral-300",
    "text-neutral-600": "text-neutral-400",
    "text-neutral-500": "text-neutral-400",
    "text-neutral-400": "text-neutral-500",
    "text-neutral-300": "text-neutral-500", // maybe from previous?
    
    // Borders
    "border-neutral-100": "border-neutral-700",
    "border-neutral-200": "border-neutral-700",
    "border-neutral-300": "border-neutral-600",
    
    // Hovers
    "hover:border-neutral-200": "hover:border-neutral-600",
    "hover:border-neutral-300": "hover:border-neutral-500",
    "hover:border-neutral-400": "hover:border-neutral-400",
    "hover:bg-neutral-100": "hover:bg-neutral-700",
    "hover:bg-neutral-200": "hover:bg-neutral-600",
    "hover:bg-white": "hover:bg-neutral-700",
    "hover:text-neutral-800": "hover:text-white",
    "hover:text-neutral-900": "hover:text-white",
  };

  for (const [light, dark] of Object.entries(mappings)) {
    const re = new RegExp(`(?<!-)\\b${light.replace(/\//g, '\\/')}\\b`, 'g');
    code = code.replace(re, dark);
  }

  // Restore and invert protected buttons (Primary buttons in dark mode: white background, black text)
  code = code.replace(/__PRIMARY_BTN__/g, "bg-white text-neutral-900");
  code = code.replace(/__PRIMARY_BTN_HOVER__/g, "bg-neutral-200 text-neutral-900");
  code = code.replace(/__HOVER_PRIMARY__/g, "hover:bg-neutral-200");

  // Some specific SOS colors adjustments
  code = code.replace(/bg-red-50/g, "bg-red-950/30");
  code = code.replace(/border-red-100/g, "border-red-900/50");
  code = code.replace(/hover:border-red-200/g, "hover:border-red-800/50");
  code = code.replace(/text-red-900/g, "text-red-100");
  code = code.replace(/text-red-700\/70/g, "text-red-200/70");

  // Instruction specific blue
  code = code.replace(/bg-blue-50/g, "bg-blue-950/30");
  code = code.replace(/text-blue-600/g, "text-blue-400");
  
  // Specific fix for the range input accent
  code = code.replace(/accent-neutral-800/g, "accent-neutral-200");
  
  // Focus ring
  code = code.replace(/focus:border-neutral-400/g, "focus:border-neutral-500");

  return code;
}

const files = fs.readdirSync('src/screens').map(f => path.join('src/screens', f));
files.push('src/App.tsx');

for (const file of files) {
  if (file.endsWith('.tsx')) {
    let content = fs.readFileSync(file, 'utf8');
    content = replaceClasses(content);
    fs.writeFileSync(file, content);
  }
}
