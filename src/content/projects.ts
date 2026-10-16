// Case studies, in English and French. Employer rule (see DEMO_DATA_MODEL.md): the employer
// is only "a cable manufacturer"; no real data, names or layouts from its tools.

import type { Lang } from "../i18n/ui.ts";

export type Figure = "ozone-photos" | "ozone-results" | "gantt" | "coverage" | "dzcod-shots";

export type Section = {
  heading: string;
  body?: string[];
  list?: string[];
  figure?: Figure;
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
  link?: { label: string; href: string };
  /** Card image, under public/. Plant tools use a drawn figure instead. */
  cover?: { src: string; alt: string };
  coverFigure?: Figure;
};

const DZ_REPO = "https://github.com/adem-max/dz-cod";

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
    cover: { src: "/img/ozone/unit-corridor.jpg", alt: "The hand-wash unit, a white cabinet with a steel basin and an automatic tap, in a corridor" },
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
        figure: "ozone-photos",
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
    slug: "dz-cod",
    title: "dz-cod",
    tagline: "A cash-on-delivery back office for Algerian online sellers, built as an app on ERPNext.",
    summary:
      "A cash-on-delivery back office for Algerian online sellers, built on ERPNext: order workflow, courier settlement, returns, and features switched on per client.",
    tags: ["Software", "ERP"],
    status: "Open source · launching",
    meta: [
      ["Role", "Founder, designer and developer"],
      ["When", "2026"],
      ["Built with", "Python, Frappe v16, ERPNext v16, MariaDB, JavaScript"],
      ["Code", "github.com/adem-max/dz-cod"],
    ],
    link: { label: "View the code on GitHub", href: DZ_REPO },
    coverFigure: "dzcod-shots",
    sections: [
      {
        heading: "The problem",
        body: [
          "Most online shops in Algeria sell through Instagram and Facebook and get paid in cash on delivery. Orders are confirmed by phone, a large share are refused at the door, and courier companies pay the cash back in batches. Spreadsheets and generic ERPs model none of that.",
        ],
      },
      {
        heading: "What it does",
        list: [
          "An order workflow from new to confirmed, prepared, shipped, delivered and settled, with unreachable, returned and cancelled along the way.",
          "Stock reserved when an order is confirmed; shipping fees by wilaya.",
          "Hand-over to the courier, return inspection, and the courier's cash settlement, with what each courier still owes.",
          "Daily reports, and optional features switched on per client.",
        ],
        figure: "dzcod-shots",
      },
      {
        heading: "Design choices",
        list: [
          "Built on ERPNext rather than from scratch: accounting, stock and users come for free, and sellers can grow into the full ERP.",
          "The order life cycle is a standard ERPNext workflow, so it can be changed without code.",
          "Optional features are set per client in the server's configuration, which clients can't edit.",
        ],
      },
      {
        heading: "How I checked it",
        body: [
          "Over ninety automated tests, unit and integration, run on a real ERPNext site. A backup-and-restore drill, and a demo shop that loads in a couple of minutes.",
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
    cover: { src: "/img/ozone/unit-corridor.jpg", alt: "Le lave-mains, un meuble blanc avec une vasque en inox et un robinet automatique, dans un couloir" },
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
        figure: "ozone-photos",
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
    slug: "dz-cod",
    title: "dz-cod",
    tagline: "Un back-office de paiement à la livraison pour les vendeurs en ligne algériens, construit comme une application sur ERPNext.",
    summary:
      "Un back-office de paiement à la livraison pour les vendeurs en ligne algériens, sur ERPNext : circuit des commandes, règlements des transporteurs, retours, et fonctions activées client par client.",
    tags: ["Logiciel", "ERP"],
    status: "Open source · en lancement",
    meta: [
      ["Rôle", "Fondateur, concepteur et développeur"],
      ["Quand", "2026"],
      ["Technologies", "Python, Frappe v16, ERPNext v16, MariaDB, JavaScript"],
      ["Code", "github.com/adem-max/dz-cod"],
    ],
    link: { label: "Voir le code sur GitHub", href: DZ_REPO },
    coverFigure: "dzcod-shots",
    sections: [
      {
        heading: "Le problème",
        body: [
          "La plupart des boutiques en ligne algériennes vendent sur Instagram et Facebook et sont payées à la livraison. Les commandes sont confirmées par téléphone, une grande part est refusée à la porte, et les transporteurs reversent l'argent par lots. Ni les tableurs ni les ERP génériques ne savent gérer cela.",
        ],
      },
      {
        heading: "Ce qu'il fait",
        list: [
          "Un circuit de commande : nouvelle, confirmée, préparée, expédiée, livrée, réglée, avec injoignable, retournée et annulée en chemin.",
          "Stock réservé à la confirmation ; frais de livraison par wilaya.",
          "Remise au transporteur, contrôle des retours, et versement des transporteurs, avec ce que chacun doit encore.",
          "Rapports quotidiens, et fonctions optionnelles activées client par client.",
        ],
        figure: "dzcod-shots",
      },
      {
        heading: "Choix de conception",
        list: [
          "Construit sur ERPNext plutôt que de zéro : comptabilité, stock et utilisateurs sont déjà là, et le vendeur peut grandir vers l'ERP complet.",
          "Le cycle de vie des commandes est un workflow ERPNext standard, modifiable sans code.",
          "Les fonctions optionnelles sont réglées par client dans la configuration du serveur, que les clients ne peuvent pas modifier.",
        ],
      },
      {
        heading: "Comment je l'ai vérifié",
        body: [
          "Plus de quatre-vingt-dix tests automatiques, unitaires et d'intégration, sur un vrai site ERPNext. Un exercice de sauvegarde et de restauration, et une boutique de démonstration qui se charge en quelques minutes.",
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
