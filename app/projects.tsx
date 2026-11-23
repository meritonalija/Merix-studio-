import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    id: "alfa", name: "ALFA PLAST", type: "SCHÜCO PVC SYSTEMS",
    url: "https://www.alfaplast.mk/",
    hasScreenshots: true,
    summary: {
      SQ: "Prezantim i sistemeve PVC dhe zgjidhjeve për dritare e dyer.",
      EN: "A showcase for PVC systems and window and door solutions.",
      MK: "Презентација на ПВЦ системи и решенија за прозорци и врати.",
    },
  },
  {
    id: "besa", name: "BESA PAN", type: "ALUMINIUM ENTRANCE DOORS",
    url: "https://besa-pan-website.vercel.app/",
    hasScreenshots: true,
    summary: {
      SQ: "Prezantim i koleksionit të dyerve hyrëse prej alumini.",
      EN: "A showcase for a collection of aluminium entrance doors.",
      MK: "Презентација на колекција алуминиумски влезни врати.",
    },
  },
  {
    id: "lani", name: "LANI KOMPANI", type: "WINDOWS · DOORS · FACADES",
    url: "https://lanikompani.vercel.app",
    hasScreenshots: true,
    summary: {
      SQ: "Webfaqe me katalog për dritare, dyer dhe fasada.",
      EN: "A website and catalog for windows, doors, and façades.",
      MK: "Веб-страница и каталог за прозорци, врати и фасади.",
    },
  },
  {
    id: "culi", name: "CULI AUTO TRANSPORT", type: "INTERNATIONAL VEHICLE TRANSPORT",
    url: "https://culiautotransport.vercel.app",
    hasScreenshots: true,
    summary: {
      SQ: "Webfaqe për shërbimet e transportit ndërkombëtar të automjeteve.",
      EN: "A website for an international vehicle transport service.",
      MK: "Веб-страница за меѓународен превоз на возила.",
    },
  },
  {
    id: "alija", name: "ALIJA KOMERC", type: "INVOICING SOFTWARE",
    summary: {
      SQ: "Aplikacion biznesi për krijimin dhe menaxhimin e faturave.",
      EN: "A business application for creating and managing invoices.",
      MK: "Деловна апликација за креирање и управување со фактури.",
    },
  },
] as const;

const labels = {
  SQ: { visit: "Shiko webfaqen", illustration: "Pamje ilustruese" },
  EN: { visit: "Visit website", illustration: "Illustrative preview" },
  MK: { visit: "Посети ја веб-страницата", illustration: "Илустративен приказ" },
};

type Project = (typeof projects)[number];

function ProjectScreen({ project, mobile }: { project: Project; mobile: boolean }) {
  if ("hasScreenshots" in project) {
    return <img src={`/projects/${project.id}-${mobile ? "mobile" : "desktop"}.webp`} width={mobile ? 390 : 800} height={mobile ? 780 : 500} loading="lazy" alt="" />;
  }

  return (
    <div className="invoicePreview" lang="sq">
      <div className="invoicePreviewHeader">
        <div>
          <strong>Alija Komerc · Faturat</strong>
          <small>Llogaritje automatike të faturave</small>
        </div>
        <b className="invoicePreviewMark">AK</b>
        <div className="invoicePreviewActions">
          <span>Faturë e re</span>
          <span>Ruaj PDF</span>
          <span>Printo</span>
        </div>
      </div>
      <div className="invoicePreviewBody">
        <div className="invoicePreviewPanel">
          <strong>Fatura dhe klienti</strong>
          <div className="invoicePreviewFields">
            <span>Numri i faturës<b>C-0001</b></span>
            <span>Data<b>11/11/2026</b></span>
            <span>Qyteti i lëshimit<b>Kumanovo</b></span>
            <span>Emri i klientit<b>Emri i biznesit</b></span>
          </div>
        </div>
        <div className="invoicePreviewPanel">
          <strong>Faturat e ruajtura</strong>
          <p>Ende nuk ka fatura.</p>
          <span className="invoicePreviewBackup">Ruaj kopje rezervë</span>
        </div>
      </div>
    </div>
  );
}

export function ProjectCards({ lang }: { lang: keyof typeof labels }) {
  const t = labels[lang];

  return (
    <div className="portfolioCards">
      {projects.map(project => (
        <article className={`portfolioCard portfolioCard--${project.id}`} key={project.id}>
          <div className="portfolioVisual" aria-hidden="true">
            <div className="portfolioMonitor">
              <div className="portfolioScreen"><ProjectScreen project={project} mobile={false} /></div>
            </div>
            {project.id !== "alija" && (
              <div className="portfolioPhone">
                <div className="portfolioScreen"><ProjectScreen project={project} mobile /></div>
              </div>
            )}
          </div>
          <div className="portfolioInfo">
            <p className="portfolioType">{project.type}</p>
            <h3>{project.name}</h3>
            <p className="portfolioDescription">{project.summary[lang]}</p>
            {!("hasScreenshots" in project) && <p className="portfolioPreviewNote">{t.illustration}</p>}
            {"url" in project && (
              <a href={project.url} className="portfolioLink" aria-label={`${t.visit} — ${project.name}`}>
                {t.visit} <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
