const fs = require('fs');
let code = fs.readFileSync('src/screens/Instruction.tsx', 'utf8');

// Section 1 intro
const introOld = `Calm Motion объединяет дыхательные упражнения и билатеральную стимуляцию (основанную на принципах EMDR) для быстрого снижения тревоги и стресса.`;
const introNew = `Приложение использует дыхание, grounding, ритмическое движение и элементы билатеральной стимуляции. Это не является самостоятельной EMDR/ДПДГ-терапией и не предполагает самостоятельную переработку травматических воспоминаний.`;
code = code.replace(introOld, introNew);

// Remove list sequence about recalling stress
const listOld = `<li className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center shrink-0 font-medium text-neutral-300">1</div>
              <div>
                <strong className="text-neutral-200 block mb-1">Сфокусируйтесь на эмоции</strong>
                <span className="text-neutral-500">Вспомните ситуацию, которая вызывает тревогу. Оцените уровень напряжения от 0 до 10. Постарайтесь найти физическое ощущение в теле, связанное с этой эмоцией.</span>
              </div>
            </li>`;
const listNew = `<li className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center shrink-0 font-medium text-neutral-300">1</div>
              <div>
                <strong className="text-neutral-200 block mb-1">Оцените состояние</strong>
                <span className="text-neutral-500">Отметьте уровень своего текущего напряжения перед началом практики.</span>
              </div>
            </li>`;
code = code.replace(listOld, listNew);

// Fix EMDR section
const emdrTitleOld = `Движение глаз (EMDR)`;
const emdrTitleNew = `Ритмическое движение`;
code = code.replace(emdrTitleOld, emdrTitleNew);

const emdrBodyOld = `В синхронной практике следите взглядом за движущимся шариком. Старайтесь не двигать головой, используйте только глаза. Это движение (из стороны в сторону) помогает мозгу переработать стрессовую информацию и снизить эмоциональный заряд тревожных мыслей.`;
const emdrBodyNew = `Следи за точкой только в комфортной амплитуде. Не нужно напрягать глаза или доводить движение до боли. Дыши мягко и без усилия. Если заданный ритм неудобен, дыши в своём темпе. Ритмическое движение может помогать переключать внимание и снижать субъективное напряжение у некоторых людей.`;
code = code.replace(emdrBodyOld, emdrBodyNew);

// Add safety section
const safetySection = `
        <section className="bg-neutral-800 p-6 sm:p-8 rounded-3xl shadow-sm border border-neutral-700">
          <div className="w-12 h-12 rounded-full bg-gradient-to-b from-red-400 via-red-600 to-red-800 flex items-center justify-center mb-6 border border-red-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(220,38,38,0.4)] text-red-50 drop-shadow-md">
            <Activity className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-medium text-neutral-100 mb-6">
            Безопасность
          </h2>
          <ul className="space-y-4 text-neutral-500 leading-relaxed list-disc pl-5">
            <li>Не используйте приложение во время управления автомобилем или выполнения действий, требующих внимания.</li>
            <li>Не продолжайте движение глаз при боли, головокружении, тошноте или ухудшении самочувствия.</li>
            <li>При проблемах со зрением, выраженной чувствительности к движению или неврологических заболеваниях используйте режим без движения и обсудите практику со специалистом.</li>
            <li>Приложение не предназначено для самостоятельной работы с травматическими воспоминаниями.</li>
            <li>Не изменяйте назначенное лечение или препараты на основании рекомендаций приложения.</li>
            <li>Если симптомы возникли впервые, отличаются от обычных, сопровождаются сильной болью в груди, потерей сознания, выраженной одышкой или другими необычными проявлениями — необходима медицинская оценка.</li>
          </ul>
        </section>`;

code = code.replace('</main>', safetySection + '\n      </main>');

fs.writeFileSync('src/screens/Instruction.tsx', code);
console.log("Patched Instruction.tsx");
