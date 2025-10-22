// src/app/page.tsx
import Image from 'next/image';

// --- ProductCard component definition ---
interface ProductCardProps {
  href: string;
  target?: string;
  borderColor: string;
  logoSrc: string;
  status: React.ReactNode;
  title: string;
  description: string;
}

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
        <Image
          src={logoSrc}
          alt={`${title} Logo`}
          width={48}
          height={48}
          className="w-12 h-12 object-contain"
          unoptimized={true}
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

// --- Main Page Component ---
export default function Page() {
  
  // Define the status badges
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

  const statusNotSubscribed = (
    <div className="text-xs font-bold text-gray-500">Not Subscribed</div>
  );
  
  // Define the card data
  const cards = [
    { href: "/clinical/qbank", borderColor: "#D68BFF", status: status3Days, title: "Clinical Medicine", description: "The all-in-one subscription for clinical medical students and international medical graduates preparing for Australian clinical practice.", logoSrc: "/assets/logos/clinical.png" },
    { href: "https://www.amc.org.au/mcq-preparation-app/", target: "_blank", borderColor: "#888888", status: statusNotSubscribed, title: "AMC MCQ Questions Ed 1", description: "MCQ preparation resource to support international medical graduates prepare for the AMC multiple-choice question exam.", logoSrc: "/assets/logos/amc.png" },
    { href: "/junior-doctor", borderColor: "#00C2FF", status: statusNotSubscribed, title: "Junior Doctor", description: "Build your confidence on the wards with MCQs and clinical case scenarios designed to support junior doctors as CPD.", logoSrc: "/assets/logos/junior_doctor.png" },
    { href: "/gpra", borderColor: "#CAD73D", status: statusNotSubscribed, title: "GPRA Clinical Cases", description: "Simulated consultations and case discussions designed for GP registrars preparing for the Australian general practice clinical exams, both ACRRM and RACGP.", logoSrc: "/assets/logos/gpra.png" },
    { href: "/cwh-ptp", borderColor: "#FEC058", status: statusNotSubscribed, title: "CWH/PTP", description: "Question Bank for candidates preparing for the RANZCOG Certificate of Women's Health and Associate Training Program (Procedural) examinations.", logoSrc: "/assets/logos/cwh_ptp.png" },
    { href: "/bps", borderColor: "#FE6358", status: statusNotSubscribed, title: "Basic Pathological Sciences", description: "Question Bank and Mock Exam for candidates preparing for the RCPA Basic Pathological Sciences (BPS) examination.", logoSrc: "/assets/logos/bps.png" },
    { href: "/gp", borderColor: "#797EFF", status: statusNotSubscribed, title: "GP AKT", description: "Question Bank and Mock Exams designed for registrars preparing for Australian general practice written examinations, including the Applied Knowledge Test (AKT).", logoSrc: "/assets/logos/gp_akt.png" },
    { href: "/basic", borderColor: "#48FE81", status: status3Days, title: "Basic Science", description: "The ultimate study tool for pre-clinical medical and health students – learn Anatomy, Physiology, Pathophysiology, Pathology, Pharmacology, Embryology, Statistics and more.", logoSrc: "/assets/logos/basic_science.png" },
    { href: "/cheese", borderColor: "#FFDA00", status: statusNotSubscribed, title: "cheeseMedici", description: "Your&nbsp;grate-est source of cheesy medical wisdom,&nbsp;with an extra mature twist!", logoSrc: "/assets/logos/cheese.png" },
    { href: "/mock-exams", borderColor: "#555", status: statusNotSubscribed, title: "Mock Exams", description: "Full-length mock examinations for high-stakes assessment practice.", logoSrc: "/assets/logos/mock_exams.png" },
  ];

  return (
    <div className="w-full">
      {/* Centering and Width-limiting Wrapper: Re-introducing max-w-6xl for centering */}
      <div className="max-w-7xl mx-auto py-12 px-4">

        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          All Resources
        </h2>

        {/* Grid Container: Set to 3 columns on large screens for wider cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <ProductCard
              // --- FIX: Removed 'className' prop ---
              key={index}
              href={card.href}
              target={card.target}
              borderColor={card.borderColor}
              logoSrc={card.logoSrc}
              status={card.status}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}