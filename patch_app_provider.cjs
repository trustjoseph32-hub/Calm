const fs = require('fs');
let code = fs.readFileSync('src/store/AppProvider.tsx', 'utf8');

const targetStr1 = `  const saveCheckin = (checkin: import('../types').DailyCheckin) => {
    setState((prev) => ({
      ...prev,
      checkins: [...(prev.checkins || []), checkin],
    }));
  };`;

const replacement1 = `  const saveCheckin = (checkin: import('../types').DailyCheckin) => {
    setState((prev) => ({
      ...prev,
      checkins: [...(prev.checkins || []), checkin],
    }));
  };

  const updateCourseTodayState = (updates: Partial<NonNullable<import('../types').CourseProgress['todayState']>>) => {
    setState((prev) => ({
      ...prev,
      courseProgress: {
        ...prev.courseProgress,
        todayState: {
          ...(prev.courseProgress.todayState || {
            practiceStatus: 'not_started',
            checkinCompleted: false,
            eveningCheckinCompleted: false
          }),
          ...updates
        }
      }
    }));
  };`;

const targetStr2 = `        saveCheckin,
      }}
    >
      {children}
    </AppContext.Provider>`;

const replacement2 = `        saveCheckin,
        updateCourseTodayState,
      }}
    >
      {children}
    </AppContext.Provider>`;

code = code.replace(targetStr1, replacement1);
code = code.replace(targetStr2, replacement2);

fs.writeFileSync('src/store/AppProvider.tsx', code);
console.log("Patched AppProvider.tsx");
