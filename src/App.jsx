import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Shield,
  Sword,
  Heart,
  HeartPulse,
  Backpack,
  NotebookPen,
  Save,
  Download,
  Upload,
  RotateCcw,
  Dices,
  Plus,
  Trash2,
  WandSparkles,
  ChevronLeft,
  ChevronRight,
  Crosshair,
  RefreshCcw,
  X,
} from "lucide-react";

const APP_TITLE = "Z-Land Character Sheet";
const STORAGE_KEY = "zland-character-sheet-v7-clean";

const skillOrder = [
  "Athletics",
  "Broad-Craft",
  "Burglary",
  "Constitution",
  "Deceive",
  "Diplomacy",
  "Drive",
  "Fight",
  "Fine-Craft",
  "Intimidate",
  "Intuition",
  "Investigate",
  "Logic",
  "Luck",
  "Might",
  "Perception",
  "Shoot",
  "Stealth",
  "Wealth",
  "Will",
];

const physicalSkills = new Set([
  "Athletics",
  "Burglary",
  "Constitution",
  "Drive",
  "Fight",
  "Might",
  "Perception",
  "Shoot",
  "Stealth",
]);

const mentalAffectedSkills = new Set([
  "Deceive",
  "Diplomacy",
  "Intimidate",
  "Intuition",
  "Logic",
  "Perception",
]);

const hitLocations = [
  { key: "head", label: "Head", range: "1-10" },
  { key: "torso", label: "Torso", range: "11-40" },
  { key: "leftArm", label: "Left Arm", range: "41-55" },
  { key: "rightArm", label: "Right Arm", range: "56-70" },
  { key: "leftLeg", label: "Left Leg", range: "71-85" },
  { key: "rightLeg", label: "Right Leg", range: "86-100" },
];

const tabList = [
  { key: "overview", label: "Overview", icon: User },
  { key: "skills", label: "Skills", icon: Shield },
  { key: "combat", label: "Combat", icon: Sword },
  { key: "health", label: "Health", icon: Heart },
  { key: "survival", label: "Survival", icon: HeartPulse },
  { key: "inventory", label: "Inventory", icon: Backpack },
  { key: "notes", label: "Notes", icon: NotebookPen },
];

const archetypes = {
  Academic: { Athletics: 30, "Broad-Craft": 40, Burglary: 30, Constitution: 30, Deceive: 40, Diplomacy: 30, Drive: 30, Fight: 30, "Fine-Craft": 40, Intimidate: 30, Intuition: 40, Investigate: 50, Logic: 55, Luck: 50, Might: 30, Perception: 30, Shoot: 30, Stealth: 40, Wealth: 30, Will: 40 },
  Artist: { Athletics: 30, "Broad-Craft": 40, Burglary: 40, Constitution: 30, Deceive: 55, Diplomacy: 50, Drive: 30, Fight: 30, "Fine-Craft": 30, Intimidate: 40, Intuition: 40, Investigate: 30, Logic: 30, Luck: 50, Might: 30, Perception: 30, Shoot: 30, Stealth: 40, Wealth: 40, Will: 30 },
  Athlete: { Athletics: 55, "Broad-Craft": 30, Burglary: 40, Constitution: 50, Deceive: 30, Diplomacy: 30, Drive: 30, Fight: 30, "Fine-Craft": 30, Intimidate: 30, Intuition: 30, Investigate: 50, Logic: 40, Luck: 30, Might: 40, Perception: 30, Shoot: 40, Stealth: 40, Wealth: 30, Will: 40 },
  Bureaucrat: { Athletics: 30, "Broad-Craft": 30, Burglary: 30, Constitution: 30, Deceive: 50, Diplomacy: 55, Drive: 30, Fight: 30, "Fine-Craft": 50, Intimidate: 40, Intuition: 40, Investigate: 40, Logic: 40, Luck: 30, Might: 30, Perception: 40, Shoot: 30, Stealth: 30, Wealth: 40, Will: 30 },
  Cleric: { Athletics: 30, "Broad-Craft": 40, Burglary: 30, Constitution: 30, Deceive: 30, Diplomacy: 50, Drive: 30, Fight: 30, "Fine-Craft": 30, Intimidate: 30, Intuition: 55, Investigate: 40, Logic: 40, Luck: 40, Might: 30, Perception: 40, Shoot: 30, Stealth: 30, Wealth: 40, Will: 50 },
  Hobo: { Athletics: 40, "Broad-Craft": 30, Burglary: 50, Constitution: 30, Deceive: 40, Diplomacy: 30, Drive: 40, Fight: 40, "Fine-Craft": 30, Intimidate: 50, Intuition: 30, Investigate: 30, Logic: 30, Luck: 30, Might: 40, Perception: 30, Shoot: 40, Stealth: 55, Wealth: 30, Will: 30 },
  Policeman: { Athletics: 40, "Broad-Craft": 30, Burglary: 40, Constitution: 40, Deceive: 30, Diplomacy: 30, Drive: 50, Fight: 40, "Fine-Craft": 40, Intimidate: 30, Intuition: 30, Investigate: 55, Logic: 30, Luck: 30, Might: 30, Perception: 30, Shoot: 50, Stealth: 30, Wealth: 30, Will: 40 },
  Salesman: { Athletics: 30, "Broad-Craft": 40, Burglary: 30, Constitution: 30, Deceive: 50, Diplomacy: 40, Drive: 30, Fight: 30, "Fine-Craft": 40, Intimidate: 30, Intuition: 40, Investigate: 30, Logic: 30, Luck: 40, Might: 30, Perception: 50, Shoot: 30, Stealth: 40, Wealth: 55, Will: 30 },
  Soldier: { Athletics: 50, "Broad-Craft": 30, Burglary: 30, Constitution: 40, Deceive: 30, Diplomacy: 30, Drive: 40, Fight: 55, "Fine-Craft": 30, Intimidate: 40, Intuition: 30, Investigate: 30, Logic: 30, Luck: 30, Might: 40, Perception: 40, Shoot: 40, Stealth: 30, Wealth: 30, Will: 50 },
  Tradesman: { Athletics: 30, "Broad-Craft": 55, Burglary: 30, Constitution: 40, Deceive: 30, Diplomacy: 40, Drive: 50, Fight: 40, "Fine-Craft": 30, Intimidate: 30, Intuition: 30, Investigate: 30, Logic: 30, Luck: 40, Might: 50, Perception: 40, Shoot: 40, Stealth: 30, Wealth: 30, Will: 30 },
};

