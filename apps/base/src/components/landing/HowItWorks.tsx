'use client';

import React from 'react';

const Step = ({ number, title, description }: { number: string; title: string; description: string }) => (
  <div className="text-center md:text-left">
    <div className="flex items-center justify-center md:justify-start">
      <div className="w-12 h-12 flex items-center justify-center bg-gray-100 text-[#2C7A7B] font-bold text-xl rounded-full">
        {number}
      </div>
      <h3 className="ml-4 text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <p className="mt-2 text-gray-600">
      {description}
    </p>
  </div>
);

export function HowItWorks() {
  return (
    <div className="w-full bg-gray-50 py-12 md:py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
          A Simple, Fair Process
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Lending and borrowing for the community, by the community.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <Step
            number="1"
            title="Create a Request"
            description="Borrowers define their funding goal and share their story. All loans are 0% interest with a 1.0x repayment cap."
          />
          <Step
            number="2"
            title="Fund from Community"
            description="Supporters contribute directly to campaigns they believe in, helping community members achieve their goals."
          />
          <Step
            number="3"
            title="Repay as You Grow"
            description="Borrowers repay the loan over time as they generate revenue. Funders get their original contribution back."
          />
        </div>
      </div>
    </div>
  );
}
