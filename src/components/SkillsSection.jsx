// SkillsSection.js
import React from "react";

const SkillsSection = () => {
  const skills = [
    "JavaScript",
    "React",
    "Angular",
    "HTML",
    "CSS",
    "Tailwind CSS",
    // Add more skills as needed
  ];

  return (
    <section id="skills" className="py-24">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Skills</h2>
        <p className="text-lg mb-8">
          Here are some of the skills and technologies I'm proficient in:
        </p>
      </div>
      <div className="flex flex-wrap justify-center">
        {skills.map((skill) => (
          <div
            key={skill}
            className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 m-2 rounded-lg"
          >
            {skill}
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;
