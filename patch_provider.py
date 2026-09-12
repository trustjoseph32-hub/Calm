import re

with open('src/store/AppProvider.tsx', 'r') as f:
    content = f.read()

# Add to AppContextType
if "updateCourseProfile:" not in content:
    content = content.replace(
        "updateCourseTodayState: (updates: Partial<NonNullable<import('../types').CourseProgress['todayState']>>) => void;",
        "updateCourseTodayState: (updates: Partial<NonNullable<import('../types').CourseProgress['todayState']>>) => void;\n  updateCourseProfile: (updates: Partial<import('../types').CourseProfile>) => void;"
    )

# Add to initialState
if "courseProfile:" not in content:
    content = content.replace(
        "courseProgress: {",
        """courseProfile: {
    anxietyPattern: null,
    patternScores: { body: 0, worry: 0 },
    mechanicExperience: {
      regulation: false,
      orientation: false,
      defusion: false,
      somaticObserve: false,
      attentionTraining: false
    }
  },
  courseProgress: {"""
    )

# Add updateCourseProfile function
if "const updateCourseProfile =" not in content:
    func = """  const updateCourseProfile = (updates: Partial<import('../types').CourseProfile>) => {
    setState((prev) => ({
      ...prev,
      courseProfile: {
        ...(prev.courseProfile || initialState.courseProfile!),
        ...updates,
      }
    }));
  };

  return ("""
    content = content.replace("  return (", func)

# Add to context value
if "updateCourseProfile," not in content:
    content = content.replace(
        "updateCourseTodayState,",
        "updateCourseTodayState,\n        updateCourseProfile,"
    )

# Update state migration logic inside setState initial func
migration_str = """          courseProgress: {
            ...initialState.courseProgress,
            ...(parsed.courseProgress || {})
          }"""
new_migration_str = """          courseProgress: {
            ...initialState.courseProgress,
            ...(parsed.courseProgress || {})
          },
          courseProfile: {
            ...initialState.courseProfile,
            ...(parsed.courseProfile || {})
          }"""
content = content.replace(migration_str, new_migration_str)

with open('src/store/AppProvider.tsx', 'w') as f:
    f.write(content)

print("Updated AppProvider.tsx")