const sexOptions = [
  { min: 1, max: 50, label: "Male" },
  { min: 51, max: 100, label: "Female" },
];

const handednessOptions = [
  { min: 1, max: 89, label: "Right Handed" },
  { min: 90, max: 99, label: "Left Handed" },
  { min: 100, max: 100, label: "Ambidextrous" },
];

const bodyOptionsMale = [
  { min: 1, max: 20, label: "Lean" },
  { min: 21, max: 50, label: "Average" },
  { min: 51, max: 75, label: "Athletic" },
  { min: 76, max: 100, label: "Heavy" },
];

const bodyOptionsFemale = [
  { min: 1, max: 20, label: "Slender" },
  { min: 21, max: 50, label: "Average" },
  { min: 51, max: 75, label: "Fit" },
  { min: 76, max: 100, label: "Heavy" },
];

const wizardSteps = ["Identity", "Childhood", "Teen", "Adulthood", "Finishing", "Review"];

const simpleQuestionSet = {
  childhood: [
    { key: "parents", title: "Parents", options: [{ min: 1, max: 50, label: "Both were alive", skills: ["Luck", "Fine-Craft"] }, { min: 51, max: 100, label: "Something happened to one or both", skills: ["Will", "Investigate"] }] },
    { key: "home", title: "Where did you grow up?", options: [{ min: 1, max: 25, label: "On the streets", skills: ["Stealth", "Burglary"] }, { min: 26, max: 50, label: "In a suburb", skills: ["Perception", "Luck"] }, { min: 51, max: 75, label: "On a farm", skills: ["Athletics", "Constitution"] }, { min: 76, max: 100, label: "On a military base", skills: ["Will", "Might"] }] },
    { key: "influence", title: "Greatest childhood influence", options: [{ min: 1, max: 25, label: "Parent", skills: ["Diplomacy", "Drive"] }, { min: 26, max: 50, label: "Best friend", skills: ["Fine-Craft", "Burglary"] }, { min: 51, max: 75, label: "Teacher", skills: ["Logic", "Broad-Craft"] }, { min: 76, max: 100, label: "Yourself", skills: ["Deceive", "Perception"] }] },
  ],
  teen: [
    { key: "subject", title: "Favourite subject", options: [{ min: 1, max: 20, label: "Science", skills: ["Logic", "Investigate"] }, { min: 21, max: 40, label: "Drama", skills: ["Intuition", "Deceive"] }, { min: 41, max: 60, label: "Gym", skills: ["Constitution", "Might"] }, { min: 61, max: 80, label: "Woodwork", skills: ["Broad-Craft", "Fight"] }, { min: 81, max: 100, label: "Math", skills: ["Will", "Shoot"] }] },
    { key: "friend", title: "Best friend", options: [{ min: 1, max: 25, label: "Rich kid", skills: ["Wealth", "Drive"] }, { min: 26, max: 50, label: "Loner", skills: ["Athletics", "Burglary"] }, { min: 51, max: 75, label: "Bookworm", skills: ["Luck", "Investigate"] }, { min: 76, max: 100, label: "Army brat", skills: ["Fight", "Constitution"] }] },
    { key: "turning", title: "Turning point", options: [{ min: 1, max: 25, label: "Nearly died", skills: ["Constitution", "Perception"] }, { min: 26, max: 50, label: "Saved someone", skills: ["Athletics", "Fine-Craft"] }, { min: 51, max: 75, label: "Blackmailed", skills: ["Stealth", "Shoot"] }, { min: 76, max: 100, label: "Travelled", skills: ["Luck", "Intuition"] }] },
  ],
  finishing: [
    { key: "freeTime", title: "How do you spend free time?", options: [{ min: 1, max: 25, label: "Learning", skills: ["Logic", "Constitution"] }, { min: 26, max: 50, label: "Creating", skills: ["Might", "Wealth"] }, { min: 51, max: 75, label: "Exploring", skills: ["Burglary", "Drive"] }, { min: 76, max: 100, label: "Hunting", skills: ["Stealth", "Fight"] }] },
    { key: "important", title: "What matters most?", options: [{ min: 1, max: 25, label: "Family", skills: ["Diplomacy", "Fight"] }, { min: 26, max: 50, label: "Friends", skills: ["Fine-Craft", "Intimidate"] }, { min: 51, max: 75, label: "Knowledge", skills: ["Logic", "Intuition"] }, { min: 76, max: 100, label: "Power", skills: ["Wealth", "Burglary"] }] },
  ],
};

