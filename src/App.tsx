import { useRef, useState } from 'react';
import type { DisciplineId } from './data/ycdevData';
import type { ProjectScale, TimelineUrgency } from './utils/projectEstimator';
import type { ShowcaseModelId } from './three/showcaseObjects';
import { Navbar } from './components/Navbar';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { OrbitalBackgroundCanvas } from './components/OrbitalBackgroundCanvas';
import { HeroSection } from './components/HeroSection';
import { Interactive3DLab } from './components/Interactive3DLab';
import { LiveProjectVideosSection } from './components/LiveProjectVideosSection';
import { LiveProjectsDemoSection } from './components/LiveProjectsDemoSection';
import { MaritimeSolutionsSection } from './components/MaritimeSolutionsSection';
import { ServicesBento } from './components/ServicesBento';
import { CaseStudiesSection } from './components/CaseStudiesSection';
import { CredibilityAndCertificationsSection } from './components/CredibilityAndCertificationsSection';
import { TeamSection } from './components/TeamSection';
import { PartnersAndClientsSection } from './components/PartnersAndClientsSection';
import { ClientPortalSection } from './components/ClientPortalSection';
import { ProjectEstimator } from './components/ProjectEstimator';
import { FounderAndContactSection } from './components/FounderAndContactSection';
import { Footer } from './components/Footer';
import { TableOfContents } from './components/TableOfContents';
import { VirtualChatAssistant } from './components/VirtualChatAssistant';

export default function App() {
  const [selectedDisciplines, setSelectedDisciplines] = useState<DisciplineId[]>([
    'iot',
    'fullstack',
  ]);
  const [scale, setScale] = useState<ProjectScale>('production');
  const [urgency, setUrgency] = useState<TimelineUrgency>('standard');
  const [attachedScope, setAttachedScope] = useState<string | null>(null);
  const [active3DModel, setActive3DModel] = useState<ShowcaseModelId>('iot-gateway');
  const [focusedProductId, setFocusedProductId] = useState<string | null>(null);

  const nameInputRef = useRef<HTMLInputElement | null>(null);

  const scrollToContact = () => {
    const contactEl = document.getElementById('kontak');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
    window.setTimeout(() => {
      nameInputRef.current?.focus();
    }, 350);
  };

  const handleToggleDiscipline = (id: DisciplineId) => {
    setSelectedDisciplines((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectForEstimate = (discipline: DisciplineId) => {
    setSelectedDisciplines((prev) =>
      prev.includes(discipline) ? prev : [...prev, discipline]
    );
    const estEl = document.getElementById('estimasi');
    if (estEl) {
      estEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleApplyScope = (summaryText: string) => {
    setAttachedScope(summaryText);
    scrollToContact();
  };

  const handleInspect3DModel = (modelId: ShowcaseModelId) => {
    setActive3DModel(modelId);
    const labEl = document.getElementById('lab-3d');
    if (labEl) {
      labEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectProduct = (productId: string) => {
    setFocusedProductId(productId);
    const sectionEl = document.getElementById('solusi-maritim');
    if (sectionEl) {
      sectionEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#05070A] text-[#F8FAFC]">
      <OrbitalBackgroundCanvas />
      <ScrollProgressBar />
      <TableOfContents />
      <Navbar
        onConsultClick={scrollToContact}
        onSelectProduct={handleSelectProduct}
      />

      <main className="relative z-10">
        <HeroSection onConsultClick={scrollToContact} />

        <Interactive3DLab
          selectedModelId={active3DModel}
          onSelectModel={setActive3DModel}
        />

        <LiveProjectVideosSection />

        <LiveProjectsDemoSection />

        <MaritimeSolutionsSection
          onSelectModule={handleApplyScope}
          onInspect3DModel={handleInspect3DModel}
          focusedProductId={focusedProductId}
          onClearFocusedProduct={() => setFocusedProductId(null)}
        />

        <ServicesBento
          selectedDisciplines={selectedDisciplines}
          onSelectForEstimate={handleSelectForEstimate}
        />

        <CaseStudiesSection />

        <CredibilityAndCertificationsSection />

        <TeamSection onConsultTeamMember={handleApplyScope} />

        <PartnersAndClientsSection onSelectCustomerReference={handleApplyScope} />

        <ClientPortalSection onConsultProject={handleApplyScope} />

        <ProjectEstimator
          selectedDisciplines={selectedDisciplines}
          scale={scale}
          urgency={urgency}
          onToggleDiscipline={handleToggleDiscipline}
          onScaleChange={setScale}
          onUrgencyChange={setUrgency}
          onApplyScope={handleApplyScope}
        />

        <FounderAndContactSection
          attachedScope={attachedScope}
          onClearScope={() => setAttachedScope(null)}
          nameInputRef={nameInputRef}
        />
      </main>

      <Footer />

      <VirtualChatAssistant
        onSelectProduct={handleSelectProduct}
        onConsultClick={scrollToContact}
      />
    </div>
  );
}
