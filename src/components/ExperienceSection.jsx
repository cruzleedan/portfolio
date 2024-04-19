// ExperienceSection.js
import React from "react";

const ExperienceSection = () => {
  const experiences = [
    {
      id: 1,
      title: "Software Engineer Intern",
      company: "ABC Company",
      duration: "June 2021 - August 2021",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.",
    },
    // Add more experiences as needed
  ];

  return (
    <section id="experience" className="py-24">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Experience</h2>
          <p className="text-lg">
            Here are some of my previous work experiences:
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-8">
          {experiences.map((experience) => (
            <div key={experience.id} className="mb-8">
              <h3 className="text-xl font-semibold">{experience.title}</h3>
              <p className="text-gray-600">
                {experience.company} | {experience.duration}
              </p>
              <p>{experience.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