const adulthoodCareers = [
  { career: "Academic", jobs: [{ name: "Science", skill: "Logic" }, { name: "Medicine", skill: "Investigate" }, { name: "Technology", skill: "Intuition" }] },
  { career: "Artist", jobs: [{ name: "Actor", skill: "Deceive" }, { name: "Author", skill: "Intuition" }, { name: "Painter", skill: "Fine-Craft" }] },
  { career: "Athlete", jobs: [{ name: "Athletics", skill: "Athletics" }, { name: "Swimming", skill: "Might" }, { name: "Ball Sports", skill: "Drive" }] },
  { career: "Bureaucrat", jobs: [{ name: "Accountant", skill: "Wealth" }, { name: "Administrator", skill: "Investigate" }, { name: "Office Worker", skill: "Logic" }] },
  { career: "Cleric", jobs: [{ name: "Priest", skill: "Intuition" }, { name: "Missionary", skill: "Investigate" }, { name: "Monk", skill: "Will" }] },
  { career: "Hobo", jobs: [{ name: "Thief", skill: "Stealth" }, { name: "Burglar", skill: "Burglary" }, { name: "Mobster", skill: "Intimidate" }] },
  { career: "Policeman", jobs: [{ name: "Street Cop", skill: "Might" }, { name: "Emergency Response", skill: "Shoot" }, { name: "Private Investigator", skill: "Athletics" }] },
  { career: "Salesman", jobs: [{ name: "Retail", skill: "Deceive" }, { name: "Hospitality", skill: "Diplomacy" }, { name: "Luxury Goods", skill: "Wealth" }] },
  { career: "Soldier", jobs: [{ name: "Infantry", skill: "Might" }, { name: "Marines", skill: "Fight" }, { name: "Contractor", skill: "Shoot" }] },
  { career: "Tradesman", jobs: [{ name: "Builder", skill: "Broad-Craft" }, { name: "Engineer", skill: "Constitution" }, { name: "Tailor", skill: "Perception" }] },
];

const successDegrees = [
  { max: 10, label: "Scarce" },
  { max: 20, label: "Mediocre" },
  { max: 30, label: "Average" },
  { max: 40, label: "OK" },
  { max: 50, label: "Good" },
  { max: 60, label: "Great" },
  { max: 70, label: "Excellent" },
  { max: 80, label: "Outstanding" },
  { max: 90, label: "Unreal" },
  { max: 100, label: "Superhuman" },
];

const failureDegrees = [
  { max: 10, label: "Scant" },
  { max: 20, label: "Poor" },
  { max: 30, label: "Bad" },
  { max: 40, label: "Awful" },
  { max: 50, label: "Miserable" },
  { max: 60, label: "Horrid" },
  { max: 70, label: "Terrible" },
  { max: 80, label: "Pathetic" },
  { max: 90, label: "Catastrophic" },
  { max: 100, label: "Subhuman" },
];

const temperatureOptions = ["None", "Hot / Cold", "Burning / Freezing", "Hypothermia / Hyperthermia"];
const armourOptions = ["None", "Soft", "Sturdy", "Strong"];
const weaponClassData = {
  Light: { damage: 10, woundMod: -5 },
  Medium: { damage: 20, woundMod: -10 },
  Heavy: { damage: 30, woundMod: -15 },
};
const rangeBands = ["Close", "Near", "Medium", "Far", "Distant"];

function clampSkill(value) {
  return Math.max(0, Math.min(100, Number(value) || 0));
}

function clampNonNegative(value) {
  return Math.max(0, Number(value) || 0);
}

function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function slotCountFromSkill(value) {
  return Number(value) >= 100 ? 10 : Math.max(0, Math.floor((Number(value) || 0) / 10));
}

function pickByRoll(options, roll) {
  return options.find((item) => roll >= item.min && roll <= item.max) ?? null;
}

function arrayUpdate(list, index, patch) {
  return list.map((item, i) => (i === index ? { ...item, ...patch } : item));
}

function getSuccessDegree(roll) {
  return successDegrees.find((entry) => roll <= entry.max)?.label ?? "Scarce";
}

function getFailureDegree(delta) {
  return failureDegrees.find((entry) => delta <= entry.max)?.label ?? "Subhuman";
}

function exportJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function makeBaseSkills() {
  return Object.fromEntries(skillOrder.map((skill) => [skill, 30]));
}

function makeLocationState() {
  return Object.fromEntries(hitLocations.map((loc) => [loc.key, { armour: "None", destroyed: false, slots: Array(10).fill(false) }]));
}

function makeWeapon(category = "ranged") {
  return {
    name: "",
    category,
    weightClass: "Medium",
    rangeBand: category === "ranged" ? "Medium" : "Close",
    damage: 20,
    woundMod: -10,
    skill: category === "ranged" ? "Shoot" : "Fight",
    notes: "",
  };
}

function makeCombatModifiers() {
  return {
    rangedAttack: { inMelee: false, movingQuickly: false, offHanded: false, firingBlindly: false, aimed: false, areaOfEffect: false },
    rangedDefense: { inMelee: false, movingQuickly: false, areaOfEffect: false, dodge: false, surprised: false, inCover: false },
    meleeAttack: { charging: false, superiorPosition: false, offHanded: false, aimed: false, flankingAllies: 0 },
    meleeDefense: { parry: false, superiorPosition: false, offHanded: false, dodge: false, flankingEnemies: 0 },
  };
}

function makeCharacter() {
  return {
    meta: { characterName: "", era: "The Fall", archetype: "", portraitData: "", portraitName: "" },
    profile: { sex: "", age: "", build: "", handedness: "", hometown: "", skinColour: "", hairColour: "", eyeColour: "" },
    background: { concept: "", childhood: "", teenYears: "", adulthood: "", lovedOnes: "", freeTime: "", priorities: "" },
    skills: makeBaseSkills(),
    resources: { currentSigils: 0 },
    specialisations: [{ parent: "", name: "", level: "" }],
    combat: {
      hitLocations: makeLocationState(),
      grievousWounds: [{ location: "head", description: "", healTime: "" }],
      weapons: [makeWeapon("ranged"), makeWeapon("melee")],
      modifiers: makeCombatModifiers(),
      defenseSkills: { ranged: "Athletics", melee: "Fight" },
      combatNotes: "",
    },
    mental: { destroyed: false, minor: Array(10).fill(false), significant: Array(10).fill(false), grievous: Array(10).fill(false), grievousEntries: [{ subject: "", condition: "", successes: "" }] },
    survival: { hungerFails: 0, thirstFails: 0, sleepFails: 0, exhaustionPenalty: 0, temperature: "None", infectionStatus: "Uninfected", notes: "", perishables: [{ type: "Food", units: 0, daysLeft: 2 }] },
    inventory: { wealthPenalty: 0, gear: [{ name: "", qty: 1, notes: "" }], ammo: [{ type: "", qty: "", notes: "" }], stashNotes: "" },
    notes: { appearance: "", allies: "", sessionNotes: "", goals: "" },
  };
}

