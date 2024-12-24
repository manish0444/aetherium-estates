import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        className="flex justify-between items-center w-full py-6 px-4 text-left hover:bg-gray-50 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium text-gray-900">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      <div
        className={`px-4 overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-96 py-4' : 'max-h-0'
        }`}
      >
        <p className="text-gray-600">{answer}</p>
      </div>
    </div>
  );
};

const FAQPage = () => {
  const faqs = [
    {
      question: "What services does NepalNiwas provide?",
      answer: "NepalNiwas offers comprehensive real estate services including property buying, selling, renting, and investment consultation across Nepal. We specialize in residential, commercial, and land properties."
    },
    {
      question: "How can I list my property on NepalNiwas?",
      answer: "Listing your property is simple! You can either use our online submission form, contact our agents directly, or visit our nearest office. Our team will guide you through the process and ensure your property gets maximum visibility."
    },
    {
      question: "What areas do you cover in Nepal?",
      answer: "We operate across major cities in Nepal including Kathmandu, Pokhara, Chitwan, and Biratnagar. Our extensive network allows us to serve clients throughout the country."
    },
    {
      question: "How do you determine property values?",
      answer: "Our property valuation process considers multiple factors including location, property condition, market trends, nearby amenities, and recent comparable sales in the area. We use both traditional methods and modern data analytics tools."
    },
    {
      question: "What documents do I need to buy/sell property?",
      answer: "Required documents typically include citizenship certificate, property ownership certificates (lalpurja), tax clearance certificates, and relationship verification documents. Our team will provide a detailed checklist based on your specific case."
    },
    {
      question: "Do you help with property documentation and legal processes?",
      answer: "Yes, we provide end-to-end assistance with property documentation and legal processes. Our legal experts ensure all transactions are compliant with Nepal's real estate laws and regulations."
    },
    {
      question: "What are your service charges?",
      answer: "Our service charges vary depending on the type of service and property value. We maintain transparent pricing and provide detailed breakdowns of all costs involved. Contact us for a customized quote."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Find answers to common questions about NepalNiwas real estate services
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Still have questions? We're here to help!
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;