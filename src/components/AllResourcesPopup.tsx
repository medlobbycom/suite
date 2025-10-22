// src/components/AllResourcesPopup.tsx
'use client';

import { X } from 'lucide-react';
import Image from 'next/image';

// Define the props for the ProductCard
interface ProductCardProps {
  href: string;
  target?: string;
  borderColor: string;
  logoSrc: string; 
  status: React.ReactNode;
  title: string;
  description: string;
}

// A reusable component for the product cards
const ProductCard: React.FC<ProductCardProps> = ({
  href,
  target,
  borderColor,
  logoSrc,
  status,
  title,
  description,
}) => (
  <a
    href={href}
    target={target}
    rel={target === "_blank" ? "noopener noreferrer" : undefined}
    // Added 'relative' and 'overflow-clip' for the pseudo-element
  // --- FIX: Added 'group' class here ---
  className="flex flex-col gap-4 p-4 rounded-lg shadow-md bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg border-t-4 
 transition-all duration-300 relative overflow-clip group"

    style={{ borderColor: borderColor }}
  >
    {/* --- PSEUDO-ELEMENT GLOW EFFECT (z-index 0) --- */}
    <div 
      className="absolute inset-0 opacity-0 transition-opacity duration-200 
                 group-hover:opacity-20 pointer-events-none"
      style={{
          backgroundImage: `radial-gradient(farthest-corner at 0 0, ${borderColor}, transparent)`,
          zIndex: 0,
      }}
    />
    
    <div className="flex justify-between items-start relative z-10">
      <span className="text-5xl text-gray-800 dark:text-white">
        <Image // Use Image component
          src={logoSrc}
          alt={`${title} Logo`}
           width={48} // Required prop
   height={48} // Required prop
          className="w-12 h-12 object-contain"
           unoptimized={true} // Keep if you don't need optimization
        />
      </span>
      <div className="flex-shrink-0">{status}</div>
    </div>
    <div className="flex-1 flex flex-col gap-1 relative z-10">
      <h4 className="font-bold text-gray-800 dark:text-white">{title}</h4>
      <p
        className="text-xs text-gray-600 dark:text-gray-300 flex-1"
        dangerouslySetInnerHTML={{ __html: description }}
      ></p>
    </div>
  </a>
);

// Define the props for the Popup
interface AllResourcesPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AllResourcesPopup({
  isOpen,
  onClose,
}: AllResourcesPopupProps) {
  if (!isOpen) {
    return null;
  }

  // This is the "3 days" status node
  const status3Days = (
    <div className="flex items-center gap-1 text-xs font-bold text-yellow-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 20v-2a6 6 0 1 1 12 0v2a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1z"></path>
        <path d="M6 4v2a6 6 0 1 0 12 0v-2a1 1 0 0 0 -1 -1h-10a1 1 0 0 0 -1 1z"></path>
      </svg>
      <span>3 days</span>
    </div>
  );

  // This is the "Not Subscribed" status node
  const statusNotSubscribed = (
    <div className="text-xs font-bold text-gray-500">Not Subscribed</div>
  );

  return (
    // Backdrop
    <div
      onClick={onClose}
      className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
    >
      {/* Modal Content - max-w-4xl and glassy background */}
      <div
        onClick={(e) => e.stopPropagation()} 
        className="relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg w-full max-w-6xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            All Resources
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Grid Container */}
        <div className="overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Clinical Medicine */}
            <ProductCard
              // --- FIX: Removed 'className' prop ---
              href="/clinical/qbank"
              borderColor="#D68BFF"
              status={status3Days}
              title="Clinical Medicine"
              description="The all-in-one subscription for clinical medical students and international medical graduates preparing for Australian clinical practice."
              logoSrc="/assets/logos/clinical.png"
            />

            {/* Card 2: AMC MCQ */}
            <ProductCard
              // --- FIX: Removed 'className' prop ---
              href="https://www.amc.org.au/mcq-preparation-app/"
              target="_blank"
              borderColor="#888888"
              status={statusNotSubscribed}
              title="AMC MCQ Questions Ed 1"
              description="MCQ preparation resource to support international medical graduates prepare for the AMC multiple-choice question exam."
              logoSrc="/assets/logos/amc.png"
            />

            {/* Card 3: Junior Doctor */}
            <ProductCard
              // --- FIX: Removed 'className' prop ---
              href="/junior-doctor"
              borderColor="#00C2FF"
              status={statusNotSubscribed}
              title="Junior Doctor"
              description="Build your confidence on the wards with MCQs and clinical case scenarios designed to support junior doctors as CPD."
              logoSrc="/assets/logos/junior_doctor.png"
            />

            {/* Card 4: GPRA Clinical Cases */}
            <ProductCard
              // --- FIX: Removed 'className' prop ---
              href="/gpra"
              borderColor="#CAD73D"
              status={statusNotSubscribed}
              title="GPRA Clinical Cases"
              description="Simulated consultations and case discussions designed for GP registrars preparing for the Australian general practice clinical exams, both ACRRM and RACGP."
              logoSrc="/assets/logos/gpra.png"
            />

            {/* Card 5: CWH/PTP */}
            <ProductCard
              // --- FIX: Removed 'className' prop ---
              href="/cwh-ptp"
              borderColor="#FEC058"
              status={statusNotSubscribed}
              title="CWH/PTP"
              description="Question Bank for candidates preparing for the RANZCOG Certificate of Women's Health and Associate Training Program (Procedural) examinations."
              logoSrc="/assets/logos/cwh_ptp.png"
            />

            {/* Card 6: Basic Pathological Sciences */}
            <ProductCard
              // --- FIX: Removed 'className' prop ---
              href="/bps"
              borderColor="#FE6358"
              status={statusNotSubscribed}
              title="Basic Pathological Sciences"
              description="Question Bank and Mock Exam for candidates preparing for the RCPA Basic Pathological Sciences (BPS) examination."
              logoSrc="/assets/logos/bps.png"
            />

            {/* Card 7: GP AKT */}
            <ProductCard
              // --- FIX: Removed 'className' prop ---
              href="/gp"
              borderColor="#797EFF"
              status={statusNotSubscribed}
              title="GP AKT"
              description="Question Bank and Mock Exams designed for registrars preparing for Australian general practice written examinations, including the Applied Knowledge Test (AKT)."
              logoSrc="/assets/logos/gp_akt.png"
            />

            {/* Card 8: Basic Science */}
            <ProductCard
              // --- FIX: Removed 'className' prop ---
              href="/basic"
              borderColor="#48FE81"
              status={status3Days}
              title="Basic Science"
              description="The ultimate study tool for pre-clinical medical and health students – learn Anatomy, Physiology, Pathophysiology, Pathology, Pharmacology, Embryology, Statistics and more."
              logoSrc="/assets/logos/basic_science.png"
            />

            {/* Card 9: cheeseMedici */}
            <ProductCard
              // --- FIX: Removed 'className' prop ---
              href="/cheese"
              borderColor="#FFDA00"
              status={statusNotSubscribed}
              title="cheeseMedici"
              description="Your&nbsp;grate-est source of cheesy medical wisdom,&nbsp;with an extra mature twist!"
              logoSrc="/assets/logos/cheese.png"
            />

            {/* Card 10: Mock Exams */}
            <ProductCard
              // --- FIX: Removed 'className' prop ---
              href="/mock-exams"
              borderColor="#555"
              status={statusNotSubscribed}
              title="Mock Exams"
              description="Full-length mock examinations for high-stakes assessment practice."
              logoSrc="/assets/logos/mock_exams.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
}