function makeWizard() {
  return {
    name: "",
    concept: "",
    age: 24,
    identity: { sex: null, build: null, handedness: null },
    childhood: { parents: null, home: null, influence: null },
    teen: { subject: null, friend: null, turning: null },
    adulthood: { terms: buildAdulthoodTerms(24) },
    finishing: { freeTime: null, important: null },
  };
}

function buildAdulthoodTerms(age, oldTerms = []) {
  const safeAge = Math.max(18, Math.min(90, Number(age) || 18));
  const count = safeAge <= 18 ? 0 : Math.ceil((safeAge - 18) / 3);
  const terms = [];
  let startAge = 18;
  for (let i = 0; i < count; i += 1) {
    const old = oldTerms[i] ?? {};
    const endAge = Math.min(safeAge, startAge + 3);
    terms.push({
      index: i + 1,
      startAge,
      endAge,
      career: old.career ?? "",
      job: old.job ?? "",
      skill: old.skill ?? "",
      gain: old.gain ?? "",
      ageCheckRoll: endAge >= 40 ? old.ageCheckRoll ?? "" : "",
    });
    startAge += 3;
  }
  return terms;
}

function calculateWizardSkills(wizard) {
  let skills = makeBaseSkills();
  const log = [];
  [
    wizard.childhood.parents,
    wizard.childhood.home,
    wizard.childhood.influence,
    wizard.teen.subject,
    wizard.teen.friend,
    wizard.teen.turning,
    wizard.finishing.freeTime,
    wizard.finishing.important,
  ].filter(Boolean).forEach((entry) => {
    (entry.skills ?? []).forEach((skill) => {
      const gain = rollDie(5);
      skills[skill] = clampSkill((skills[skill] ?? 0) + gain);
      log.push(`${entry.label}: +${gain} ${skill}`);
    });
  });

  wizard.adulthood.terms.forEach((term) => {
    if (term.skill && Number(term.gain) > 0) {
      skills[term.skill] = clampSkill((skills[term.skill] ?? 0) + Number(term.gain));
      log.push(`Age ${term.startAge}-${term.endAge}: +${term.gain} ${term.skill}`);
    }
  });

  return { skills, log };
}

function buildCharacterFromWizard(wizard) {
  const character = makeCharacter();
  const safeAge = Math.max(18, Math.min(90, Number(wizard.age) || 18));
  const result = calculateWizardSkills(wizard);
  character.meta.characterName = wizard.name || "Unnamed Survivor";
  character.background.concept = wizard.concept;
  character.profile.age = String(safeAge);
  character.profile.sex = wizard.identity.sex?.label ?? "";
  character.profile.build = wizard.identity.build?.label ?? "";
  character.profile.handedness = wizard.identity.handedness?.label ?? "";
  character.background.childhood = [wizard.childhood.parents?.label, wizard.childhood.home?.label, wizard.childhood.influence?.label].filter(Boolean).join("\n");
  character.background.teenYears = [wizard.teen.subject?.label, wizard.teen.friend?.label, wizard.teen.turning?.label].filter(Boolean).join("\n");
  character.background.adulthood = wizard.adulthood.terms.map((term) => `${term.startAge}-${term.endAge}: ${term.career || "Unassigned"}${term.job ? ` / ${term.job}` : ""}`).join("\n");
  character.background.freeTime = wizard.finishing.freeTime?.label ?? "";
  character.background.priorities = wizard.finishing.important?.label ?? "";
  character.skills = result.skills;
  character.resources.currentSigils = slotCountFromSkill(result.skills.Luck);
  character.notes.goals = wizard.concept || "";
  return character;
}

function normalizeCharacter(source) {
  const blank = makeCharacter();
  const data = source ?? {};
  return {
    ...blank,
    ...data,
    meta: { ...blank.meta, ...(data.meta ?? {}) },
    profile: { ...blank.profile, ...(data.profile ?? {}) },
    background: { ...blank.background, ...(data.background ?? {}) },
    skills: { ...blank.skills, ...(data.skills ?? {}) },
    resources: { ...blank.resources, ...(data.resources ?? {}) },
    specialisations: Array.isArray(data.specialisations) && data.specialisations.length ? data.specialisations : blank.specialisations,
    combat: {
      ...blank.combat,
      ...(data.combat ?? {}),
      hitLocations: hitLocations.reduce((acc, loc) => {
        acc[loc.key] = {
          ...blank.combat.hitLocations[loc.key],
          ...(data.combat?.hitLocations?.[loc.key] ?? {}),
          slots: Array.from({ length: 10 }, (_, i) => Boolean(data.combat?.hitLocations?.[loc.key]?.slots?.[i])),
        };
        return acc;
      }, {}),
      grievousWounds: Array.isArray(data.combat?.grievousWounds) && data.combat.grievousWounds.length ? data.combat.grievousWounds : blank.combat.grievousWounds,
      weapons: Array.isArray(data.combat?.weapons) && data.combat.weapons.length ? data.combat.weapons : blank.combat.weapons,
      modifiers: { ...makeCombatModifiers(), ...(data.combat?.modifiers ?? {}) },
      defenseSkills: { ...blank.combat.defenseSkills, ...(data.combat?.defenseSkills ?? {}) },
    },
    mental: {
      ...blank.mental,
      ...(data.mental ?? {}),
      minor: Array.from({ length: 10 }, (_, i) => Boolean(data.mental?.minor?.[i])),
      significant: Array.from({ length: 10 }, (_, i) => Boolean(data.mental?.significant?.[i])),
      grievous: Array.from({ length: 10 }, (_, i) => Boolean(data.mental?.grievous?.[i])),
      grievousEntries: Array.isArray(data.mental?.grievousEntries) && data.mental.grievousEntries.length ? data.mental.grievousEntries : blank.mental.grievousEntries,
    },
    survival: {
      ...blank.survival,
      ...(data.survival ?? {}),
      perishables: Array.isArray(data.survival?.perishables) && data.survival.perishables.length ? data.survival.perishables : blank.survival.perishables,
    },
    inventory: {
      ...blank.inventory,
      ...(data.inventory ?? {}),
      gear: Array.isArray(data.inventory?.gear) && data.inventory.gear.length ? data.inventory.gear : blank.inventory.gear,
      ammo: Array.isArray(data.inventory?.ammo) && data.inventory.ammo.length ? data.inventory.ammo : blank.inventory.ammo,
    },
    notes: { ...blank.notes, ...(data.notes ?? {}) },
  };
}

