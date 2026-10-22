// Case studies, in English and French. Employer rule (see DEMO_DATA_MODEL.md): the employer
// is only "a cable manufacturer"; no real data, names or layouts from its tools.

import type { Lang } from "../i18n/ui.ts";

export type Figure =
  | "ozone-diagram"
  | "ozone-photos"
  | "ozone-results"
  | "gantt"
  | "coverage"
  | "dafter-stack"
  | "dafter-core-shots"
  | "dafter-cod-shots";

export type Section = {
  heading: string;
  body?: string[];
  list?: string[];
  figure?: Figure | Figure[];
};

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  /** One or two sentences for the home-page card. */
  summary: string;
  tags: string[];
  status: string;
  meta: [string, string][];
  sections: Section[];
  links?: { label: string; href: string }[];
  /** Card image, under public/. Plant tools use a drawn figure instead. */
  cover?: { src: string; alt: string };
  coverFigure?: Figure;
};

const CORE_REPO = "https://github.com/adem-max/dafter-core";
const COD_REPO = "https://github.com/adem-max/dafter-cod";

const en: Project[] = [
  {
    slug: "ozone-device",
    title: "Ozone hand-disinfection device",
    tagline: "A touchless tap that makes ozonated water on demand. Built and lab-tested as my MSc thesis.",
    summary:
      "A touchless tap that makes ozonated water on demand from a cold-plasma generator. In preliminary lab trials it cut bacteria on hands by up to 99%, against 93% for an alcohol gel.",
    tags: ["Field", "Hardware"],
    status: "Working prototype · 2025",
    meta: [
      ["Role", "Electronics and control, in a team of three"],
      ["Where", "Alpelec Laboratory, Djillali Liabès University"],
      ["When", "2023 – 2025, defended 23 June 2025"],
      ["Built with", "Cold-plasma ozone generator, Venturi injector, touchless sensing, microcontroller control"],
    ],
    coverFigure: "ozone-diagram",
    sections: [
      {
        heading: "The problem",
        body: [
          "Hand hygiene in hospitals, schools and other busy places relies on alcohol gels and soap. Used many times a day they dry and irritate the skin, leave residues, and produce a steady stream of plastic packaging.",
          "Ozone is one of the strongest disinfectants there is, and it breaks back down into oxygen within minutes. It leaves nothing behind.",
        ],
      },
      {
        heading: "What we built",
        body: [
          "A hand-wash unit that makes ozone from the surrounding air with a cold-plasma (dielectric barrier discharge) generator and dissolves it into tap water as it flows, through a Venturi injector. There is no tank and nothing to refill.",
          "An infrared sensor in the tap starts the whole system when hands come close and stops it the moment they leave, so no water or power is wasted between users.",
        ],
        figure: ["ozone-diagram", "ozone-photos"],
      },
      {
        heading: "My part",
        body: [
          "I worked on the electronics and control, including the safety mechanism that detects gas and steps in to shut the system down.",
          "Some design details are left out here while patent work is in progress.",
        ],
      },
      {
        heading: "How we tested it",
        body: [
          "We counted bacteria on hands before and after washing, in four conditions: ozonated water for 15 s and for 30 s with the generator fed by ambient air, for 15 s fed by an oxygen concentrator, and an alcohol gel for 15 s as the reference.",
        ],
        figure: "ozone-results",
      },
      {
        heading: "What the results say",
        body: [
          "These are single preliminary trials, not a clinical study. They still show the two levers that matter: contact time and ozone concentration. With ambient air, doubling the contact time took the reduction from 51% to 97%. Feeding the generator oxygen got to 99% in 15 s, better than the gel.",
          "The next step is closed-loop control: dissolved-ozone and water-quality sensors (temperature, pH) so the unit can hold the concentration where it works, plus remote monitoring.",
        ],
      },
      {
        heading: "Team",
        body: [
          "Built with Imène Kechemir and Ilham Asmaa Medjdoubi. Supervised by Dr Saïd Nemmich, Pr Kamel Nassour and Pr Amar Tilmatine, with the mechanical design by Mohammed Khalil Salem.",
        ],
      },
    ],
  },
  {
    slug: "scheduler",
    title: "Production scheduling tool",
    tagline: "Machine queues and dated schedules for every section of a cable plant, built from the ERP's daily export.",
    summary:
      "Machine queues and dated schedules for every section of a cable plant, built from the ERP's daily export. It replaced a VBA macro and runs as a portable app on a locked-down PC.",
    tags: ["Software", "Planning"],
    status: "In daily use",
    meta: [
      ["Role", "Designed, built and used it, as the plant's planner"],
      ["Where", "A cable manufacturer"],
      ["When", "2025 – 2026"],
      ["Built with", "Tauri 2, React, TypeScript, Rust, Vitest, SheetJS, ExcelJS"],
    ],
    coverFigure: "gantt",
    sections: [
      {
        heading: "The problem",
        body: [
          "Scheduling ran through a VBA macro in Excel. It rebuilt the queues from scratch every day, so every manual decision (the order of jobs, holds, a job moved to another machine) had to be redone by hand. A small change in the export could break it.",
        ],
      },
      {
        heading: "The constraints",
        list: [
          "A locked-down work PC: no admin rights, no installer, no programming runtimes allowed by policy.",
          "No network access, Office 2019.",
          "So the tool had to be one portable file that just runs.",
        ],
      },
      {
        heading: "What I built",
        body: [
          "A desktop app that imports the ERP's daily job export and reconciles it with the plan already in place. It keeps the sequence, holds, machine moves and manual speeds, and applies only what changed in the ERP. From that it builds a dated schedule per machine: queues, start and end times, and holds that let the next job move up so no machine time is lost.",
          "Each section gets its schedule as an Excel file made to be read on the floor, and a KPI page shows load and backlog.",
        ],
        figure: "gantt",
      },
      {
        heading: "Design choices",
        list: [
          "Reconcile, don't rebuild. Each import keeps every planning decision and changes only what the ERP changed.",
          "Every rule is written down, numbered, with its reason and a test. Over forty of them, so the next person can see why the schedule looks the way it does.",
          "A pure, tested core, kept apart from the screens and the files, so the rules can be checked without opening the app.",
        ],
      },
      {
        heading: "How I checked it",
        body: [
          "Unit tests on the core, then a side-by-side run against the old macro on a full day's orders. Nothing was missing and the quantities matched. The app also kept open jobs the macro had been dropping.",
        ],
      },
    ],
  },
  {
    slug: "planning-toolkit",
    title: "Planning toolkit",
    tagline: "Raw-material checks, a shortage outlook and a fairer productivity measure, on one shared data foundation.",
    summary:
      "Raw-material checks against stock with substitutes, a shortage outlook, and a productivity report that rates each machine against the day's product mix. All the tools share one data foundation.",
    tags: ["Software", "Planning"],
    status: "Built and tested",
    meta: [
      ["Role", "Designed and built it, as the plant's planner"],
      ["Where", "A cable manufacturer"],
      ["When", "2026"],
      ["Built with", "TypeScript, React, Tauri, Excel and Power Query, Node test runner"],
    ],
    coverFigure: "coverage",
    sections: [
      {
        heading: "The problem",
        body: [
          "Every spreadsheet and macro read the ERP export in its own way, so the same figure could differ from one report to the next. Material checks were done by another macro. Machine productivity was measured against one fixed rate per machine, which was unfair to a machine that ran thin wire or changed size often.",
        ],
      },
      {
        heading: "One foundation",
        list: [
          "Shared definitions (machines, materials, densities, the order of operations) are kept in one place and read by every tool.",
          "Tools share data only through documented files, so one can change inside without breaking another.",
          "Every KPI has one written definition, so the same number means the same thing everywhere.",
          "Small tools that each do one job, rather than one large app.",
        ],
      },
      {
        heading: "Material planner",
        body: [
          "Works out the raw material that a list of orders, all open orders, or the published schedule still needs. It checks that against stock, including approved substitutes, and shows when each material will run short and how many days of cover are left. It replaced a macro.",
        ],
        figure: "coverage",
      },
      {
        heading: "Productivity report",
        body: [
          "Instead of a fixed rate, each machine-day gets a rate that follows what it actually made: the sizes, their lengths, each size's standard speed, and the time lost changing over. Productivity is the actual output against that rate. It's an Excel workbook with Power Query and formulas, no macros, and it runs on Excel 2019.",
        ],
      },
      {
        heading: "How I checked it",
        body: [
          "The material planner has over a hundred automated tests. The reports are checked by scripts that recompute every figure independently from sample files.",
        ],
      },
    ],
  },
  {
    slug: "dafterdz",
    title: "DafterDZ",
    tagline: "An ERP for Algerian small businesses, built on ERPNext: workshops, food producers and online sellers, each set up in one command and run from one vendor hub.",
    summary:
      "An ERP for Algerian small businesses, built on ERPNext: legal invoices and SCF accounting, costing and stock for producers, cash on delivery for online sellers, and a hub that sets up and bills every client.",
    tags: ["Software", "ERP", "Product"],
    status: "Version 0.4 · preparing launch",
    meta: [
      ["Role", "Founder, designer and developer"],
      ["When", "2026"],
      ["Built with", "Python, Frappe v16, ERPNext v16, MariaDB, JavaScript, GitHub Actions"],
      ["Code", "Two public repositories; the vendor hub is private"],
    ],
    links: [
      { label: "Core on GitHub", href: CORE_REPO },
      { label: "Online sales on GitHub", href: COD_REPO },
    ],
    coverFigure: "dafter-stack",
    sections: [
      {
        heading: "The problem",
        body: [
          "Algerian small businesses (food producers, clothing workshops, online shops) run on notebooks, Excel and generic software that knows nothing of Algerian invoices, tax regimes or the SCF chart of accounts. ERPNext can do all of it, but it takes weeks of setup before it fits an Algerian business.",
          "From January 2027 the rules tighten: accounting software sold in Algeria must come with a signed publisher's commitment, and the books must be handed over on request.",
        ],
      },
      {
        heading: "What it is",
        body: [
          "Three apps on top of an ERPNext that is never edited. A client gets the core, and the online-sales pack if they sell online. A private hub, the vendor's own site, manages every client.",
        ],
        figure: "dafter-stack",
        list: [
          "Core, for every client: setup in one command (French, Algerian dinar, Algerian chart of accounts), templates for food and cosmetics and for clothing, the IFU, auto-entrepreneur and régime réel tax regimes with VAT per rate, legal invoices and delivery notes, an Excel import workbook checked before anything is created, the 69 wilayas, and daily off-site backups with a restore test.",
          "Online sales, an add-on: the cash-on-delivery order workflow, couriers and returns, and the courier's cash settlement booked in the accounts. Direct sales to shops and wholesalers work alongside it.",
          "The vendor hub: clients, packs and options, monthly invoices through ERPNext subscriptions, the list of clients who are late, and buttons that create a client's site, switch its features and suspend it when it isn't paid.",
        ],
      },
      {
        heading: "For producers",
        body: [
          "Each user lands on a home page for their role: today's sales, orders to deliver, work in progress, the materials under their reorder level and overdue invoices. The reports a workshop needs are one click away: the cost price of each product from its recipe at today's prices, what to produce, what to buy, the stock value per warehouse, and sales per month.",
        ],
        figure: "dafter-core-shots",
      },
      {
        heading: "Accounting and compliance",
        list: [
          "Every ledger line has a journal, and the entries export in the FEC layout with a hash, so an accountant's software can import them.",
          "An audit trail records the user, IP address and browser on every validation, cancellation and later change.",
          "The ledger can't be rewritten and accounting documents can't be deleted. Yearly archives are kept with their SHA-256 hash for the ten years the law requires.",
          "Draft SCF statements (balance sheet and income statement), a year-end close and the accountant's closing file. The statements stay marked as drafts until an accountant validates them.",
        ],
      },
      {
        heading: "For online sellers",
        list: [
          "An order goes from new to confirmed, prepared, shipped, delivered and settled, with unreachable, returned and cancelled along the way. Stock is reserved on confirmation.",
          "The parcel stays in a courier warehouse until it is delivered. Delivery makes the invoice; a return goes back to stock after inspection.",
          "Shipping fees by wilaya, a courier connector for Yalidine, and webhooks for automation.",
        ],
        figure: "dafter-cod-shots",
      },
      {
        heading: "How it's built",
        list: [
          "What every client needs goes in the core. The core never depends on the add-ons; they plug into it, so a workshop's site carries nothing it doesn't use.",
          "The three apps share one version number, and an add-on refuses to run on an older core.",
          "Every design decision is written down with its reason, in each repository.",
          "Over 250 automated tests (110 core, 121 online sales, 22 hub). Every push runs the linters and all the suites on a fresh ERPNext site on GitHub.",
          "Three demo companies, a food producer, a clothing workshop and an online shop, load with 13 weeks of history in one command.",
        ],
      },
      {
        heading: "Where it stands",
        body: [
          "Version 0.4 was released in the three repositories on 22 October 2026. Before the first clients go live, an accountant has to validate the statements, the IFU rates and the stamp duty, and the courier connector has to be checked against a real account.",
        ],
      },
    ],
  },
];

