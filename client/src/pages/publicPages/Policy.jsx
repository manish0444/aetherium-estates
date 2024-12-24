import React from 'react';
import { Shield, Users, Database, Bell, Lock, Eye, MessageSquare, Scale } from 'lucide-react';

const PolicySection = ({ icon: Icon, title, children }) => {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="text-gray-600 space-y-4">
        {children}
      </div>
    </div>
  );
};

const PrivacyPolicy = () => {
  const lastUpdated = "November 8, 2024";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <p className="text-gray-600 leading-relaxed">
            At NepalNiwas, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our real estate services and website. Please read this privacy policy carefully. By using our services, you consent to the practices described in this policy.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          <PolicySection icon={Database} title="Information We Collect">
            <p>We collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name, email address, phone number, and mailing address</li>
              <li>Property preferences and search criteria</li>
              <li>Financial information for property transactions</li>
              <li>Government-issued identification documents</li>
              <li>Property documents and legal papers</li>
              <li>Communication history with our agents</li>
            </ul>
          </PolicySection>

          <PolicySection icon={Eye} title="How We Use Your Information">
            <p>We use the collected information for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Facilitating property transactions and services</li>
              <li>Communicating about properties and services</li>
              <li>Processing payments and documentation</li>
              <li>Improving our services and user experience</li>
              <li>Legal compliance and verification purposes</li>
              <li>Marketing and promotional communications (with consent)</li>
            </ul>
          </PolicySection>

          <PolicySection icon={Lock} title="Data Security">
            <p>We implement appropriate security measures to protect your information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encryption of sensitive data</li>
              <li>Regular security assessments</li>
              <li>Restricted access to personal information</li>
              <li>Secure data storage systems</li>
              <li>Employee training on data protection</li>
            </ul>
          </PolicySection>

          <PolicySection icon={Users} title="Information Sharing">
            <p>We may share your information with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Property owners or buyers (as necessary for transactions)</li>
              <li>Legal and financial advisors</li>
              <li>Government authorities (when required by law)</li>
              <li>Service providers who assist our operations</li>
            </ul>
          </PolicySection>

          <PolicySection icon={Bell} title="Your Rights">
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal information</li>
              <li>Request corrections to your data</li>
              <li>Withdraw consent for marketing communications</li>
              <li>Request deletion of your information</li>
              <li>Object to certain data processing activities</li>
            </ul>
          </PolicySection>

          <PolicySection icon={MessageSquare} title="Contact Us">
            <p>For privacy-related inquiries or concerns, contact us at:</p>
            <div className="mt-2">
              <p>Email: privacy@nepalniwas.com</p>
              <p>Phone: +977-1-XXXXXXX</p>
              <p>Address: [Your Office Address], Kathmandu, Nepal</p>
            </div>
          </PolicySection>

          <PolicySection icon={Scale} title="Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </PolicySection>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600">
          <p>© {new Date().getFullYear()} NepalNiwas. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;