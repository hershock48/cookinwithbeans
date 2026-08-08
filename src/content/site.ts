/**
 * ============================================================
 *  COOKIN' WITH BEANS — SITE CONTENT
 * ============================================================
 *  Everything the owners might want changed lives in this file
 *  and in schedule.ts. Nothing else should need editing to keep
 *  the site current.
 *
 *  Items marked TODO:CONFIRM are unverified. Check them with
 *  the owners before launch.
 * ============================================================
 */

export const site = {
  name: "Cookin' with Beans",
  tagline: "Mini Street Taco Food Truck",
  subtitle: "...A Locias Production",
  blurb: "Mini street taco food truck with big dreams.",
  city: "Marshall, Michigan",

  // TODO:CONFIRM two phone numbers are listed publicly.
  // (269) 781-5163 on the Choose Marshall directory,
  // (901) 581-5743 on the Toast page. Verify which is right.
  phone: "(269) 781-5163",
  phoneHref: "+12697815163",

  // TODO:CONFIRM email address with the owners
  email: "cookinwithbeansmi@gmail.com",

  facebook: "https://www.facebook.com/p/Cookin-with-Beans-61565146847529/",
  instagram: "https://www.instagram.com/cookin.with.beans/",
  toast:
    "https://www.toasttab.com/local/order/cookin-with-beans/r-1b11e616-1cf9-46e9-8e27-5abf465e5aea",

  // TODO:CONFIRM the directory lists 323 W Michigan Ave,
  // Toast lists 707 W Mansion St. Which is the real base?
  baseAddress: "Marshall, MI 49068",

  serviceArea: [
    "Marshall",
    "Battle Creek",
    "Albion",
    "Jackson",
    "Calhoun County",
  ],

  domain: "https://cookinwithbeans.com", // TODO:CONFIRM final domain
} as const;

/* ------------------------------------------------------------
   MENU — taken from the window board on the truck.
   Six steps, exactly as they already sell it.
------------------------------------------------------------ */

export type Choice = {
  id: string;
  label: string;
  note?: string;
  price?: number;
};

export type Step = {
  n: number;
  question: string;
  helper?: string;
  mode: "one" | "many";
  required: boolean;
  choices: Choice[];
};

export const MEATS = [
  {
    id: "pollo",
    label: "Pollo",
    note: "Chicken thigh",
    single: 4,
    triple: 10,
    blurb:
      "Chicken thigh, not breast, because thigh stays juicy on a flat top and breast does not.",
  },
  {
    id: "asada",
    label: "Carne Asada",
    note: "Skirt steak",
    single: 5,
    triple: 12,
    blurb: "Skirt steak, chopped fine, cooked hard and fast.",
  },
] as const;

export const steps: Step[] = [
  {
    n: 2,
    question: "Choose your tortilla",
    mode: "one",
    required: true,
    choices: [
      { id: "corn", label: "Corn" },
      { id: "flour", label: "Flour" },
    ],
  },
  {
    n: 3,
    question: "Choose your toppings",
    helper: "Pick either, both, or neither",
    mode: "many",
    required: false,
    choices: [
      { id: "cilantro", label: "Cilantro" },
      { id: "onion", label: "Onion" },
    ],
  },
  {
    n: 4,
    question: "Choose your sauce",
    helper: "Pick either, both, or neither",
    mode: "many",
    required: false,
    choices: [
      { id: "verde", label: "Salsa Verde", note: "Medium" },
      { id: "picante", label: "Picante", note: "Hot" },
    ],
  },
  {
    n: 5,
    question: "Add cheese?",
    helper: "One dollar extra",
    mode: "many",
    required: false,
    choices: [
      { id: "chihuahua", label: "Chihuahua", note: "Shredded", price: 1 },
      { id: "cotija", label: "Cotija", note: "Crumble", price: 1 },
    ],
  },
  {
    n: 6,
    question: "Add a drink?",
    mode: "many",
    required: false,
    choices: [
      { id: "jarritos", label: "Jarritos", note: "Glass bottle", price: 3 },
      { id: "coke", label: "Coke or Sprite", note: "Glass bottle", price: 4 },
      { id: "water", label: "Bottled Water", price: 2 },
    ],
  },
];

/**
 * TODO:CONFIRM the Toast page also lists a $10 breakfast burrito
 * and a $12 quesadilla, neither of which is on the window board.
 * Either Toast is stale or the board is a summer subset.
 * Set `available: true` once confirmed and they will appear on
 * the menu page.
 */
export const extras = [
  {
    id: "burrito",
    label: "Breakfast Burrito",
    price: 10,
    available: false,
    source: "Toast",
  },
  {
    id: "quesadilla",
    label: "Quesadilla",
    price: 12,
    available: false,
    source: "Toast",
  },
] as const;

export const merch = [
  { id: "tee", label: "T-Shirt", note: "Men's and women's", price: 20 },
] as const;

/* ------------------------------------------------------------
   CATERING
------------------------------------------------------------ */

export const cateringTypes = [
  "Corporate lunch or shift feed",
  "Wedding or rehearsal dinner",
  "Graduation or birthday party",
  "Festival or public event",
  "Brewery, bar, or taproom",
  "Something else",
] as const;

/* ------------------------------------------------------------
   ABOUT
   TODO:CONFIRM every word below is placeholder. We do not yet
   know the owners' names, the story behind "Beans", or what
   "Locias" refers to. Replace before launch.
------------------------------------------------------------ */

export const about = {
  headline: "A small truck with big dreams",
  body: [
    "Cookin' with Beans is a mini street taco truck based in Marshall, Michigan. The truck is small on purpose. It fits where full size rigs cannot, which is how it ends up in plant parking lots at seven in the morning and outside a hardware store the same evening.",
    "The menu is short on purpose too. Pollo or carne asada, corn or flour, and the toppings you actually want. Six decisions and you are eating.",
    "PLACEHOLDER: the owners' story goes here. We still need their names, how the truck started, and what Locias means.",
  ],
  needsReview: true,
};
