import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Clock,
  Globe,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import axiosPublic from "../api/axiosPublic";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // form submit will use axiosInstance

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axiosPublic.post("/contact", formData);
      setIsSubmitted(true);
      toast.success("Message sent successfully");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to send message");
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: "support@learnify.com",
      description: "Send us an email anytime",
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "+1 (555) 123-4567",
      description: "Mon-Fri from 8am to 6pm",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: "123 Learning Street, Education City",
      description: "Come say hello at our office",
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: "Mon - Fri: 9:00 AM - 6:00 PM",
      description: "We're here to help you",
    },
  ];

  const features = [
    {
      icon: MessageSquare,
      title: "24/7 Support",
      description:
        "Get help whenever you need it with our round-the-clock support team.",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description:
        "Connect with us from anywhere in the world, we're always available.",
    },
    {
      icon: CheckCircle,
      title: "Quick Response",
      description: "We typically respond to all inquiries within 24 hours.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white overflow-hidden py-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto"
          >
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </motion.p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border border-slate-200"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-100 rounded-xl mb-4">
                    <Icon className="w-7 h-7 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {info.title}
                  </h3>
                  <p className="text-indigo-600 font-semibold mb-1">
                    {info.details}
                  </p>
                  <p className="text-gray-600 text-sm">{info.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form and Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Send Us a Message
              </h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and our team will get back to you within
                24 hours.
              </p>

              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6 flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>
                    Message sent successfully! We'll get back to you soon.
                  </span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-lg ${
                    isLoading
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                  }`}
                >
                  <Send className="w-5 h-5" />
                  {isLoading ? "Sending..." : "Send Message"}
                </motion.button>
              </form>
            </motion.div>

            {/* Features Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Why Contact Us?
                </h2>
                <p className="text-gray-600 mb-8">
                  We're committed to providing exceptional support and
                  assistance to all our learners.
                </p>
              </div>

              <div className="space-y-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.15, duration: 0.5 }}
                      className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl flex-shrink-0">
                          <Icon className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Additional Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-8 rounded-2xl shadow-xl"
              >
                <h3 className="text-2xl font-bold mb-3">
                  Need Immediate Help?
                </h3>
                <p className="text-indigo-100 mb-4">
                  Check out our comprehensive FAQ section or browse through our
                  help center for instant answers.
                </p>
                <button className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition-all">
                  Visit Help Center
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Find Us Here
            </h2>
            <p className="text-xl text-gray-600">
              Visit our office or connect with us online
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl h-96 flex items-center justify-center shadow-lg"
          >
            <div className="text-center">
              <MapPin className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                Map Integration Placeholder
              </p>
              <p className="text-gray-500 text-sm mt-2">
                123 Learning Street, Education City
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