function Section({ title, description, right, children }) {
  return (
    <div className="rounded-[24px] border border-zinc-800 bg-zinc-900/80 p-4 shadow-xl sm:rounded-[28px] sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">{title}</h2>
          {description ? <p className="mt-1 text-sm leading-6 text-zinc-400">{description}</p> : null}
        </div>
        {right ? <div className="w-full sm:w-auto">{right}</div> : null}
      </div>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, placeholder = "", type = "text", inputMode, pattern, min, max, step, disabled = false }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{label}</span>
      <input
        type={type}
        inputMode={inputMode}
        pattern={pattern}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="min-h-[48px] w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-base text-white outline-none focus:border-emerald-500 disabled:opacity-50 sm:text-sm"
      />
    </label>
  );
}

function TextArea({ label, value, onChange, rows = 4 }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{label}</span>
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-base text-white outline-none focus:border-emerald-500 sm:text-sm"
      />
    </label>
  );
}

function NumberStepper({ value, onChange, min = 0, max = 100 }) {
  return (
    <div className="flex items-center gap-2">
      <button className="h-11 w-11 rounded-xl bg-zinc-800 text-white hover:bg-zinc-700" onClick={() => onChange(Math.max(min, Number(value || 0) - 1))}>−</button>
      <input type="number" min={min} max={max} value={value} onChange={(e) => onChange(clampNonNegative(e.target.value))} className="h-11 w-20 rounded-xl border border-zinc-800 bg-zinc-950 px-2 py-2 text-center text-base text-white outline-none focus:border-emerald-500 sm:text-sm" />
      <button className="h-11 w-11 rounded-xl bg-zinc-800 text-white hover:bg-zinc-700" onClick={() => onChange(Math.min(max, Number(value || 0) + 1))}>+</button>
    </div>
  );
}

function QuestionCard({ title, value, options, onChange, note }) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-white">{title}</div>
          {note ? <div className="mt-1 text-xs text-zinc-500">{note}</div> : null}
        </div>
        <button className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-black hover:bg-emerald-400" onClick={() => onChange(pickByRoll(options, rollDie(100)))}><Dices className="h-3.5 w-3.5" /> Roll</button>
      </div>
      <select value={value?.label ?? ""} onChange={(e) => onChange(options.find((o) => o.label === e.target.value) ?? null)} className="min-h-[48px] w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-base text-white outline-none focus:border-emerald-500 sm:text-sm">
        <option value="">Pick or roll...</option>
        {options.map((option) => <option key={option.label} value={option.label}>{option.label}</option>)}
      </select>
      {value ? <div className="mt-3 rounded-2xl bg-zinc-900 p-3 text-sm text-zinc-300">{value.label}</div> : null}
    </div>
  );
}

