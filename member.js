function skillsMember(): void {
  const member = {
    name: 'John Doe',
    age: 30,
    skills: ['JavaScript', 'TypeScript', 'Angular', 'React', 'Vue'],
  };

  const { name, age, skills } = member;

  console.log(name); // John Doe
  console.log(age); // 30
  console.log(skills); // ['JavaScript', 'TypeScript', 'Angular', 'React', 'Vue']
}