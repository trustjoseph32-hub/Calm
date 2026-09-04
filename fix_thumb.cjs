const fs = require('fs');
let code = fs.readFileSync('src/screens/Checkin.tsx', 'utf8');

const thumbStylesStr = "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-gradient-to-b [&::-webkit-slider-thumb]:from-gray-100 [&::-webkit-slider-thumb]:to-gray-300 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white/50 [&::-webkit-slider-thumb]:shadow-[0_2px_5px_rgba(0,0,0,0.5),inset_0_-2px_4px_rgba(0,0,0,0.2)] [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-gradient-to-b [&::-moz-range-thumb]:from-gray-100 [&::-moz-range-thumb]:to-gray-300 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-white/50 [&::-moz-range-thumb]:shadow-[0_2px_5px_rgba(0,0,0,0.5),inset_0_-2px_4px_rgba(0,0,0,0.2)]";

code = code.replace(
  "className={`w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer ${thumbStyles}`}",
  "className={`w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer " + thumbStylesStr + "`}"
);

fs.writeFileSync('src/screens/Checkin.tsx', code);
console.log("Fixed thumbStyles variable error");