function BodySilhouette({ selected, states, onSelect }) {
  const classFor = (key) => {
    const damaged = states[key].destroyed || states[key].slots.some(Boolean);
    if (selected === key) return "fill-emerald-500/35 stroke-emerald-300";
    if (damaged) return "fill-red-500/28 stroke-red-300";
    return "fill-zinc-800/60 stroke-zinc-500 hover:fill-zinc-700/75";
  };

  return (
    <div className="rounded-3xl bg-zinc-950 p-4">
      <svg viewBox="0 0 260 500" className="mx-auto h-[430px] w-full max-w-[300px] sm:h-[500px]">
        <g strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="130" cy="50" rx="28" ry="34" className={classFor("head")} onClick={() => onSelect("head")} />
          <path d="M115 84 L145 84 L158 114 L160 210 L100 210 L102 114 Z" className={classFor("torso")} onClick={() => onSelect("torso")} />
          <path d="M99 110 L72 126 L58 230 L79 236 L98 166 Z" className={classFor("leftArm")} onClick={() => onSelect("leftArm")} />
          <path d="M161 110 L188 126 L202 230 L181 236 L162 166 Z" className={classFor("rightArm")} onClick={() => onSelect("rightArm")} />
          <path d="M110 211 L103 345 L110 465 L132 465 L136 345 L136 211 Z" className={classFor("leftLeg")} onClick={() => onSelect("leftLeg")} />
          <path d="M150 211 L124 211 L124 345 L128 465 L150 465 L157 345 Z" className={classFor("rightLeg")} onClick={() => onSelect("rightLeg")} />
          <path d="M58 230 L49 278 L64 281" fill="none" stroke="#71717a" strokeWidth="2" />
          <path d="M202 230 L211 278 L196 281" fill="none" stroke="#71717a" strokeWidth="2" />
          <path d="M110 465 L102 490 L120 490" fill="none" stroke="#71717a" strokeWidth="2" />
          <path d="M150 465 L158 490 L140 490" fill="none" stroke="#71717a" strokeWidth="2" />
        </g>
      </svg>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {hitLocations.map((loc) => (
          <button key={loc.key} onClick={() => onSelect(loc.key)} className={`min-h-[44px] rounded-2xl border px-3 py-2 text-left text-sm ${selected === loc.key ? "border-emerald-400 bg-emerald-500/20 text-emerald-100" : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600"}`}>
            <div className="font-semibold">{loc.label}</div>
            <div className="text-xs text-zinc-400">{loc.range}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function RollPopup({ open, title, result, onClose, onReroll, rerollEnabled }) {
  return (
    <AnimatePresence>
      {open && result ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
          <motion.div initial={{ scale: 0.96, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 12 }} className="w-full max-w-xl rounded-[28px] border border-zinc-800 bg-zinc-900 p-4 shadow-2xl sm:p-5" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Roll Result</div>
                <div className="text-lg font-bold text-white">{title}</div>
              </div>
              <button className="inline-flex min-h-[44px] items-center rounded-2xl bg-zinc-800 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700" onClick={onClose}><X className="mr-2 h-4 w-4" /> Close</button>
            </div>
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-bold text-white">{result.label}</div>
                  <div className="mt-1 text-sm text-zinc-400">Base {result.baseSkill} • Final target {result.target} • Total modifier {result.totalModifier >= 0 ? `+${result.totalModifier}` : result.totalModifier}</div>
                </div>
                <div className={`rounded-2xl px-4 py-3 text-center ${result.success ? "bg-emerald-500/20 text-emerald-200" : "bg-red-500/20 text-red-200"}`}>
                  <div className="text-xs uppercase tracking-[0.18em]">Roll</div>
                  <div className="text-2xl font-black">{result.roll}</div>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl bg-zinc-950 p-3 text-sm text-zinc-300">
                  <div className="font-semibold text-white">Outcome</div>
                  <div className="mt-1">{result.success ? "Success" : "Failure"} • {result.degree}</div>
                  {result.criticalSuccess ? <div className="mt-1 text-emerald-300">Critical success</div> : null}
                  {result.criticalFailure ? <div className="mt-1 text-red-300">Critical failure</div> : null}
                </div>
                <div className="rounded-2xl bg-zinc-950 p-3 text-sm text-zinc-300">
                  <div className="font-semibold text-white">Applied extras</div>
                  <div className="mt-1">Manual modifier: {result.manualModifier >= 0 ? `+${result.manualModifier}` : result.manualModifier}</div>
                  <div className="mt-1">Auto penalties included: yes</div>
                  <div className="mt-1">Sigil bonus: {result.usedSigilBonus ? "+25" : "none"}</div>
                </div>
              </div>
              {rerollEnabled ? <button className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-black hover:bg-amber-400" onClick={onReroll}><RefreshCcw className="h-4 w-4" /> Spend Sigil to Reroll</button> : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function DiceWidget() {
  const [lastRoll, setLastRoll] = useState({ label: "d100", value: "-" });
  const [history, setHistory] = useState([]);
  const roll = (sides, label) => {
    const value = rollDie(sides);
    const result = { label, value };
    setLastRoll(result);
    setHistory((prev) => [result, ...prev].slice(0, 5));
  };
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-4 shadow-2xl">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-200"><Dices className="h-4 w-4 text-emerald-400" /> Dice Roller</div>
      <div className="mb-4 grid grid-cols-3 gap-2">
        <button className="min-h-[44px] rounded-2xl bg-zinc-800 px-3 py-2 text-sm text-white hover:bg-zinc-700" onClick={() => roll(100, "d100")}>d100</button>
        <button className="min-h-[44px] rounded-2xl bg-zinc-800 px-3 py-2 text-sm text-white hover:bg-zinc-700" onClick={() => roll(10, "d10")}>d10</button>
        <button className="min-h-[44px] rounded-2xl bg-zinc-800 px-3 py-2 text-sm text-white hover:bg-zinc-700" onClick={() => roll(5, "d5")}>d5</button>
      </div>
      <div className="mb-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 p-4 text-center text-black">
        <div className="text-xs font-semibold uppercase tracking-[0.2em]">{lastRoll.label}</div>
        <div className="text-3xl font-black">{lastRoll.value}</div>
      </div>
      <div className="space-y-1 text-xs text-zinc-400">
        {history.length === 0 ? <div>No rolls yet.</div> : history.map((item, idx) => <div key={`${item.label}-${item.value}-${idx}`} className="flex items-center justify-between rounded-xl bg-zinc-900 px-3 py-2"><span>{item.label}</span><span className="font-semibold text-zinc-200">{item.value}</span></div>)}
      </div>
    </div>
  );
}

function MobileTabBar({ activeTab, setActiveTab }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-800 bg-zinc-950/95 px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] backdrop-blur md:hidden">
      <div className="grid grid-cols-6 gap-1">
        {tabList.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-semibold ${active ? "bg-emerald-500 text-black" : "bg-zinc-900 text-zinc-300"}`}>
              <Icon className="h-4 w-4" />
              <span className="leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  const fileInputRef = useRef(null);
  const portraitInputRef = useRef(null);
  const [appMode, setAppMode] = useState("home");
  const [activeTab, setActiveTab] = useState("overview");
  const [wizardStep, setWizardStep] = useState(0);
  const [activeHealthLocation, setActiveHealthLocation] = useState("torso");
  const [saveState, setSaveState] = useState("Ready");
  const [skillRollModifier, setSkillRollModifier] = useState(0);
  const [queuedSigilBonus, setQueuedSigilBonus] = useState(false);
  const [skillRollResult, setSkillRollResult] = useState(null);
  const [combatRollResult, setCombatRollResult] = useState(null);
  const [rollModal, setRollModal] = useState(null);
  const [wizard, setWizard] = useState(makeWizard());
  const [hasSavedCharacter, setHasSavedCharacter] = useState(false);
  const [character, setCharacter] = useState(() => {
    if (typeof window === "undefined") return makeCharacter();
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored ? normalizeCharacter(JSON.parse(stored)) : makeCharacter();
    } catch {
      return makeCharacter();
    }
  });

  useEffect(() => {
    document.title = APP_TITLE;
    try {
      setHasSavedCharacter(Boolean(window.localStorage.getItem(STORAGE_KEY)));
    } catch {}
  }, []);

  useEffect(() => {
    if (appMode !== "sheet") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(character));
      setHasSavedCharacter(true);
      setSaveState(`Autosaved ${new Date().toLocaleTimeString()}`);
    } catch {
      setSaveState("Autosave failed");
    }
  }, [character, appMode]);

  const constitutionSlots = slotCountFromSkill(character.skills.Constitution);
  const willSlots = slotCountFromSkill(character.skills.Will);
  const sigilThreshold = slotCountFromSkill(character.skills.Luck);
  const currentSigils = clampNonNegative(character.resources.currentSigils);

  const computed = useMemo(() => {
    const hungerPhysical = character.survival.hungerFails * -2;
    const hungerMental = character.survival.hungerFails * -1;
    const thirstPhysical = character.survival.thirstFails * -2;
    const thirstMental = character.survival.thirstFails * -5;
    const sleepAll = character.survival.sleepFails * -3;
    const exhaustionPhysical = -clampNonNegative(character.survival.exhaustionPenalty);
    const tempAll = { None: 0, "Hot / Cold": -5, "Burning / Freezing": -15, "Hypothermia / Hyperthermia": -25 }[character.survival.temperature] ?? 0;
    const mentalPenalty = (character.mental.significant.slice(0, willSlots).some(Boolean) ? -10 : 0) + (character.mental.grievous.slice(0, willSlots).some(Boolean) ? -15 : 0);
    const effectiveSkills = Object.fromEntries(skillOrder.map((skill) => {
      let mod = sleepAll + tempAll;
      if (physicalSkills.has(skill)) mod += hungerPhysical + thirstPhysical + exhaustionPhysical;
      else mod += hungerMental + thirstMental;
      if (mentalAffectedSkills.has(skill)) mod += mentalPenalty;
      if (skill === "Wealth") mod -= clampNonNegative(character.inventory.wealthPenalty);
      return [skill, Math.max(0, (Number(character.skills[skill]) || 0) + mod)];
    }));
    return { hungerPhysical, hungerMental, thirstPhysical, thirstMental, sleepAll, exhaustionPhysical, tempAll, mentalPenalty, effectiveSkills };
  }, [character, willSlots]);

  const wizardPreview = useMemo(() => calculateWizardSkills(wizard), [wizard]);

  const setMeta = (patch) => setCharacter((prev) => ({ ...prev, meta: { ...prev.meta, ...patch } }));
  const setProfile = (patch) => setCharacter((prev) => ({ ...prev, profile: { ...prev.profile, ...patch } }));
  const setBackground = (patch) => setCharacter((prev) => ({ ...prev, background: { ...prev.background, ...patch } }));
  const setSurvival = (patch) => setCharacter((prev) => ({ ...prev, survival: { ...prev.survival, ...patch } }));
  const setInventory = (patch) => setCharacter((prev) => ({ ...prev, inventory: { ...prev.inventory, ...patch } }));
  const setCombat = (patch) => setCharacter((prev) => ({ ...prev, combat: { ...prev.combat, ...patch } }));
  const setMental = (patch) => setCharacter((prev) => ({ ...prev, mental: { ...prev.mental, ...patch } }));
  const setNotes = (patch) => setCharacter((prev) => ({ ...prev, notes: { ...prev.notes, ...patch } }));
  const setResources = (patch) => setCharacter((prev) => ({ ...prev, resources: { ...prev.resources, ...patch } }));
  const updateSkill = (skill, value) => setCharacter((prev) => ({ ...prev, skills: { ...prev.skills, [skill]: clampSkill(value) } }));

  const saveNow = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(character));
      setHasSavedCharacter(true);
      setSaveState(`Saved ${new Date().toLocaleTimeString()}`);
    } catch {
      setSaveState("Manual save failed");
    }
  };

  const resetAll = () => {
    if (!window.confirm("Reset this character sheet to a blank Z-LAND sheet?")) return;
    setCharacter(makeCharacter());
    setSkillRollResult(null);
    setCombatRollResult(null);
    setRollModal(null);
    setQueuedSigilBonus(false);
    setAppMode("sheet");
  };

  const openSavedCharacter = () => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      setCharacter(normalizeCharacter(JSON.parse(stored)));
      setAppMode("sheet");
      setActiveTab("overview");
    } catch {}
  };

  const startWizard = () => {
    setWizard(makeWizard());
    setWizardStep(0);
    setAppMode("wizard");
  };

  const handleImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = normalizeCharacter(JSON.parse(String(reader.result)));
        setCharacter(parsed);
        setAppMode("sheet");
        setActiveTab("overview");
      } catch {
        window.alert("That file could not be imported.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const handleExport = () => {
    const filename = (character.meta.characterName || "zland-character").replace(/\s+/g, "-").toLowerCase();
    exportJson(`${filename}.json`, character);
  };

  const handlePortraitUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      window.alert("Portrait images must be 2 MB or smaller.");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setMeta({ portraitData: String(reader.result), portraitName: file.name });
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const applyArchetype = (name) => {
    if (!archetypes[name]) return;
    setCharacter((prev) => ({ ...prev, meta: { ...prev.meta, archetype: name }, skills: { ...archetypes[name] } }));
  };

  const createRollResult = ({ label, skillName, baseSkill, extraModifier = 0, manualModifier = 0, useQueuedSigil = false }) => {
    const usedSigilBonus = useQueuedSigil && currentSigils > 0;
    if (usedSigilBonus) setResources({ currentSigils: Math.max(0, currentSigils - 1) });
    const sigilBonus = usedSigilBonus ? 25 : 0;
    const totalModifier = extraModifier + manualModifier + sigilBonus;
    const target = Math.max(0, Math.min(100, (Number(baseSkill) || 0) + totalModifier));
    const roll = rollDie(100);
    const criticalFailure = roll === 100;
    const success = roll <= target && !criticalFailure;
    const criticalSuccess = success && roll === target;
    const degree = success ? getSuccessDegree(roll) : getFailureDegree(Math.max(1, roll - target));
    setQueuedSigilBonus(false);
    return { label, skillName, baseSkill: Number(baseSkill) || 0, target, roll, success, criticalSuccess, criticalFailure, degree, totalModifier, manualModifier, extraModifier, usedSigilBonus };
  };

  const rerollSkillCheck = () => {
    if (!skillRollResult || skillRollResult.success || currentSigils <= 0) return;
    setResources({ currentSigils: Math.max(0, currentSigils - 1) });
    const result = createRollResult({
      label: `${skillRollResult.label} (Reroll)`,
      skillName: skillRollResult.skillName,
      baseSkill: skillRollResult.baseSkill,
      extraModifier: skillRollResult.extraModifier,
      manualModifier: skillRollResult.manualModifier,
      useQueuedSigil: false,
    });
    setSkillRollResult(result);
    setRollModal({ kind: "skill", title: `${skillRollResult.skillName} Roll`, result });
  };

  const rollSkillCheck = (skillName) => {
    const result = createRollResult({ label: skillName, skillName, baseSkill: computed.effectiveSkills[skillName], manualModifier: Number(skillRollModifier) || 0, useQueuedSigil: queuedSigilBonus });
    setSkillRollResult(result);
    setRollModal({ kind: "skill", title: `${skillName} Roll`, result });
  };

  const getCombatModifierTotal = (section) => {
    const m = character.combat.modifiers;
    if (section === "rangedAttack") return (m.rangedAttack.inMelee ? -40 : 0) + (m.rangedAttack.movingQuickly ? -20 : 0) + (m.rangedAttack.offHanded ? -20 : 0) + (m.rangedAttack.firingBlindly ? -40 : 0) + (m.rangedAttack.areaOfEffect ? 15 : 0) + (m.rangedAttack.aimed ? Math.floor((computed.effectiveSkills.Shoot ?? 0) / 2) : 0);
    if (section === "rangedDefense") return (m.rangedDefense.inMelee ? -10 : 0) + (m.rangedDefense.movingQuickly ? 20 : 0) + (m.rangedDefense.areaOfEffect ? -15 : 0) + (m.rangedDefense.dodge ? 10 : 0) + (m.rangedDefense.surprised ? -40 : 0) + (m.rangedDefense.inCover ? 20 : 0);
    if (section === "meleeAttack") return (m.meleeAttack.charging ? 20 : 0) + (m.meleeAttack.superiorPosition ? 40 : 0) + (m.meleeAttack.offHanded ? -20 : 0) + (m.meleeAttack.aimed ? -10 : 0) + clampNonNegative(m.meleeAttack.flankingAllies) * 5;
    if (section === "meleeDefense") return (m.meleeDefense.parry ? -20 : 0) + (m.meleeDefense.superiorPosition ? 40 : 0) + (m.meleeDefense.offHanded ? -20 : 0) + (m.meleeDefense.dodge ? 10 : 0) - clampNonNegative(m.meleeDefense.flankingEnemies) * 5;
    return 0;
  };

  const rollWeaponAttack = (weapon) => {
    const section = weapon.category === "ranged" ? "rangedAttack" : "meleeAttack";
    const result = createRollResult({ label: `${weapon.name || "Unnamed weapon"} attack`, skillName: weapon.skill, baseSkill: computed.effectiveSkills[weapon.skill], extraModifier: getCombatModifierTotal(section), useQueuedSigil: queuedSigilBonus });
    setCombatRollResult(result);
    setRollModal({ kind: "combat", title: `${weapon.name || "Weapon"} Attack`, result });
  };

  const rollCombatDefense = (mode) => {
    const skillName = character.combat.defenseSkills[mode];
    const section = mode === "ranged" ? "rangedDefense" : "meleeDefense";
    const result = createRollResult({ label: `${mode === "ranged" ? "Ranged" : "Melee"} defense`, skillName, baseSkill: computed.effectiveSkills[skillName], extraModifier: getCombatModifierTotal(section), useQueuedSigil: queuedSigilBonus });
    setCombatRollResult(result);
    setRollModal({ kind: "combat", title: `${mode === "ranged" ? "Ranged" : "Melee"} Defense`, result });
  };

  const updateWizardAge = (value) => {
    const digits = String(value).replace(/[^0-9]/g, "").slice(0, 2);
    const numericAge = digits === "" ? 18 : Math.max(18, Math.min(90, Number(digits)));
    setWizard((prev) => ({
      ...prev,
      age: digits,
      adulthood: { terms: buildAdulthoodTerms(numericAge, prev.adulthood.terms) },
    }));
  };

  const updateWizardTerm = (index, patch) => {
    setWizard((prev) => {
      const terms = prev.adulthood.terms.map((term, i) => {
        if (i !== index) return term;
        const merged = { ...term, ...patch };
        const career = adulthoodCareers.find((entry) => entry.career === merged.career);
        const job = career?.jobs.find((item) => item.name === merged.job);
        return { ...merged, skill: job?.skill ?? merged.skill ?? "" };
      });
      return { ...prev, adulthood: { terms } };
    });
  };

  const selectedLocation = character.combat.hitLocations[activeHealthLocation];
  const locationGrievous = character.combat.grievousWounds.filter((entry) => entry.location === activeHealthLocation);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_35%),linear-gradient(180deg,_#0a0a0a_0%,_#111111_100%)] pb-24 text-white md:pb-0">
      <style>{`input, select, textarea { font-size: 16px; } button { touch-action: manipulation; } @media (min-width: 640px) { input, select, textarea { font-size: 14px; } }`}</style>

      <div className="p-8 text-zinc-300">Restore base loaded. Replace this placeholder return body with the rest of the previous UI if you want me to continue from this exact base.</div>
    </div>
  );
}
