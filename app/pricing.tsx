import { ArrowUpRight } from "lucide-react";

const packages = [
  { id: "landing", price: 250 },
  { id: "business", price: 500 },
  { id: "catalog", price: 850 },
  { id: "custom", price: null },
] as const;

const copy = {
  SQ: {
    label: "Çmimorja",
    title: "Një faqe për çdo fazë të biznesit.",
    note: "Çmimet janë orientuese. Ofertën finale e përcaktojmë bashkë, sipas kërkesave të projektit.",
    from: "Nga",
    quote: "Sipas projektit",
    action: "Kërko ofertë",
    plans: {
      landing: { name: "Faqe prezantuese", details: ["Një faqe për një shërbim apo fushatë", "Dizajn për telefon dhe kompjuter", "Kontakt me një klik"] },
      business: { name: "Webfaqe biznesi", details: ["Deri në 5 faqe", "Formular kontakti", "SEO bazë për çdo faqe"] },
      catalog: { name: "Katalog online", details: ["Kategori dhe faqe produktesh", "Panel për përditësimin e katalogut", "Kërkesa për produktet"] },
      custom: { name: "Zgjidhje me porosi", details: ["Aplikacione për biznes", "Panele pune dhe automatizime", "Integrime me sistemet tuaja"] },
    },
  },
  EN: {
    label: "Pricing",
    title: "A website for every stage of business.",
    note: "Prices are estimates. We’ll agree on a final quote based on your project requirements.",
    from: "From",
    quote: "By scope",
    action: "Request a quote",
    plans: {
      landing: { name: "Landing page", details: ["One page for a service or campaign", "Designed for mobile and desktop", "One-click contact"] },
      business: { name: "Business website", details: ["Up to 5 pages", "Contact form", "On-page SEO basics"] },
      catalog: { name: "Online catalog", details: ["Categories and product pages", "Dashboard for catalog updates", "Product inquiries"] },
      custom: { name: "Custom development", details: ["Business applications", "Dashboards and automation", "Integration with your systems"] },
    },
  },
  MK: {
    label: "Ценовник",
    title: "Веб-страница за секоја фаза од бизнисот.",
    note: "Цените се ориентир. Конечната понуда ја договараме според барањата на проектот.",
    from: "Од",
    quote: "Според проектот",
    action: "Побарај понуда",
    plans: {
      landing: { name: "Презентациска страница", details: ["Една страница за услуга или кампања", "Дизајн за телефон и компјутер", "Контакт со еден клик"] },
      business: { name: "Бизнис веб-страница", details: ["До 5 страници", "Формулар за контакт", "Основно SEO за секоја страница"] },
      catalog: { name: "Онлајн каталог", details: ["Категории и страници за производи", "Панел за уредување на каталогот", "Прашања за производите"] },
      custom: { name: "Изработка по нарачка", details: ["Деловни апликации", "Панели и автоматизација", "Интеграции со вашите системи"] },
    },
  },
};

export function Pricing({ lang }: { lang: keyof typeof copy }) {
  const t = copy[lang];

  return (
    <section className="sectionNew pricing" id="pricing" aria-labelledby="pricing-title">
      <div className="sectionHeading pricingIntro">
        <div className="smallTag">{t.label}</div>
        <h2 id="pricing-title">{t.title}</h2>
        <p>{t.note}</p>
      </div>
      <div className="pricingList">
        {packages.map(({ id, price }) => {
          const plan = t.plans[id];
          const subject = encodeURIComponent(`MERIX STUDIO - ${plan.name}`);

          return (
            <article key={id} className={`pricingPlan pricingPlan--${id}`}>
              <div>
                <h3>{plan.name}</h3>
                <ul>
                  {plan.details.map((detail) => <li key={detail}>{detail}</li>)}
                </ul>
              </div>
              <div className="pricingOffer">
                <p className="pricingAmount">
                  {price === null ? <strong className="pricingQuote">{t.quote}</strong> : (
                    <><span>{t.from}</span> <strong>€{price}</strong></>
                  )}
                </p>
                <a href={`mailto:mero.alija2005@gmail.com?subject=${subject}`} aria-label={`${t.action} — ${plan.name}`}>
                  {t.action} <ArrowUpRight size={17} aria-hidden="true" />
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
