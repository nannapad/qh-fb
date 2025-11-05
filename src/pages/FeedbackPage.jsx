import React, { useState } from 'react';
import { FiMail, FiMessageSquare, FiSend } from 'react-icons/fi';

const FeedbackPage = () => {
  const [formData, setFormData] = useState({
    contact: '',
    subject: '',
    details: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock submission
    console.log('Feedback submitted:', formData);
    setSubmitted(true);
    // Reset form after submission
    setFormData({ contact: '', subject: '', details: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Share Your Feedback
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Help us improve Quick Help by sharing your thoughts and suggestions.
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-12">
            <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 px-4 py-3 rounded-md">
              <p className="text-lg font-medium">Thank you for your feedback!</p>
              <p className="text-sm mt-1">We'll review it and get back to you if needed.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact Information (Optional)
              </label>
              <div className="relative">
                <input
                  id="contact"
                  name="contact"
                  type="text"
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder="Email or phone number"
                />
                <FiMail
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject
              </label>
              <div className="relative">
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder="Brief description of your feedback"
                  required
                />
                <FiMessageSquare
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>

            {/* Details */}
            <div>
              <label htmlFor="details" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Details
              </label>
              <textarea
                id="details"
                name="details"
                rows={6}
                value={formData.details}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-vertical"
                placeholder="Please provide detailed feedback..."
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex items-center justify-center"
            >
              <FiSend size={18} className="mr-2" />
              Submit Feedback
            </button>
          </form>
        )}

        {/* Contact Info */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Alternative Contact
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            You can also reach us at{' '}
            <a
              href="mailto:feedback@quickhelp.com"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              feedback@quickhelp.com
            </a>{' '}
            or follow us on social media for updates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