const fr: Project[] = [
  {
    slug: "ozone-device",
    title: "Dispositif de désinfection des mains à l'ozone",
    tagline: "Un robinet sans contact qui produit de l'eau ozonée à la demande. Conçu et testé en laboratoire pour mon mémoire de master.",
    summary:
      "Un robinet sans contact qui produit de l'eau ozonée à la demande grâce à un générateur à plasma froid. Lors d'essais préliminaires, la charge bactérienne sur les mains a baissé jusqu'à 99 %, contre 93 % pour un gel hydroalcoolique.",
    tags: ["Terrain", "Matériel"],
    status: "Prototype fonctionnel · 2025",
    meta: [
      ["Rôle", "Électronique et commande, dans une équipe de trois"],
      ["Où", "Laboratoire Alpelec, Université Djillali Liabès"],
      ["Quand", "2023 – 2025, soutenu le 23 juin 2025"],
      ["Matériel", "Générateur d'ozone à plasma froid, injecteur Venturi, détection sans contact, commande par microcontrôleur"],
    ],
    coverFigure: "ozone-diagram",
    sections: [
      {
        heading: "Le problème",
        body: [
          "L'hygiène des mains dans les hôpitaux, les écoles et les lieux très fréquentés repose sur les gels hydroalcooliques et le savon. Utilisés plusieurs fois par jour, ils dessèchent et irritent la peau, laissent des résidus et produisent un flux continu d'emballages plastiques.",
          "L'ozone est l'un des désinfectants les plus puissants, et il se redécompose en oxygène en quelques minutes. Il ne laisse rien derrière lui.",
        ],
      },
      {
        heading: "Ce que nous avons construit",
        body: [
          "Un lave-mains qui produit de l'ozone à partir de l'air ambiant avec un générateur à plasma froid (décharge à barrière diélectrique) et le dissout dans l'eau du robinet pendant qu'elle coule, grâce à un injecteur Venturi. Pas de réservoir, rien à recharger.",
          "Un capteur infrarouge dans le robinet démarre tout le système quand les mains approchent et l'arrête dès qu'elles s'éloignent : ni eau ni énergie perdues entre deux utilisateurs.",
        ],
        figure: ["ozone-diagram", "ozone-photos"],
      },
      {
        heading: "Ma part",
        body: [
          "J'ai travaillé sur l'électronique et la commande, dont le mécanisme de sécurité qui détecte le gaz et intervient pour arrêter le système.",
          "Certains détails de conception ne sont pas présentés ici, une demande de brevet étant en cours.",
        ],
      },
      {
        heading: "Comment nous l'avons testé",
        body: [
          "Nous avons compté les bactéries sur les mains avant et après lavage, dans quatre conditions : eau ozonée pendant 15 s et 30 s avec le générateur alimenté en air ambiant, pendant 15 s alimenté par un concentrateur d'oxygène, et un gel hydroalcoolique pendant 15 s comme référence.",
        ],
        figure: "ozone-results",
      },
      {
        heading: "Ce que disent les résultats",
        body: [
          "Ce sont des essais préliminaires uniques, pas une étude clinique. Ils montrent pourtant les deux leviers qui comptent : le temps de contact et la concentration en ozone. Avec l'air ambiant, doubler le temps de contact fait passer la réduction de 51 % à 97 %. Alimenter le générateur en oxygène atteint 99 % en 15 s, mieux que le gel.",
          "L'étape suivante est la régulation en boucle fermée : des capteurs d'ozone dissous et de qualité de l'eau (température, pH) pour maintenir la concentration là où elle est efficace, et un suivi à distance.",
        ],
      },
      {
        heading: "L'équipe",
        body: [
          "Réalisé avec Imène Kechemir et Ilham Asmaa Medjdoubi. Encadré par le Dr Saïd Nemmich, le Pr Kamel Nassour et le Pr Amar Tilmatine, avec la conception mécanique de Mohammed Khalil Salem.",
        ],
      },
    ],
  },
  {
    slug: "scheduler",
    title: "Outil d'ordonnancement de production",
    tagline: "Files d'attente par machine et plannings datés pour chaque section d'une câblerie, à partir de l'extraction quotidienne de l'ERP.",
    summary:
      "Files d'attente par machine et plannings datés pour chaque section d'une câblerie, à partir de l'extraction quotidienne de l'ERP. Il a remplacé une macro VBA et tourne en application portable sur un poste verrouillé.",
    tags: ["Logiciel", "Planification"],
    status: "Utilisé chaque jour",
    meta: [
      ["Rôle", "Conçu, développé et utilisé en tant que planificateur de l'usine"],
      ["Où", "Un fabricant de câbles"],
      ["Quand", "2025 – 2026"],
      ["Technologies", "Tauri 2, React, TypeScript, Rust, Vitest, SheetJS, ExcelJS"],
    ],
    coverFigure: "gantt",
    sections: [
      {
        heading: "Le problème",
        body: [
          "L'ordonnancement passait par une macro VBA dans Excel. Elle reconstruisait les files à partir de zéro chaque jour : chaque décision manuelle (l'ordre des ordres de fabrication, les blocages, un ordre déplacé sur une autre machine) était à refaire. Un petit changement dans l'extraction pouvait la casser.",
        ],
      },
      {
        heading: "Les contraintes",
        list: [
          "Un poste de travail verrouillé : pas de droits administrateur, pas d'installateur, aucun langage de programmation autorisé.",
          "Pas d'accès réseau, Office 2019.",
          "L'outil devait donc être un seul fichier portable qui se lance tel quel.",
        ],
      },
      {
        heading: "Ce que j'ai construit",
        body: [
          "Une application de bureau qui importe l'extraction quotidienne des ordres de l'ERP et la rapproche du planning déjà en place. Elle conserve l'ordre, les blocages, les changements de machine et les vitesses saisies, et n'applique que ce que l'ERP a changé. Elle en tire un planning daté par machine : files, heures de début et de fin, et des blocages qui laissent avancer l'ordre suivant pour ne pas perdre de temps machine.",
          "Chaque section reçoit son planning dans un fichier Excel fait pour être lu en atelier, et une page d'indicateurs montre la charge et le carnet.",
        ],
        figure: "gantt",
      },
      {
        heading: "Choix de conception",
        list: [
          "Rapprocher plutôt que reconstruire : chaque import conserve toutes les décisions de planification et ne change que ce que l'ERP a changé.",
          "Chaque règle est écrite, numérotée, avec sa raison et un test. Plus de quarante, pour que le suivant comprenne pourquoi le planning est ce qu'il est.",
          "Un cœur de calcul pur et testé, séparé des écrans et des fichiers, pour vérifier les règles sans ouvrir l'application.",
        ],
      },
      {
        heading: "Comment je l'ai vérifié",
        body: [
          "Des tests unitaires sur le cœur, puis une comparaison avec l'ancienne macro sur une journée complète d'ordres. Rien ne manquait et les quantités concordaient. L'application conservait aussi des ordres ouverts que la macro perdait.",
        ],
      },
    ],
  },
  {
    slug: "planning-toolkit",
    title: "Boîte à outils de planification",
    tagline: "Contrôle des matières, prévision des ruptures et une mesure de productivité plus juste, sur une même base de données.",
    summary:
      "Contrôle des matières face au stock avec substitutions, prévision des ruptures, et un rapport qui juge chaque machine selon le mix de produits du jour. Tous les outils partagent une même base de données.",
    tags: ["Logiciel", "Planification"],
    status: "Construit et testé",
    meta: [
      ["Rôle", "Conçu et développé en tant que planificateur de l'usine"],
      ["Où", "Un fabricant de câbles"],
      ["Quand", "2026"],
      ["Technologies", "TypeScript, React, Tauri, Excel et Power Query, Node test runner"],
    ],
    coverFigure: "coverage",
    sections: [
      {
        heading: "Le problème",
        body: [
          "Chaque tableur et chaque macro lisait l'extraction de l'ERP à sa façon : un même chiffre pouvait changer d'un rapport à l'autre. Le contrôle des matières passait par une autre macro. La productivité des machines était mesurée contre une cadence fixe par machine, injuste pour une machine qui produit du fil fin ou change souvent de section.",
        ],
      },
      {
        heading: "Une seule base",
        list: [
          "Les définitions communes (machines, matières, densités, ordre des opérations) sont tenues à un seul endroit et lues par tous les outils.",
          "Les outils ne partagent des données que par des fichiers documentés : l'un peut évoluer sans casser l'autre.",
          "Chaque indicateur a une seule définition écrite : un même chiffre veut dire la même chose partout.",
          "De petits outils qui font chacun un travail, plutôt qu'une grosse application.",
        ],
      },
      {
        heading: "Planificateur de matières",
        body: [
          "Calcule la matière première dont une liste d'ordres, tous les ordres ouverts ou le planning publié ont encore besoin. Il la compare au stock, substitutions autorisées comprises, et montre quand chaque matière va manquer et combien de jours de couverture il reste. Il a remplacé une macro.",
        ],
        figure: "coverage",
      },
      {
        heading: "Rapport de productivité",
        body: [
          "Au lieu d'une cadence fixe, chaque journée-machine reçoit une cadence qui suit ce qu'elle a réellement produit : les sections, leurs longueurs, la vitesse standard de chacune et le temps perdu aux changements. La productivité, c'est la production réelle rapportée à cette cadence. C'est un classeur Excel avec Power Query et des formules, sans macros, compatible Excel 2019.",
        ],
      },
      {
        heading: "Comment je l'ai vérifié",
        body: [
          "Le planificateur de matières a plus d'une centaine de tests automatiques. Les rapports sont vérifiés par des scripts qui recalculent chaque chiffre indépendamment à partir de fichiers d'exemple.",
        ],
      },
    ],
  },
  {
    slug: "dafterdz",
    title: "DafterDZ",
    tagline: "Un ERP pour les petites entreprises algériennes, construit sur ERPNext : ateliers, producteurs alimentaires et vendeurs en ligne, chacun installé en une commande et géré depuis un même hub éditeur.",
    summary:
      "Un ERP pour les petites entreprises algériennes, sur ERPNext : factures légales et comptabilité SCF, coûts et stock pour les producteurs, paiement à la livraison pour les vendeurs en ligne, et un hub qui installe et facture chaque client.",
    tags: ["Logiciel", "ERP", "Produit"],
    status: "Version 0.4 · en préparation du lancement",
    meta: [
      ["Rôle", "Fondateur, concepteur et développeur"],
      ["Quand", "2026"],
      ["Technologies", "Python, Frappe v16, ERPNext v16, MariaDB, JavaScript, GitHub Actions"],
      ["Code", "Deux dépôts publics ; le hub éditeur est privé"],
    ],
    links: [
      { label: "Le cœur sur GitHub", href: CORE_REPO },
      { label: "La vente en ligne sur GitHub", href: COD_REPO },
    ],
    coverFigure: "dafter-stack",
    sections: [
      {
        heading: "Le problème",
        body: [
          "Les petites entreprises algériennes (producteurs alimentaires, ateliers de confection, boutiques en ligne) tournent sur des cahiers, Excel et des logiciels génériques qui ignorent la facture algérienne, les régimes fiscaux et le plan comptable SCF. ERPNext sait tout faire, mais il faut des semaines de paramétrage avant qu'il colle à une entreprise algérienne.",
          "À partir de janvier 2027, les règles se durcissent : un logiciel comptable vendu en Algérie doit être livré avec un engagement signé de l'éditeur, et la comptabilité doit pouvoir être remise sur demande.",
        ],
      },
      {
        heading: "Ce que c'est",
        body: [
          "Trois applications au-dessus d'un ERPNext jamais modifié. Un client reçoit le cœur, et le pack vente en ligne s'il vend en ligne. Un hub privé, le site de l'éditeur, gère tous les clients.",
        ],
        figure: "dafter-stack",
        list: [
          "Le cœur, pour chaque client : mise en place en une commande (français, dinar algérien, plan comptable algérien), modèles pour l'alimentaire et la cosmétique et pour la confection, les régimes IFU, auto-entrepreneur et réel avec la TVA par taux, factures et bons de livraison légaux, un classeur Excel d'import vérifié avant toute création, les 69 wilayas, et des sauvegardes quotidiennes hors du serveur avec un test de restauration.",
          "La vente en ligne, en option : le circuit des commandes en paiement à la livraison, les transporteurs et les retours, et le versement du transporteur passé en comptabilité. Les ventes directes aux magasins et aux grossistes fonctionnent à côté.",
          "Le hub éditeur : clients, packs et options, factures mensuelles par les abonnements d'ERPNext, la liste des clients en retard, et des boutons qui créent le site d'un client, activent ses fonctions et le suspendent s'il ne paie pas.",
        ],
      },
      {
        heading: "Pour les producteurs",
        body: [
          "Chaque utilisateur arrive sur une page d'accueil propre à son rôle : ventes du jour, commandes à livrer, fabrication en cours, matières sous leur seuil et factures en retard. Les rapports dont un atelier a besoin sont à un clic : le coût de revient de chaque produit d'après sa recette aux prix du jour, ce qu'il faut produire, ce qu'il faut acheter, la valeur du stock par entrepôt et les ventes par mois.",
        ],
        figure: "dafter-core-shots",
      },
      {
        heading: "Comptabilité et conformité",
        list: [
          "Chaque ligne d'écriture a un journal, et les écritures s'exportent au format FEC avec une empreinte, pour que le logiciel du comptable les importe.",
          "Une piste d'audit enregistre l'utilisateur, l'adresse IP et le navigateur à chaque validation, annulation et modification ultérieure.",
          "Les écritures ne peuvent pas être réécrites ni les pièces comptables supprimées. Les archives annuelles sont conservées avec leur empreinte SHA-256 pendant les dix ans exigés par la loi.",
          "Des états SCF en projet (bilan et compte de résultat), une clôture d'exercice et le dossier de clôture du comptable. Les états restent marqués « projet » jusqu'à leur validation par un comptable.",
        ],
      },
      {
        heading: "Pour les vendeurs en ligne",
        list: [
          "Une commande passe de nouvelle à confirmée, préparée, expédiée, livrée et réglée, avec injoignable, retournée et annulée en chemin. Le stock est réservé à la confirmation.",
          "Le colis reste dans un entrepôt « chez le transporteur » jusqu'à la livraison. La livraison fait la facture ; un retour revient en stock après contrôle.",
          "Frais de livraison par wilaya, un connecteur transporteur pour Yalidine, et des webhooks pour l'automatisation.",
        ],
        figure: "dafter-cod-shots",
      },
      {
        heading: "Comment c'est construit",
        list: [
          "Ce dont chaque client a besoin va dans le cœur. Le cœur ne dépend jamais des options ; elles s'y branchent, et le site d'un atelier n'embarque rien qu'il n'utilise pas.",
          "Les trois applications partagent un même numéro de version, et une option refuse de tourner sur un cœur plus ancien.",
          "Chaque décision de conception est écrite avec sa raison, dans chaque dépôt.",
          "Plus de 250 tests automatiques (110 pour le cœur, 121 pour la vente en ligne, 22 pour le hub). Chaque envoi sur GitHub lance les contrôles de code et toutes les suites sur un site ERPNext neuf.",
          "Trois entreprises de démonstration, un producteur alimentaire, un atelier de confection et une boutique en ligne, se chargent avec 13 semaines d'historique en une commande.",
        ],
      },
      {
        heading: "Où en est le projet",
        body: [
          "La version 0.4 est sortie dans les trois dépôts le 22 octobre 2026. Avant la mise en service des premiers clients, un comptable doit valider les états, les taux de l'IFU et le droit de timbre, et le connecteur transporteur doit être vérifié sur un vrai compte.",
        ],
      },
    ],
  },
];

/** French typography: a no-break space before : ; ! ? and %. */
function frTypo<T>(value: T): T {
  if (typeof value === "string") return value.replace(/ ([:;!?%])/g, " $1") as T;
  if (Array.isArray(value)) return value.map(frTypo) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, k === "href" || k === "src" ? v : frTypo(v)])) as T;
  }
  return value;
}

export const projects: Record<Lang, Project[]> = { en, fr: frTypo(fr) };

export function getProject(lang: Lang, slug: string): Project {
  const p = projects[lang].find((x) => x.slug === slug);
  if (!p) throw new Error(`No project ${slug} in ${lang}`);
  return p;
}
