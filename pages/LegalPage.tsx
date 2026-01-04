import React from 'react';
import LegalLayout from '../components/LegalLayout';

interface LegalPageProps {
  type: 'terms' | 'privacy';
}

const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  
  if (type === 'terms') {
    return (
      <LegalLayout
        title="Terms & Conditions"
        lastUpdated="October 24, 2023"
        sections={[
          {
            id: "acceptance",
            title: "1. Acceptance of Terms",
            content: (
              <>
                <p>
                  By accessing and using the Santos website (the "Site"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this Site's particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                </p>
                <div className="bg-primary-50 p-6 rounded-sm border-l-4 border-primary-300 my-4">
                  <p className="text-sm font-mono text-primary-900">
                    NOTE: ANY PARTICIPATION IN THIS SERVICE WILL CONSTITUTE ACCEPTANCE OF THIS AGREEMENT. IF YOU DO NOT AGREE TO ABIDE BY THE ABOVE, PLEASE DO NOT USE THIS SERVICE.
                  </p>
                </div>
              </>
            )
          },
          {
            id: "privacy",
            title: "2. Privacy Policy",
            content: (
              <p>
                Our Privacy Policy describes how we handle the information you provide to us when you use our Site. You understand that through your use of the Site you consent to the collection and use of this information, including the transfer of this information to the United States and/or other countries for storage, processing and use by Santos.
              </p>
            )
          },
          {
            id: "intellectual",
            title: "3. Intellectual Property",
            content: (
              <p>
                The Site and its original content, features, and functionality are owned by Santos and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
              </p>
            )
          },
          {
            id: "termination",
            title: "4. Termination",
            content: (
              <p>
                We may terminate your access to the Site, without cause or notice, which may result in the forfeiture and destruction of all information associated with your account. All provisions of this Agreement that, by their nature, should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
              </p>
            )
          }
        ]}
      />
    );
  }

  return (
    <LegalLayout
      title="Privacy Policy"
      lastUpdated="September 15, 2023"
      sections={[
        {
          id: "collection",
          title: "1. Information Collection",
          content: (
            <>
              <p>
                We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, items requested (for delivery services), delivery notes, and other information you choose to provide.
              </p>
            </>
          )
        },
        {
          id: "usage",
          title: "2. Use of Information",
          content: (
            <p>
              We use the information we collect to provide, maintain, and improve our services, such as to facilitate payments, send receipts, provide products and services you request (and send related information), develop new features, provide customer support to Users and Drivers, develop safety features, authenticate users, and send product updates and administrative messages.
            </p>
          )
        },
        {
          id: "sharing",
          title: "3. Sharing of Information",
          content: (
            <>
              <p>We may share the information we collect about you as described in this Statement or as described at the time of collection or sharing, including as follows:</p>
              <ul className="list-disc pl-5 mt-4 space-y-2">
                <li>With vendors, consultants, marketing partners, and other service providers who need access to such information to carry out work on our behalf;</li>
                <li>In response to a request for information if we believe disclosure is in accordance with any applicable law, regulation, or legal process;</li>
                <li>If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property, or safety of Santos or others.</li>
              </ul>
            </>
          )
        },
        {
          id: "security",
          title: "4. Data Security",
          content: (
            <div className="bg-primary-50 p-6 rounded-sm border-l-4 border-primary-300">
              <p>
                We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
              </p>
            </div>
          )
        }
      ]}
    />
  );
};

export default LegalPage;