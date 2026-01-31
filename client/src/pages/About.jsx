import React from "react";
import { motion } from "motion/react";
import { BookOpen, Users, Award, Target, Heart, Zap } from "lucide-react";
import Navbar from "../components/Navbar";

const About = () => {
  const stats = [
    { label: "Active Students", value: "10,000+", icon: Users },
    { label: "Expert Instructors", value: "500+", icon: Award },
    { label: "Courses Available", value: "1,200+", icon: BookOpen },
    { label: "Countries Reached", value: "50+", icon: Target },
  ];

  const values = [
    {
      icon: Heart,
      title: "Student-Centered",
      description:
        "We prioritize your learning journey and success above all else.",
    },
    {
      icon: Zap,
      title: "Innovation",
      description:
        "Cutting-edge technology and modern teaching methods drive our platform.",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "We maintain the highest standards in course quality and instructor expertise.",
    },
  ];

  const team = [
    {
      name: "Abhishek Bhatia",
      role: "Founder",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Akshit Mittal",
      role: "Founder",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Amjad Mishal",
      role: "Founder",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Aditya",
      role: "Founder",
      image: "https://via.placeholder.com/150",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-bold mb-6"
          >
            About Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl max-w-3xl mx-auto"
          >
            Empowering learners worldwide with accessible, high-quality
            education that transforms lives and careers.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center mb-8 text-gray-800"
          >
            Our Mission
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-600 leading-relaxed text-center"
          >
            We believe education should be accessible to everyone, everywhere.
            Our mission is to provide a comprehensive learning platform that
            connects passionate instructors with eager learners, creating a
            global community dedicated to knowledge sharing and personal growth.
            Through innovative technology and expert-curated content, we're
            breaking down barriers to education and opening doors to new
            opportunities.
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition"
                >
                  <Icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-gray-600">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center mb-12 text-gray-800"
          >
            Our Core Values
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15, duration: 0.5 }}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
                >
                  <Icon className="w-10 h-10 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-4">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center mb-12 text-gray-800"
          >
            Meet Our Team
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    {member.name}
                  </h3>
                  <p className="text-blue-600">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-6"
          >
            Join Our Learning Community
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl mb-8 max-w-2xl mx-auto"
          >
            Start your learning journey today and unlock your potential with
            thousands of courses taught by industry experts.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition"
          >
            Get Started
          </motion.button>
        </div>
      </section>
    </>
  );
};

export default About;
