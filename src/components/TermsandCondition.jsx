import React from 'react';
import { FileText, CheckCircle, AlertCircle, Clock, CreditCard, Users, BookOpen } from 'lucide-react';

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-gray-800 rounded-full mb-6">
            <FileText className="w-10 h-10 text-orange-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Terms & Conditions</h1>
          <p className="text-xl text-gray-300">Simple rules for a safe learning environment</p>
          <div className="mt-6 text-sm text-gray-400">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8 border border-gray-700">
          <div className="prose prose-lg max-w-none">
            <div className="mb-10">
              <p className="text-gray-300 mb-6">
                Welcome to Kidzet! These terms help us create a safe, fun, and effective learning environment 
                for your child. By using our service, you agree to these simple terms.
              </p>
            </div>

            {/* Key Sections */}
            <div className="space-y-10">
              {/* Account */}
              <div className="border-b border-gray-700 pb-8">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-gray-700 rounded-lg mr-3">
                    <Users className="w-6 h-6 text-orange-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">1. Your Account</h2>
                </div>
                <div className="space-y-4 text-gray-300">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Accounts are for parents only. Children access content through parent-managed profiles.</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>You must be at least 18 years old to create an account.</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Keep your login information secure. You're responsible for activity on your account.</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>You can cancel your subscription at any time through your account settings.</span>
                  </div>
                </div>
              </div>

              {/* Subscription */}
              <div className="border-b border-gray-700 pb-8">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-gray-700 rounded-lg mr-3">
                    <CreditCard className="w-6 h-6 text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">2. Subscription & Payments</h2>
                </div>
                <div className="space-y-4 text-gray-300">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>We offer various subscription plans (weekly, monthly, yearly).</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Payments are processed securely through trusted providers.</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Subscriptions automatically renew. Turn off auto-renew anytime in your account.</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>We offer refunds within 7 days if you're not satisfied with our service.</span>
                  </div>
                </div>
              </div>

              {/* Usage */}
              <div className="border-b border-gray-700 pb-8">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-gray-700 rounded-lg mr-3">
                    <BookOpen className="w-6 h-6 text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">3. Appropriate Use</h2>
                </div>
                <div className="space-y-4 text-gray-300">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Kidzet is for educational purposes only.</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Don't share your account with others outside your family.</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Respect our content - don't copy, modify, or redistribute it.</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>We may suspend accounts for inappropriate behavior or violation of these terms.</span>
                  </div>
                </div>
              </div>

              {/* Safety */}
              <div className="border-b border-gray-700 pb-8">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-gray-700 rounded-lg mr-3">
                    <AlertCircle className="w-6 h-6 text-yellow-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">4. Safety & Responsibility</h2>
                </div>
                <div className="space-y-4 text-gray-300">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Parents are responsible for monitoring their child's use of Kidzet.</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>We provide age-appropriate content, but parents know their child best.</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Report any concerns about content or safety immediately.</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Use Kidzet alongside other learning activities for balanced development.</span>
                  </div>
                </div>
              </div>

              {/* Updates */}
              <div className="pb-8">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-gray-700 rounded-lg mr-3">
                    <Clock className="w-6 h-6 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">5. Updates & Changes</h2>
                </div>
                <div className="space-y-4 text-gray-300">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>We may update these terms occasionally to improve our service.</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>We'll notify you of significant changes via email.</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Continued use of Kidzet means you accept updated terms.</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>You can review current terms anytime on this page.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 mt-10">
              <h3 className="font-bold text-white text-lg mb-3">Need Help?</h3>
              <p className="text-gray-300 mb-4">
                We're here to make your child's learning journey safe and enjoyable. 
                Contact us with any questions:
              </p>
              <div className="text-orange-500 font-medium">
                📧 support@kidzet.com | 📞 1-800-KIDZET
              </div>
            </div>
          </div>
        </div>

        {/* Quick Agreement */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
          <div className="flex items-start">
            <div className="p-2 bg-gray-700 rounded-lg mr-4">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h3 className="font-bold text-white text-xl mb-3">By using Kidzet, you agree to:</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Create a safe learning environment for your child</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Use our service for educational purposes only</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Keep your account information secure</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Respect our content and community guidelines</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            © 2026 Kidzet. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;