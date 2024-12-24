import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const TermsAndConditions = () => {
  const lastUpdated = "November 8, 2024";

  const sections = [
    {
      title: "1. Introduction",
      content: [
        "Welcome to NepalNiwas. These Terms and Conditions govern your use of NepalNiwas's website and services located at [website URL]. By accessing or using our services, you agree to be bound by these terms.",
        "NepalNiwas is a real estate platform that connects property buyers, sellers, and renters in Nepal. We provide digital tools and services to facilitate real estate transactions and property management."
      ]
    },
    {
      title: "2. Definitions",
      content: [
        "'Platform' refers to the NepalNiwas website and all related services",
        "'User' refers to any individual or entity accessing or using our services",
        "'Property Listing' refers to any real estate advertisement or property information posted on our platform",
        "'Agent' refers to registered real estate agents and brokers on our platform"
      ]
    },
    {
      title: "3. User Registration and Account",
      content: [
        "Users must be at least 18 years old to create an account",
        "Users must provide accurate and complete information during registration",
        "Users are responsible for maintaining the confidentiality of their account credentials",
        "Users must notify us immediately of any unauthorized access to their account"
      ]
    },
    {
      title: "4. Property Listings",
      content: [
        "All property listings must be accurate and truthful",
        "Users must have legal authority to list properties",
        "NepalNiwas reserves the right to remove any listing that violates our policies",
        "Property images must be authentic and current",
        "Pricing information must be accurate and updated regularly"
      ]
    },
    {
      title: "5. Privacy and Data Protection",
      content: [
        "We collect and process user data in accordance with our Privacy Policy",
        "Users' personal information is protected and handled securely",
        "We comply with all applicable data protection laws of Nepal",
        "Users can request access to their personal data at any time"
      ]
    },
    {
      title: "6. Payment Terms",
      content: [
        "All fees are clearly displayed before any transaction",
        "Payment methods accepted include major credit cards and digital wallets",
        "Refunds are processed according to our Refund Policy",
        "Service fees are non-refundable unless otherwise stated"
      ]
    },
    {
      title: "7. User Conduct",
      content: [
        "Users must not engage in fraudulent activities",
        "Harassment of other users is strictly prohibited",
        "Users must not post false or misleading information",
        "Spam and unauthorized advertising are not allowed"
      ]
    },
    {
      title: "8. Intellectual Property",
      content: [
        "All content on NepalNiwas is protected by copyright laws",
        "Users retain ownership of their submitted content",
        "Users grant NepalNiwas license to use submitted content for platform purposes",
        "Unauthorized use of our intellectual property is prohibited"
      ]
    },
    {
      title: "9. Limitation of Liability",
      content: [
        "NepalNiwas is not responsible for user-generated content",
        "We do not guarantee the accuracy of property listings",
        "Users engage in transactions at their own risk",
        "We are not liable for any direct or indirect damages arising from use of our services"
      ]
    },
    {
      title: "10. Dispute Resolution",
      content: [
        "All disputes will be resolved according to the laws of Nepal",
        "Users agree to attempt resolution through our dispute resolution process",
        "Mandatory mediation before legal proceedings",
        "Jurisdiction is exclusive to the courts of Nepal"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 text-center">
            Terms and Conditions
          </h1>
          <p className="mt-4 text-center text-gray-600">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Introduction Note */}
        <div className="bg-blue-50 rounded-xl p-6 mb-8">
          <div className="flex items-start">
            <FaCheckCircle className="text-blue-500 w-6 h-6 mt-1" />
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-blue-900">
                Please Read Carefully
              </h2>
              <p className="mt-2 text-blue-800">
                These terms and conditions constitute a legally binding agreement between you and NepalNiwas. By accessing or using our services, you acknowledge that you have read, understood, and agree to be bound by these terms.
              </p>
            </div>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-12">
          {sections.map((section) => (
            <section
              key={section.title}
              className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow duration-300"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.content.map((paragraph, index) => (
                  <p key={index} className="text-gray-600 leading-relaxed">
                    • {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-gray-100 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Questions About Our Terms?
          </h2>
          <p className="text-gray-600 mb-4">
            If you have any questions about these terms and conditions, please contact us:
          </p>
          <div className="space-y-2 text-gray-600">
            <p>Email: legal@nepalniwas.com</p>
            <p>Phone: +977-XX-XXXXXXX</p>
            <p>Address: [Your Office Address], Kathmandu, Nepal</p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>Copyright © {new Date().getFullYear()} NepalNiwas. All rights reserved.</p>
          <p className="mt-2">
            These terms and conditions are subject to change without notice.
          </p>
        </div>
      </main>
    </div>
  );
};

export default TermsAndConditions;