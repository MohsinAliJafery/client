import React from 'react';
import { Shield, Lock, EyeOff, Mail, Trash2 } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-gray-800 rounded-full mb-6">
            <Shield className="w-10 h-10 text-orange-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-300">Your child's privacy is our top priority</p>
          <div className="mt-6 text-sm text-gray-400">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8 border border-gray-700">
          <div className="prose prose-lg max-w-none">
            <div className="mb-10">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-gray-700 rounded-lg mr-3">
                  <Lock className="w-6 h-6 text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold text-white">Our Promise to You</h2>
              </div>
              <p className="text-gray-300 mb-4">
                At Kidzet, we believe in protecting children's privacy. We're committed to creating a safe online space 
                where your child can learn and grow without compromising their personal information.
              </p>
            </div>

            {/* Key Points */}
            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-gray-700 rounded-lg mr-3">
                    <EyeOff className="w-5 h-5 text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-lg text-white">What We Collect</h3>
                </div>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    <span>Parent's email for account creation</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    <span>Child's first name only</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    <span>Learning progress data</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    <span>No location tracking</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    <span>No contact information from children</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-gray-700 rounded-lg mr-3">
                    <Lock className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="font-semibold text-lg text-white">How We Protect</h3>
                </div>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Encrypted data storage</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Secure payment processing</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>No data sharing with third parties</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Parent-controlled accounts</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Regular security updates</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Parental Rights */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-6">Your Rights as a Parent</h2>
              <div className="space-y-6">
                <div className="flex items-start bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <div className="p-2 bg-purple-900/50 rounded-lg mr-4 mt-1">
                    <Mail className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">Access & Control</h3>
                    <p className="text-gray-300">
                      You can view, update, or delete your child's information at any time through your parent account. 
                      Contact us if you need assistance.
                    </p>
                  </div>
                </div>

                <div className="flex items-start bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <div className="p-2 bg-red-900/50 rounded-lg mr-4 mt-1">
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">Data Deletion</h3>
                    <p className="text-gray-300">
                      You can request complete deletion of your child's data. We will remove all information 
                      within 30 days of your request.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700">
              <h3 className="font-bold text-white text-lg mb-3">Questions or Concerns?</h3>
              <p className="text-gray-300 mb-4">
                We're here to help! If you have any questions about our privacy practices, please contact us:
              </p>
              <div className="text-orange-500 font-medium">
                📧 Kidzetofficial@gamil.com
              </div>
            </div>
          </div>
        </div>

        {/* Simple Summary */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
          <h3 className="font-bold text-white text-xl mb-3">Simple Summary</h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>We only collect essential information to provide learning services</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>We never sell or share children's data with advertisers</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Parents have full control over their child's information</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>We use industry-standard security to protect your data</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;