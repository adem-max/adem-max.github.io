// Page text for the home page and the frame around every page, in English and French.
// Case studies live in src/content/projects.ts.
// Employer rule (DEMO_DATA_MODEL.md): the employer is only ever "a cable manufacturer".

export const languages = { en: "English", fr: "Français" } as const;
export type Lang = keyof typeof languages;

export const EMAIL = "adembenlecheb1@gmail.com";
export const LINKEDIN = "https://www.linkedin.com/in/adem-benlechheb-283476218";
export const GITHUB = "https://github.com/adem-max";
/** Only an English CV exists; both languages link to it. */
export const CV_HREF = "/cv/adem-benlechheb-cv-en.pdf";

type Link = { label: string; slug: string };
type Track = { id: "field" | "software" | "planning"; title: string; body: string; links: Link[] };
type Job = { when: string; role: string; where: string; body: string };

export type Copy = {
  meta: { title: string; description: string };
  nav: { work: string; experience: string; hire: string; contact: string; theme: string };
  hero: { eyebrow: string; title: string; lede: string; cv: string; hire: string };
  stats: [string, string][];
  tracks: { eyebrow: string; heading: string; items: Track[] };
  work: { eyebrow: string; heading: string; note: string; read: string };
  experience: { eyebrow: string; heading: string; items: Job[] };
  hire: { eyebrow: string; heading: string; lede: string; items: [string, string][]; cta: string };
  contact: { heading: string; lede: string; email: string };
  project: { back: string; next: string; demo: string; facts: string };
  footer: { role: string; demo: string };
};

