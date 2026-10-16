// All page text, in English and French. Keys mirror the home page sections.
// Employer rule (PORTFOLIO_PLAN.md §2): the employer is only ever "a cable manufacturer".

export const languages = { en: "English", fr: "Français" } as const;
export type Lang = keyof typeof languages;

export const EMAIL = "adembenlecheb1@gmail.com";
export const LINKEDIN = "https://www.linkedin.com/in/adem-benlechheb-283476218";
export const GITHUB = "https://github.com/adem-max";

type Link = { label: string; href: string };
type Track = { id: string; title: string; body: string; links: Link[] };
type Project = { id: string; title: string; tags: string[]; body: string; status: string };
type Job = { when: string; role: string; where: string; body: string };

export type Copy = {
  meta: { title: string; description: string };
  nav: { tracks: string; work: string; experience: string; hire: string; contact: string };
  hero: { eyebrow: string; title: string; lede: string; cv: string; cvHref: string; hire: string };
  tracks: { heading: string; items: Track[] };
  work: { heading: string; note: string; items: Project[] };
  experience: { heading: string; items: Job[] };
  hire: { heading: string; lede: string; items: string[]; cta: string };
  contact: { heading: string; lede: string; email: string };
  footer: { demo: string };
};

export const copy: Record<Lang, Copy> = {
  en: {
    meta: {
      title: "Adem Benlechheb, electrical engineer",
      description:
        "Electrical engineer working on power plants, production floors and the software that runs them. Field engineering, software and production planning.",
    },
    nav: { tracks: "What I do", work: "Work", experience: "Experience", hire: "Work with me", contact: "Contact" },
    hero: {
      eyebrow: "Electrical engineer · Algiers, Algeria",
      title: "Power plants, production floors, and the software that runs them.",
      lede:
        "MSc in electrical engineering, top of my class. Fieldwork on gas turbines and the grid. Planning tools in daily use at a cable manufacturer.",
      cv: "Download CV",
      cvHref: "/cv/adem-benlechheb-cv-en.pdf",
      hire: "Work with me",
    },
    tracks: {
      heading: "What I do",
      items: [
        {
          id: "field",
          title: "Field engineering",
          body:
            "Hands-on with power generation and plant equipment: gas-turbine maintenance rounds, grid fault diagnosis, and a high-voltage ozone prototype built and tested in the lab.",
          links: [
            { label: "Ozone device", href: "#work-ozone" },
            { label: "Experience", href: "#experience" },
          ],
        },
        {
          id: "software",
          title: "Software",
          body:
            "Tested desktop apps and ERP extensions that replace fragile spreadsheets and macros, built to run where IT allows nothing: no admin rights, no network.",
          links: [
            { label: "Scheduling tool", href: "#work-scheduler" },
            { label: "dz-cod", href: "#work-dz-cod" },
          ],
        },
        {
          id: "planning",
          title: "Production planning",
          body:
            "Scheduling, raw-material checks and productivity reporting for a multi-section production plant, from the ERP's exports to the shop floor.",
          links: [{ label: "Planning toolkit", href: "#work-toolkit" }],
        },
      ],
    },
    work: {
      heading: "Selected work",
      note: "Visuals for the plant tools use a synthetic demo plant built on public ISA-95 and IEC standards, not real plant data.",
      items: [
        {
          id: "ozone",
          title: "Ozone hand-disinfection device",
          tags: ["Field", "Hardware"],
          body:
            "A touchless tap that makes ozonated water on demand from a cold-plasma generator. Preliminary lab trials cut bacteria by 97–99%, against 93% for an alcohol gel.",
          status: "MSc thesis, 2025 · team of three",
        },
        {
          id: "scheduler",
          title: "Production scheduling tool",
          tags: ["Software", "Planning"],
          body:
            "Machine queues and dated schedules for every section of a cable plant, built from the ERP's daily export. It replaced a VBA macro and runs as a portable app on a locked-down PC.",
          status: "In daily use",
        },
        {
          id: "toolkit",
          title: "Planning toolkit",
          tags: ["Software", "Planning"],
          body:
            "Raw-material checks against stock with substitutes, a shortage outlook, and a productivity report that rates each machine against the day's product mix. All the tools share one data foundation.",
          status: "Built and tested",
        },
        {
          id: "dz-cod",
          title: "dz-cod",
          tags: ["Software", "ERP"],
          body:
            "A cash-on-delivery back office for Algerian online sellers, built on ERPNext: order workflow, courier settlement, returns, and features switched on per client.",
          status: "Open source · launching",
        },
      ],
    },
    experience: {
      heading: "Experience",
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
          body: "Designed the control side of the device: ESP32-S3, relays, hand detection, flow sensing.",
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
      heading: "Work with me",
      lede: "I build small, solid tools for businesses that run on spreadsheets.",
      items: [
        "Excel and Power Query reports that refresh in one click, with no macros",
        "VBA macros replaced by tested desktop apps",
        "Internal tools that work offline, on PCs where you can't install anything",
        "ERPNext set-up and custom apps",
      ],
      cta: "Tell me what you're working with",
    },
    contact: {
      heading: "Contact",
      lede: "Email is best. I reply in English, French or Arabic.",
      email: "Email me",
    },
    footer: { demo: "Plant visuals use synthetic demo data." },
  },

  fr: {
    meta: {
      title: "Adem Benlechheb, ingénieur électricien",
      description:
        "Ingénieur électricien  centrales, ateliers de production et les logiciels qui les font tourner. Ingénierie terrain, logiciel et planification de production.",
    },
    nav: { tracks: "Mon métier", work: "Projets", experience: "Parcours", hire: "Travailler ensemble", contact: "Contact" },
    hero: {
      eyebrow: "Ingénieur électricien · Alger, Algérie",
      title: "Centrales, ateliers de production, et les logiciels qui les font tourner.",
      lede:
        "Master en électrotechnique, major de promotion. Terrain sur turbines à gaz et réseau électrique. Des outils de planification utilisés chaque jour chez un fabricant de câbles.",
      cv: "Télécharger le CV",
      cvHref: "/cv/adem-benlechheb-cv-fr.pdf",
      hire: "Travailler ensemble",
    },
    tracks: {
      heading: "Mon métier",
      items: [
        {
          id: "field",
          title: "Ingénierie terrain",
          body:
            "Production d'électricité et équipements d'usine, sur le terrain  rondes de maintenance sur turbines à gaz, aide au diagnostic de défauts sur le réseau, et un prototype à ozone haute tension construit et testé au laboratoire.",
          links: [
            { label: "Dispositif à ozone", href: "#work-ozone" },
            { label: "Parcours", href: "#experience" },
          ],
        },
        {
          id: "software",
          title: "Logiciel",
          body:
            "Des applications de bureau testées et des extensions d'ERP qui remplacent des tableurs et des macros fragiles, conçues pour tourner là où l'informatique ne permet rien  sans droits admin, sans réseau.",
          links: [
            { label: "Outil d'ordonnancement", href: "#work-scheduler" },
            { label: "dz-cod", href: "#work-dz-cod" },
          ],
        },
        {
          id: "planning",
          title: "Planification de production",
          body:
            "Ordonnancement, contrôle des matières premières et suivi de productivité pour une usine à plusieurs sections, des extractions de l'ERP jusqu'à l'atelier.",
          links: [{ label: "Boîte à outils de planification", href: "#work-toolkit" }],
        },
      ],
    },
    work: {
      heading: "Projets choisis",
      note: "Les visuels des outils d'usine viennent d'une usine de démonstration fictive, construite sur les normes publiques ISA-95 et CEI, et non de données réelles.",
      items: [
        {
          id: "ozone",
          title: "Dispositif de désinfection des mains à l'ozone",
          tags: ["Terrain", "Matériel"],
          body:
            "Un robinet sans contact qui produit de l'eau ozonée à la demande grâce à un générateur à plasma froid. Lors d'essais préliminaires, la charge bactérienne a baissé de 97 à 99 , contre 93  pour un gel hydroalcoolique.",
          status: "Mémoire de master, 2025 · équipe de trois",
        },
        {
          id: "scheduler",
          title: "Outil d'ordonnancement de production",
          tags: ["Logiciel", "Planification"],
          body:
            "Files d'attente par machine et plannings datés pour chaque section d'une câblerie, à partir de l'extraction quotidienne de l'ERP. Il a remplacé une macro VBA et tourne en application portable sur un poste verrouillé.",
          status: "Utilisé chaque jour",
        },
        {
          id: "toolkit",
          title: "Boîte à outils de planification",
          tags: ["Logiciel", "Planification"],
          body:
            "Contrôle des matières face au stock avec substitutions, prévision des ruptures, et un rapport qui juge chaque machine selon le mix de produits du jour. Tous les outils partagent une même base de données.",
          status: "Construit et testé",
        },
        {
          id: "dz-cod",
          title: "dz-cod",
          tags: ["Logiciel", "ERP"],
          body:
            "Un back-office de paiement à la livraison pour les vendeurs en ligne algériens, sur ERPNext  circuit des commandes, règlements des transporteurs, retours, et fonctions activées client par client.",
          status: "Open source · en lancement",
        },
      ],
    },
    experience: {
      heading: "Parcours",
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
            "Rondes de maintenance sur un parc à cycle simple (Ansaldo V94.3A, GE TM2500)  skids gaz, huile de lubrification, air comprimé, eau déminéralisée. Étude du contrôle-commande (Egatrol) et des cas HSE.",
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
          body: "Conception de la partie commande  ESP32-S3, relais, détection des mains, mesure de débit.",
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
      heading: "Travailler ensemble",
      lede: "Je construis de petits outils solides pour les entreprises qui tournent sur des tableurs.",
      items: [
        "Rapports Excel et Power Query qui se mettent à jour en un clic, sans macros",
        "Des macros VBA remplacées par des applications testées",
        "Des outils internes qui marchent hors ligne, sur des postes où l'on ne peut rien installer",
        "Mise en place d'ERPNext et applications sur mesure",
      ],
      cta: "Parlez-moi de votre besoin",
    },
    contact: {
      heading: "Contact",
      lede: "Le plus simple est l'e-mail. Je réponds en français, en anglais ou en arabe.",
      email: "M'écrire",
    },
    footer: { demo: "Les visuels d'usine utilisent des données de démonstration fictives." },
  },
};