export const copy: Record<Lang, Copy> = {
  en: {
    meta: {
      title: "Adem Benlechheb, electrical engineer",
      description:
        "Electrical engineer working on power plants, production floors and the software that runs them. Field engineering, software and production planning.",
    },
    nav: { work: "Work", experience: "Experience", hire: "Work with me", contact: "Contact", theme: "Switch light or dark theme" },
    hero: {
      eyebrow: "Electrical engineer · Algiers, Algeria",
      title: "Power plants, production floors, and the software that runs them.",
      lede:
        "I'm an electrical engineer with fieldwork on gas turbines and the grid. I build the tools a production plant runs on, and I'm open to field, software and planning roles.",
      cv: "Download CV",
      hire: "Work with me",
    },
    stats: [
      ["MSc", "Electrical engineering, top of my class"],
      ["Daily", "My scheduling tool plans every section of a cable plant"],
      ["99%", "Bacteria cut in a lab trial of my team's ozone prototype"],
      ["3", "Languages: Arabic, English, French"],
    ],
    tracks: {
      eyebrow: "What I do",
      heading: "Three ways I can help",
      items: [
        {
          id: "field",
          title: "Field engineering",
          body:
            "Hands-on with power generation and plant equipment: gas-turbine maintenance rounds, grid fault diagnosis, and a high-voltage ozone prototype built and tested in the lab.",
          links: [{ label: "Ozone device", slug: "ozone-device" }],
        },
        {
          id: "software",
          title: "Software",
          body:
            "Tested desktop apps and ERP extensions that replace fragile spreadsheets and macros, built to run where IT allows nothing: no admin rights, no network.",
          links: [
            { label: "Scheduling tool", slug: "scheduler" },
            { label: "dz-cod", slug: "dz-cod" },
          ],
        },
        {
          id: "planning",
          title: "Production planning",
          body:
            "Scheduling, raw-material checks and productivity reporting for a multi-section production plant, from the ERP's exports to the shop floor.",
          links: [{ label: "Planning toolkit", slug: "planning-toolkit" }],
        },
      ],
    },
    work: {
      eyebrow: "Selected work",
      heading: "Projects",
      note: "Visuals for the plant tools use a synthetic demo plant built on public ISA-95 and IEC standards, not real plant data.",
      read: "Read the case study",
    },
    experience: {
      eyebrow: "Experience",
      heading: "Where I've worked",
      items: [
        {
          when: "2025 – now",
          role: "Production Planning Engineer",
          where: "Cable manufacturer · Ain Defla",
          body:
            "Daily planning across several production sections. Material availability checks with the production teams. Built the planning tools shown above.",
        },
        {
          when: "2024",
          role: "Intern, gas power plant operations and maintenance",
          where: "Sonelgaz (SPE), El Hamma · Algiers",
          body:
            "Maintenance rounds on an open-cycle fleet (Ansaldo V94.3A, GE TM2500): gas skids, lube oil, compressed air and demineralised water systems. Studied the plant's DCS (Egatrol) and its HSE cases.",
        },
        {
          when: "2023",
          role: "Intern, electrical maintenance and grid operations",
          where: "Sonelgaz · Blida",
          body: "Equipment inspection and fault-diagnosis support at a distribution site.",
        },
        {
          when: "2023 – 2025",
          role: "Electronics and controls, ozone disinfection device",
          where: "Alpelec Laboratory · Sidi Bel Abbès",
          body: "Electronics and control of the device, including its gas-detection safety mechanism.",
        },
        {
          when: "2022",
          role: "Intern, production line maintenance",
          where: "Cable manufacturer · Ain Defla",
          body: "Line maintenance and early equipment-optimisation work on the cable-making floor.",
        },
        {
          when: "2020 – 2025",
          role: "MSc Electrical Engineering, power systems",
          where: "Djillali Liabès University · Sidi Bel Abbès",
          body: "Grid structure, protection, high-voltage design. Top of my class in both the Bachelor's and the Master's.",
        },
      ],
    },
    hire: {
      eyebrow: "Work with me",
      heading: "Small, solid tools for businesses that run on spreadsheets",
      lede: "I take the spreadsheet or macro your team depends on and turn it into something that doesn't break.",
      items: [
        ["Excel and Power Query", "Reports that refresh in one click, with no macros"],
        ["Macro replacement", "VBA turned into a tested desktop app"],
        ["Offline internal tools", "For PCs where you can't install anything"],
        ["ERPNext", "Set-up and custom apps"],
      ],
      cta: "Tell me what you're working with",
    },
    contact: {
      heading: "Let's talk",
      lede: "Email is best. I reply in English, French or Arabic.",
      email: "Email me",
    },
    project: { back: "All projects", next: "Next project", demo: "Illustration on the demo plant (synthetic data)", facts: "Project facts" },
    footer: { role: "Electrical engineer · field, software, planning", demo: "Plant visuals use synthetic demo data." },
  },

  fr: {
    meta: {
      title: "Adem Benlechheb, ingénieur électricien",
      description:
        "Ingénieur électricien : centrales, ateliers de production et les logiciels qui les font tourner. Ingénierie terrain, logiciel et planification de production.",
    },
    nav: { work: "Projets", experience: "Parcours", hire: "Travailler ensemble", contact: "Contact", theme: "Passer en thème clair ou sombre" },
    hero: {
      eyebrow: "Ingénieur électricien · Alger, Algérie",
      title: "Centrales, ateliers de production, et les logiciels qui les font tourner.",
      lede:
        "Ingénieur électricien avec une expérience terrain sur turbines à gaz et réseau électrique. Je construis les outils sur lesquels tourne une usine de production, et je suis ouvert aux postes terrain, logiciel et planification.",
      cv: "CV (en anglais)",
      hire: "Travailler ensemble",
    },
    stats: [
      ["Master", "Électrotechnique, major de promotion"],
      ["Chaque jour", "Mon outil d'ordonnancement planifie chaque section d'une câblerie"],
      ["99 %", "Bactéries éliminées lors d'un essai du prototype à ozone de mon équipe"],
      ["3", "Langues : arabe, anglais, français"],
    ],
    tracks: {
      eyebrow: "Mon métier",
      heading: "Trois façons d'aider",
      items: [
        {
          id: "field",
          title: "Ingénierie terrain",
          body:
            "Production d'électricité et équipements d'usine, sur le terrain : rondes de maintenance sur turbines à gaz, aide au diagnostic de défauts sur le réseau, et un prototype à ozone haute tension construit et testé au laboratoire.",
          links: [{ label: "Dispositif à ozone", slug: "ozone-device" }],
        },
        {
          id: "software",
          title: "Logiciel",
          body:
            "Des applications de bureau testées et des extensions d'ERP qui remplacent des tableurs et des macros fragiles, conçues pour tourner là où l'informatique ne permet rien : sans droits admin, sans réseau.",
          links: [
            { label: "Outil d'ordonnancement", slug: "scheduler" },
            { label: "dz-cod", slug: "dz-cod" },
          ],
        },
        {
          id: "planning",
          title: "Planification de production",
          body:
            "Ordonnancement, contrôle des matières premières et suivi de productivité pour une usine à plusieurs sections, des extractions de l'ERP jusqu'à l'atelier.",
          links: [{ label: "Boîte à outils de planification", slug: "planning-toolkit" }],
        },
      ],
    },
    work: {
      eyebrow: "Projets choisis",
      heading: "Projets",
      note: "Les visuels des outils d'usine viennent d'une usine de démonstration fictive, construite sur les normes publiques ISA-95 et CEI, et non de données réelles.",
      read: "Lire l'étude de cas",
    },
    experience: {
      eyebrow: "Parcours",
      heading: "Où j'ai travaillé",
      items: [
        {
          when: "2025 – aujourd'hui",
          role: "Ingénieur planification de production",
          where: "Fabricant de câbles · Aïn Defla",
          body:
            "Planification quotidienne sur plusieurs sections de production. Vérification de la disponibilité des matières avec les équipes de production. Conception des outils de planification présentés plus haut.",
        },
        {
          when: "2024",
          role: "Stagiaire, exploitation et maintenance de centrale à gaz",
          where: "Sonelgaz (SPE), El Hamma · Alger",
          body:
            "Rondes de maintenance sur un parc à cycle simple (Ansaldo V94.3A, GE TM2500) : skids gaz, huile de lubrification, air comprimé, eau déminéralisée. Étude du contrôle-commande (Egatrol) et des cas HSE.",
        },
        {
          when: "2023",
          role: "Stagiaire, maintenance électrique et exploitation du réseau",
          where: "Sonelgaz · Blida",
          body: "Inspection d'équipements et aide au diagnostic de défauts sur un site de distribution.",
        },
        {
          when: "2023 – 2025",
          role: "Électronique et commande, dispositif de désinfection à l'ozone",
          where: "Laboratoire Alpelec · Sidi Bel Abbès",
          body: "Électronique et commande du dispositif, dont son mécanisme de sécurité de détection de gaz.",
        },
        {
          when: "2022",
          role: "Stagiaire, maintenance des lignes de production",
          where: "Fabricant de câbles · Aïn Defla",
          body: "Maintenance des lignes et premiers travaux d'optimisation des équipements en atelier.",
        },
        {
          when: "2020 – 2025",
          role: "Master en électrotechnique, réseaux électriques",
          where: "Université Djillali Liabès · Sidi Bel Abbès",
          body: "Structure des réseaux, protection, haute tension. Major de promotion en licence et en master.",
        },
      ],
    },
    hire: {
      eyebrow: "Travailler ensemble",
      heading: "De petits outils solides pour les entreprises qui tournent sur des tableurs",
      lede: "Je reprends le tableur ou la macro dont votre équipe dépend et j'en fais quelque chose qui ne casse pas.",
      items: [
        ["Excel et Power Query", "Des rapports qui se mettent à jour en un clic, sans macros"],
        ["Remplacement de macros", "Du VBA transformé en application testée"],
        ["Outils internes hors ligne", "Pour les postes où l'on ne peut rien installer"],
        ["ERPNext", "Mise en place et applications sur mesure"],
      ],
      cta: "Parlez-moi de votre besoin",
    },
    contact: {
      heading: "Parlons-en",
      lede: "Le plus simple est l'e-mail. Je réponds en français, en anglais ou en arabe.",
      email: "M'écrire",
    },
    project: { back: "Tous les projets", next: "Projet suivant", demo: "Illustration sur l'usine de démonstration (données fictives)", facts: "Le projet en bref" },
    footer: { role: "Ingénieur électricien · terrain, logiciel, planification", demo: "Les visuels d'usine utilisent des données de démonstration fictives." },
  },
};

// French typography: a no-break space before : ; ! ? and %.
function frTypo<T>(value: T): T {
  if (typeof value === "string") return value.replace(/ ([:;!?%])/g, " $1") as T;
  if (Array.isArray(value)) return value.map(frTypo) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, k === "slug" ? v : frTypo(v)])) as T;
  }
  return value;
}
copy.fr = frTypo(copy.fr);
