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
  const result = calculateWizardSkills(wizard);
  character.meta.characterName = wizard.name || "Unnamed Survivor";
  character.background.concept = wizard.concept;
  character.profile.age = String(wizard.age);
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
    const digits = String(value).replace(/[^0-9]/g, "");
    const safe = digits === "" ? "" : Math.max(18, Math.min(90, Number(digits)));
    setWizard((prev) => ({ ...prev, age: safe === "" ? "" : safe, adulthood: { terms: buildAdulthoodTerms(safe === "" ? 18 : safe, prev.adulthood.terms) } }));
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

      {appMode === "home" ? (
        <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full overflow-hidden rounded-[32px] border border-zinc-800 bg-zinc-900/85 p-6 shadow-2xl backdrop-blur sm:p-8">
            <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr] xl:items-center">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Z-LAND • The Fall</div>
                <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">{APP_TITLE}</h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">Fresh rebuild for stability, mobile-friendly age entry, and a corrected wound silhouette.</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <button className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-4 text-sm font-semibold text-black hover:bg-emerald-400" onClick={startWizard}><WandSparkles className="h-4 w-4" /> Create with Wizard</button>
                  <button className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl px-4 py-4 text-sm font-semibold ${hasSavedCharacter ? "bg-zinc-800 text-white hover:bg-zinc-700" : "cursor-not-allowed bg-zinc-900 text-zinc-600"}`} disabled={!hasSavedCharacter} onClick={openSavedCharacter}><Save className="h-4 w-4" /> Open Saved</button>
                  <button className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-zinc-800 px-4 py-4 text-sm font-semibold text-white hover:bg-zinc-700" onClick={() => fileInputRef.current?.click()}><Upload className="h-4 w-4" /> Import File</button>
                </div>
                <input ref={fileInputRef} type="file" accept="application/json" onChange={handleImport} className="hidden" />
              </div>
              <div className="grid gap-4">
                <div className="rounded-[28px] border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Rebuild focus</div>
                  <div className="mt-4 grid gap-3 text-sm text-zinc-300">
                    <div className="rounded-2xl bg-zinc-900 p-4">Numeric mobile age entry in wizard</div>
                    <div className="rounded-2xl bg-zinc-900 p-4">Cleaner clickable body silhouette</div>
                    <div className="rounded-2xl bg-zinc-900 p-4">Centered skill and combat roll popup</div>
                    <div className="rounded-2xl bg-zinc-900 p-4">Same player-facing Fall-era workflow</div>
                  </div>
                </div>
                <DiceWidget />
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}

      {appMode === "wizard" ? (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 overflow-hidden rounded-[32px] border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl backdrop-blur">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">The Fall Character Wizard</div>
                <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">{APP_TITLE}</h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400 sm:text-base">Players can type age directly now on mobile instead of relying on the number spinner.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-700" onClick={() => setAppMode("home")}><ChevronLeft className="h-4 w-4" /> Back</button>
                {wizardStep > 0 ? <button className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-700" onClick={() => setWizardStep((prev) => Math.max(0, prev - 1))}><ChevronLeft className="h-4 w-4" /> Previous</button> : null}
                {wizardStep < wizardSteps.length - 1 ? <button className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black hover:bg-emerald-400" onClick={() => setWizardStep((prev) => Math.min(wizardSteps.length - 1, prev + 1))}>Next <ChevronRight className="h-4 w-4" /></button> : <button className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black hover:bg-emerald-400" onClick={() => { setCharacter(buildCharacterFromWizard(wizard)); setAppMode("sheet"); setActiveTab("overview"); }}><WandSparkles className="h-4 w-4" /> Create Character</button>}
              </div>
            </div>
            <div className="mt-5 flex gap-2 overflow-x-auto pb-1 md:grid md:grid-cols-6 md:overflow-visible md:pb-0">
              {wizardSteps.map((step, index) => <button key={step} onClick={() => setWizardStep(index)} className={`whitespace-nowrap rounded-2xl px-3 py-3 text-sm font-semibold ${wizardStep === index ? "bg-emerald-500 text-black" : "bg-zinc-950 text-zinc-300 hover:bg-zinc-800"}`}>{index + 1}. {step}</button>)}
            </div>
          </motion.div>

          <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-6">
              {wizardStep === 0 ? (
                <Section title="Identity" description="Start the survivor as a normal person before the Fall.">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <Input label="Character Name" value={wizard.name} onChange={(e) => setWizard((prev) => ({ ...prev, name: e.target.value }))} placeholder="Amber Hale" />
                    <Input label="Starting Age" type="text" inputMode="numeric" pattern="[0-9]*" value={wizard.age} onChange={(e) => updateWizardAge(e.target.value)} placeholder="24" />
                    <Input label="Concept" value={wizard.concept} onChange={(e) => setWizard((prev) => ({ ...prev, concept: e.target.value }))} placeholder="Paramedic with trust issues" />
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <QuestionCard title="Sex" value={wizard.identity.sex} options={sexOptions} onChange={(choice) => setWizard((prev) => ({ ...prev, identity: { ...prev.identity, sex: choice } }))} />
                    <QuestionCard title="Body Type" value={wizard.identity.build} options={(wizard.identity.sex?.label ?? "Male") === "Female" ? bodyOptionsFemale : bodyOptionsMale} onChange={(choice) => setWizard((prev) => ({ ...prev, identity: { ...prev.identity, build: choice } }))} note="Uses the male or female table based on sex." />
                    <QuestionCard title="Handedness" value={wizard.identity.handedness} options={handednessOptions} onChange={(choice) => setWizard((prev) => ({ ...prev, identity: { ...prev.identity, handedness: choice } }))} />
                  </div>
                </Section>
              ) : null}

              {wizardStep === 1 ? (
                <Section title="Childhood" description="Pick or roll the broad beats of early life.">
                  <div className="grid gap-4 md:grid-cols-2">
                    {simpleQuestionSet.childhood.map((entry) => <QuestionCard key={entry.key} title={entry.title} value={wizard.childhood[entry.key]} options={entry.options} onChange={(choice) => setWizard((prev) => ({ ...prev, childhood: { ...prev.childhood, [entry.key]: choice } }))} />)}
                  </div>
                </Section>
              ) : null}

              {wizardStep === 2 ? (
                <Section title="Teen Years" description="School, relationships, and the turning point into adulthood.">
                  <div className="grid gap-4 md:grid-cols-2">
                    {simpleQuestionSet.teen.map((entry) => <QuestionCard key={entry.key} title={entry.title} value={wizard.teen[entry.key]} options={entry.options} onChange={(choice) => setWizard((prev) => ({ ...prev, teen: { ...prev.teen, [entry.key]: choice } }))} />)}
                  </div>
                </Section>
              ) : null}

              {wizardStep === 3 ? (
                <Section title="Adulthood" description="Players choose the career path for every job term.">
                  <div className="grid gap-4 lg:grid-cols-[220px_auto]">
                    <div className="rounded-3xl bg-zinc-950 p-4">
                      <Input label="Target Age" type="text" inputMode="numeric" pattern="[0-9]*" value={wizard.age} onChange={(e) => updateWizardAge(e.target.value)} placeholder="24" />
                      <div className="mt-4 rounded-2xl bg-zinc-900 p-4 text-sm text-zinc-300">{wizard.adulthood.terms.length} term{wizard.adulthood.terms.length === 1 ? "" : "s"} from age 18 to {wizard.age || 18}.</div>
                    </div>
                    <div className="rounded-3xl bg-zinc-950 p-4">
                      <div className="space-y-4">
                        {wizard.adulthood.terms.map((term, index) => {
                          const career = adulthoodCareers.find((entry) => entry.career === term.career);
                          return (
                            <div key={term.index} className="rounded-2xl bg-zinc-900 p-4">
                              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                                <div>
                                  <div className="font-semibold text-white">Term {term.index}</div>
                                  <div className="text-sm text-zinc-500">Age {term.startAge}-{term.endAge}</div>
                                </div>
                                <div className="rounded-full bg-zinc-950 px-3 py-1 text-xs uppercase tracking-[0.18em] text-zinc-400">{term.skill || "No skill yet"}</div>
                              </div>
                              <div className="grid gap-3 lg:grid-cols-[1fr_1fr_120px_auto]">
                                <label className="block">
                                  <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Career</span>
                                  <select value={term.career} onChange={(e) => updateWizardTerm(index, { career: e.target.value, job: "", skill: "" })} className="min-h-[48px] w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-base text-white outline-none focus:border-emerald-500 sm:text-sm">
                                    <option value="">Choose career...</option>
                                    {adulthoodCareers.map((entry) => <option key={entry.career} value={entry.career}>{entry.career}</option>)}
                                  </select>
                                </label>
                                <label className="block">
                                  <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Job</span>
                                  <select value={term.job} disabled={!career} onChange={(e) => updateWizardTerm(index, { job: e.target.value })} className="min-h-[48px] w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-base text-white outline-none focus:border-emerald-500 disabled:opacity-50 sm:text-sm">
                                    <option value="">Choose job...</option>
                                    {(career?.jobs ?? []).map((job) => <option key={job.name} value={job.name}>{job.name}</option>)}
                                  </select>
                                </label>
                                <Input label="Gain" type="number" min={0} max={5} value={term.gain} onChange={(e) => updateWizardTerm(index, { gain: Math.max(0, Math.min(5, Number(e.target.value) || 0)) })} />
                                <div className="flex items-end"><button className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black hover:bg-emerald-400" onClick={() => updateWizardTerm(index, { gain: rollDie(5) })}><Dices className="h-4 w-4" /> Roll d5</button></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </Section>
              ) : null}

              {wizardStep === 4 ? (
                <Section title="Finishing" description="Round out who they were before the world fell apart.">
                  <div className="grid gap-4 md:grid-cols-2">
                    {simpleQuestionSet.finishing.map((entry) => <QuestionCard key={entry.key} title={entry.title} value={wizard.finishing[entry.key]} options={entry.options} onChange={(choice) => setWizard((prev) => ({ ...prev, finishing: { ...prev.finishing, [entry.key]: choice } }))} />)}
                  </div>
                </Section>
              ) : null}

              {wizardStep === 5 ? (
                <Section title="Review" description="Preview the generated skill spread before opening the full sheet.">
                  <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                    <div className="space-y-4">
                      <div className="rounded-3xl bg-zinc-950 p-4">
                        <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Identity</div>
                        <div className="mt-2 text-lg font-bold text-white">{wizard.name || "Unnamed Survivor"}</div>
                        <div className="mt-1 text-sm text-zinc-400">Age {wizard.age || 18} • {wizard.identity.sex?.label || "?"} • {wizard.identity.build?.label || "?"}</div>
                        {wizard.concept ? <div className="mt-3 rounded-2xl bg-zinc-900 p-3 text-sm text-zinc-300">{wizard.concept}</div> : null}
                      </div>
                      <div className="rounded-3xl bg-zinc-950 p-4 text-sm text-zinc-300 whitespace-pre-wrap">
                        {[wizard.childhood.parents?.label, wizard.childhood.home?.label, wizard.childhood.influence?.label, wizard.teen.subject?.label, wizard.teen.friend?.label, wizard.teen.turning?.label].filter(Boolean).join("\n") || "No life path details yet."}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="rounded-3xl bg-zinc-950 p-4">
                        <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Generated skills</div>
                        <div className="mt-3 grid gap-2 md:grid-cols-2">
                          {skillOrder.map((skill) => <div key={skill} className="flex items-center justify-between rounded-2xl bg-zinc-900 px-3 py-2 text-sm text-zinc-300"><span>{skill}</span><span className="font-semibold text-white">{wizardPreview.skills[skill]}</span></div>)}
                        </div>
                      </div>
                      <div className="rounded-3xl bg-zinc-950 p-4">
                        <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Applied bonuses</div>
                        <div className="mt-3 space-y-2 text-sm text-zinc-300 max-h-[280px] overflow-auto">
                          {wizardPreview.log.length === 0 ? <div className="text-zinc-500">No gains yet.</div> : wizardPreview.log.map((entry, i) => <div key={i} className="rounded-2xl bg-zinc-900 p-3">{entry}</div>)}
                        </div>
                      </div>
                    </div>
                  </div>
                </Section>
              ) : null}
            </div>
            <div className="space-y-6">
              <Section title="Wizard Notes" description="The Fall only.">
                <div className="space-y-3 text-sm text-zinc-300">
                  <div className="rounded-2xl bg-zinc-950 p-4">All skills begin at 30.</div>
                  <div className="rounded-2xl bg-zinc-950 p-4">Life-path results grant +1d5 to listed skills.</div>
                  <div className="rounded-2xl bg-zinc-950 p-4">Players choose adulthood jobs manually.</div>
                  <div className="rounded-2xl bg-zinc-950 p-4">Age fields support mobile typing now.</div>
                </div>
              </Section>
              <DiceWidget />
            </div>
          </div>
        </div>
      ) : null}

      {appMode === "sheet" ? (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 overflow-hidden rounded-[32px] border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl backdrop-blur">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Z-LAND Interactive Character Sheet • The Fall</div>
                <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">{APP_TITLE}</h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400 sm:text-base">Fresh rebuild with corrected mobile age typing and a cleaner health silhouette.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black hover:bg-emerald-400" onClick={saveNow}><Save className="h-4 w-4" /> Save</button>
                <button className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-700" onClick={handleExport}><Download className="h-4 w-4" /> Export</button>
                <button className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-700" onClick={() => fileInputRef.current?.click()}><Upload className="h-4 w-4" /> Import</button>
                <button className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-700" onClick={startWizard}><WandSparkles className="h-4 w-4" /> Wizard</button>
                <button className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-700" onClick={() => setAppMode("home")}><User className="h-4 w-4" /> Home</button>
                <button className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-red-600" onClick={resetAll}><RotateCcw className="h-4 w-4" /> New</button>
                <input ref={fileInputRef} type="file" accept="application/json" onChange={handleImport} className="hidden" />
              </div>
            </div>
            <div className="mt-4 text-sm text-zinc-500">{saveState}</div>
          </motion.div>

          <div className="mb-6 hidden flex-wrap gap-2 md:flex">
            {tabList.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.key;
              return <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`inline-flex min-h-[44px] items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold ${active ? "bg-emerald-500 text-black" : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800"}`}><Icon className="h-4 w-4" /> {tab.label}</button>;
            })}
          </div>

          <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pb-28 md:pb-12">
            {activeTab === "overview" ? (
              <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
                <div className="space-y-6">
                  <Section title="Identity" description="Core sheet fields plus a quick archetype loader." right={<select value={character.meta.archetype} onChange={(e) => { setMeta({ archetype: e.target.value }); if (e.target.value) applyArchetype(e.target.value); }} className="min-h-[44px] rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-base text-white outline-none focus:border-emerald-500 sm:text-sm"><option value="">Apply archetype...</option>{Object.keys(archetypes).map((name) => <option key={name} value={name}>{name}</option>)}</select>}>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      <Input label="Character Name" value={character.meta.characterName} onChange={(e) => setMeta({ characterName: e.target.value })} />
                      <Input label="Era" value={character.meta.era} onChange={(e) => setMeta({ era: e.target.value })} />
                      <Input label="Hometown" value={character.profile.hometown} onChange={(e) => setProfile({ hometown: e.target.value })} />
                      <Input label="Sex" value={character.profile.sex} onChange={(e) => setProfile({ sex: e.target.value })} />
                      <Input label="Age" value={character.profile.age} onChange={(e) => setProfile({ age: e.target.value })} />
                      <Input label="Build" value={character.profile.build} onChange={(e) => setProfile({ build: e.target.value })} />
                      <Input label="Handedness" value={character.profile.handedness} onChange={(e) => setProfile({ handedness: e.target.value })} />
                      <Input label="Skin Colour" value={character.profile.skinColour} onChange={(e) => setProfile({ skinColour: e.target.value })} />
                      <Input label="Hair Colour" value={character.profile.hairColour} onChange={(e) => setProfile({ hairColour: e.target.value })} />
                      <Input label="Eye Colour" value={character.profile.eyeColour} onChange={(e) => setProfile({ eyeColour: e.target.value })} />
                      <div className="md:col-span-2 xl:col-span-3"><Input label="Concept / Pitch" value={character.background.concept} onChange={(e) => setBackground({ concept: e.target.value })} /></div>
                    </div>
                  </Section>
                  <Section title="Life Path Notes" description="Editable notes produced by the wizard.">
                    <div className="grid gap-4 lg:grid-cols-2">
                      <TextArea label="Childhood" value={character.background.childhood} onChange={(e) => setBackground({ childhood: e.target.value })} />
                      <TextArea label="Teen Years" value={character.background.teenYears} onChange={(e) => setBackground({ teenYears: e.target.value })} />
                      <TextArea label="Adulthood" value={character.background.adulthood} onChange={(e) => setBackground({ adulthood: e.target.value })} />
                      <TextArea label="Loved Ones / Priorities" value={character.background.lovedOnes} onChange={(e) => setBackground({ lovedOnes: e.target.value })} />
                    </div>
                  </Section>
                </div>
                <div className="space-y-6">
                  <Section title="Portrait" description="Upload a portrait up to 2 MB.">
                    <div className="space-y-4">
                      <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950">
                        {character.meta.portraitData ? <img src={character.meta.portraitData} alt="Portrait" className="aspect-[3/4] w-full object-cover" /> : <div className="flex aspect-[3/4] items-center justify-center text-sm text-zinc-500">No portrait uploaded yet.</div>}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black hover:bg-emerald-400" onClick={() => portraitInputRef.current?.click()}><Upload className="h-4 w-4" /> Upload Portrait</button>
                        {character.meta.portraitData ? <button className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-red-600" onClick={() => setMeta({ portraitData: "", portraitName: "" })}><Trash2 className="h-4 w-4" /> Remove</button> : null}
                      </div>
                      <input ref={portraitInputRef} type="file" accept="image/*" onChange={handlePortraitUpload} className="hidden" />
                    </div>
                  </Section>
                  <Section title="Snapshot" description="Quick play values.">
                    <div className="grid gap-3">
                      {[{ label: "Physical wound slots / location", value: constitutionSlots, hint: "Based on Constitution" }, { label: "Mental wound slots / severity", value: willSlots, hint: "Based on Will" }, { label: "Current Sigils", value: currentSigils, hint: `Threshold ${sigilThreshold}` }].map((card) => <div key={card.label} className="rounded-2xl bg-zinc-950 p-4"><div className="text-xs uppercase tracking-[0.18em] text-zinc-500">{card.label}</div><div className="mt-2 text-2xl font-black text-white">{card.value}</div><div className="mt-1 text-sm text-zinc-400">{card.hint}</div></div>)}
                    </div>
                  </Section>
                  <DiceWidget />
                </div>
              </div>
            ) : null}

            {activeTab === "skills" ? (
              <div className="space-y-6">
                <Section title="Skill Roller" description="Set a manual modifier first, then roll any skill. Survival, mental, and wealth penalties are already included.">
                  <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-3xl bg-zinc-950 p-4">
                        <div className="mb-2 text-xs uppercase tracking-[0.18em] text-zinc-500">Current Sigils</div>
                        <div className="flex items-center justify-between gap-4">
                          <div><div className="text-3xl font-black text-white">{currentSigils}</div><div className="text-sm text-zinc-400">Threshold {sigilThreshold}</div></div>
                          <div className="flex gap-2"><button className="h-11 w-11 rounded-2xl bg-zinc-800 text-white hover:bg-zinc-700" onClick={() => setResources({ currentSigils: Math.max(0, currentSigils - 1) })}>-</button><button className="h-11 w-11 rounded-2xl bg-zinc-800 text-white hover:bg-zinc-700" onClick={() => setResources({ currentSigils: currentSigils + 1 })}>+</button></div>
                        </div>
                        <button className="mt-3 inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-700" onClick={() => setResources({ currentSigils: sigilThreshold })}>Reset to Threshold</button>
                      </div>
                      <div className="rounded-3xl bg-zinc-950 p-4">
                        <Input label="Manual Modifier" type="number" value={skillRollModifier} onChange={(e) => setSkillRollModifier(Number(e.target.value) || 0)} />
                        <button className={`mt-3 inline-flex min-h-[48px] items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold ${queuedSigilBonus ? "bg-amber-500 text-black" : "bg-zinc-800 text-white hover:bg-zinc-700"}`} onClick={() => { if (!queuedSigilBonus && currentSigils <= 0) return; setQueuedSigilBonus((prev) => !prev); }}><Crosshair className="h-4 w-4" /> {queuedSigilBonus ? "Sigil +25 Armed" : "Arm Sigil +25"}</button>
                      </div>
                    </div>
                    <div className="rounded-3xl bg-zinc-950 p-4 text-sm text-zinc-400">Roll results now appear in a centered popup so players do not have to scroll.</div>
                  </div>
                </Section>
                <Section title="Skills" description="Base value, effective value, and one-click rolling.">
                  <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
                    {skillOrder.map((skill) => {
                      const base = character.skills[skill] ?? 0;
                      const effective = computed.effectiveSkills[skill] ?? 0;
                      const isPhysical = physicalSkills.has(skill);
                      const isMental = mentalAffectedSkills.has(skill);
                      return (
                        <div key={skill} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <div>
                              <div className="text-base font-bold text-white">{skill}</div>
                              <div className="mt-1 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.16em]">
                                <span className={`rounded-full px-2 py-1 ${isPhysical ? "bg-emerald-500/20 text-emerald-300" : "bg-blue-500/20 text-blue-300"}`}>{isPhysical ? "Physical" : "Non-Physical"}</span>
                                {isMental ? <span className="rounded-full bg-amber-500/20 px-2 py-1 text-amber-300">Mental affected</span> : null}
                              </div>
                            </div>
                            <div className="rounded-2xl bg-zinc-900 px-3 py-2 text-right"><div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Effective</div><div className="text-xl font-black text-white">{effective}</div></div>
                          </div>
                          <div className="mb-4 flex items-center justify-between"><span className="text-sm text-zinc-400">Base value</span><NumberStepper value={base} onChange={(value) => updateSkill(skill, value)} /></div>
                          <button className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black hover:bg-emerald-400" onClick={() => rollSkillCheck(skill)}><Dices className="h-4 w-4" /> Roll {skill}</button>
                        </div>
                      );
                    })}
                  </div>
                </Section>
              </div>
            ) : null}

            {activeTab === "combat" ? (
              <div className="space-y-6">
                <Section title="Combat Rolls" description="Core combat modifier toggles, defense rolls, and weapons.">
                  <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <div className="grid gap-4">
                      {[
                        ["Ranged Attack", "rangedAttack", [{ key: "inMelee", label: "In melee" }, { key: "movingQuickly", label: "Moving quickly" }, { key: "offHanded", label: "Off-handed weapon" }, { key: "firingBlindly", label: "Firing blindly" }, { key: "aimed", label: "Aimed" }, { key: "areaOfEffect", label: "Area of effect" }]],
                        ["Ranged Defense", "rangedDefense", [{ key: "inMelee", label: "In melee" }, { key: "movingQuickly", label: "Moving quickly" }, { key: "areaOfEffect", label: "Area of effect" }, { key: "dodge", label: "Dodge" }, { key: "surprised", label: "Surprised" }, { key: "inCover", label: "In cover" }]],
                        ["Melee Attack", "meleeAttack", [{ key: "charging", label: "Charging" }, { key: "superiorPosition", label: "Superior position" }, { key: "offHanded", label: "Off-handed weapon" }, { key: "aimed", label: "Aimed" }, { key: "flankingAllies", label: "Allies flanking", type: "count" }]],
                        ["Melee Defense", "meleeDefense", [{ key: "parry", label: "Parry" }, { key: "superiorPosition", label: "Superior position" }, { key: "offHanded", label: "Off-handed weapon" }, { key: "dodge", label: "Dodge" }, { key: "flankingEnemies", label: "Enemies flanking", type: "count" }]],
                      ].map(([title, section, fields]) => {
                        const values = character.combat.modifiers[section];
                        const total = getCombatModifierTotal(section);
                        return (
                          <div key={section} className="rounded-3xl bg-zinc-950 p-4">
                            <div className="mb-3 flex items-start justify-between gap-3"><div><div className="text-base font-bold text-white">{title}</div></div><div className="rounded-2xl bg-zinc-900 px-3 py-2 text-right"><div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Total</div><div className="text-xl font-black text-white">{total >= 0 ? `+${total}` : total}</div></div></div>
                            <div className="grid gap-2 md:grid-cols-2">
                              {fields.map((field) => <label key={field.key} className="flex min-h-[52px] items-center justify-between gap-3 rounded-2xl bg-zinc-900 px-3 py-3 text-sm text-zinc-300"><span>{field.label}</span>{field.type === "count" ? <input type="number" min={0} value={values[field.key]} onChange={(e) => setCombat({ modifiers: { ...character.combat.modifiers, [section]: { ...values, [field.key]: clampNonNegative(e.target.value) } } })} className="h-11 w-20 rounded-xl border border-zinc-800 bg-zinc-950 px-2 py-2 text-center text-base text-white outline-none focus:border-emerald-500 sm:text-sm" /> : <input type="checkbox" checked={values[field.key]} onChange={(e) => setCombat({ modifiers: { ...character.combat.modifiers, [section]: { ...values, [field.key]: e.target.checked } } })} className="h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-emerald-500" />}</label>)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="space-y-4">
                      <div className="rounded-3xl bg-zinc-950 p-4">
                        <div className="mb-3 text-sm font-semibold text-white">Quick defense rolls</div>
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="rounded-2xl bg-zinc-900 p-3">
                            <label className="block"><span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Ranged defense skill</span><select value={character.combat.defenseSkills.ranged} onChange={(e) => setCombat({ defenseSkills: { ...character.combat.defenseSkills, ranged: e.target.value } })} className="min-h-[48px] w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-base text-white outline-none focus:border-emerald-500 sm:text-sm">{skillOrder.map((skill) => <option key={skill} value={skill}>{skill}</option>)}</select></label>
                            <button className="mt-3 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black hover:bg-emerald-400" onClick={() => rollCombatDefense("ranged")}><Dices className="h-4 w-4" /> Roll Ranged Defense</button>
                          </div>
                          <div className="rounded-2xl bg-zinc-900 p-3">
                            <label className="block"><span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Melee defense skill</span><select value={character.combat.defenseSkills.melee} onChange={(e) => setCombat({ defenseSkills: { ...character.combat.defenseSkills, melee: e.target.value } })} className="min-h-[48px] w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-base text-white outline-none focus:border-emerald-500 sm:text-sm">{skillOrder.map((skill) => <option key={skill} value={skill}>{skill}</option>)}</select></label>
                            <button className="mt-3 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black hover:bg-emerald-400" onClick={() => rollCombatDefense("melee")}><Dices className="h-4 w-4" /> Roll Melee Defense</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Section>

                <Section title="Weapons" description="Add weapons, assign skills, and roll attacks." right={<div className="flex gap-2"><button className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400" onClick={() => setCombat({ weapons: [...character.combat.weapons, makeWeapon("ranged")] })}><Plus className="h-4 w-4" /> Ranged</button><button className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400" onClick={() => setCombat({ weapons: [...character.combat.weapons, makeWeapon("melee")] })}><Plus className="h-4 w-4" /> Melee</button></div>}>
                  <div className="space-y-3">
                    {character.combat.weapons.map((weapon, index) => (
                      <div key={index} className="rounded-2xl bg-zinc-950 p-4">
                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.2fr_120px_120px_120px_140px_auto]">
                          <Input label="Weapon" value={weapon.name} onChange={(e) => setCombat({ weapons: arrayUpdate(character.combat.weapons, index, { name: e.target.value }) })} />
                          <label className="block"><span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Class</span><select value={weapon.weightClass} onChange={(e) => { const weightClass = e.target.value; setCombat({ weapons: arrayUpdate(character.combat.weapons, index, { weightClass, damage: weaponClassData[weightClass].damage, woundMod: weaponClassData[weightClass].woundMod }) }); }} className="min-h-[48px] w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-base text-white outline-none focus:border-emerald-500 sm:text-sm">{Object.keys(weaponClassData).map((key) => <option key={key} value={key}>{key}</option>)}</select></label>
                          <label className="block"><span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Category</span><select value={weapon.category} onChange={(e) => setCombat({ weapons: arrayUpdate(character.combat.weapons, index, { category: e.target.value, skill: e.target.value === "ranged" ? "Shoot" : "Fight", rangeBand: e.target.value === "ranged" ? "Medium" : "Close" }) })} className="min-h-[48px] w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-base text-white outline-none focus:border-emerald-500 sm:text-sm"><option value="ranged">Ranged</option><option value="melee">Melee</option></select></label>
                          <label className="block"><span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Range</span><select value={weapon.rangeBand} onChange={(e) => setCombat({ weapons: arrayUpdate(character.combat.weapons, index, { rangeBand: e.target.value }) })} className="min-h-[48px] w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-base text-white outline-none focus:border-emerald-500 sm:text-sm">{rangeBands.map((band) => <option key={band} value={band}>{band}</option>)}</select></label>
                          <label className="block"><span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Assigned Skill</span><select value={weapon.skill} onChange={(e) => setCombat({ weapons: arrayUpdate(character.combat.weapons, index, { skill: e.target.value }) })} className="min-h-[48px] w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-base text-white outline-none focus:border-emerald-500 sm:text-sm">{skillOrder.map((skill) => <option key={skill} value={skill}>{skill}</option>)}</select></label>
                          <div className="flex items-end gap-2"><button className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black hover:bg-emerald-400" onClick={() => rollWeaponAttack(weapon)}><Dices className="h-4 w-4" /> Attack</button><button className="inline-flex min-h-[48px] items-center justify-center rounded-2xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-red-600" onClick={() => setCombat({ weapons: character.combat.weapons.filter((_, i) => i !== index) })}><Trash2 className="h-4 w-4" /></button></div>
                        </div>
                        <div className="mt-3 grid gap-3 md:grid-cols-[120px_120px_1fr]">
                          <Input label="Damage" type="number" value={weapon.damage} onChange={(e) => setCombat({ weapons: arrayUpdate(character.combat.weapons, index, { damage: clampNonNegative(e.target.value) }) })} />
                          <Input label="Wound Mod" type="number" value={weapon.woundMod} onChange={(e) => setCombat({ weapons: arrayUpdate(character.combat.weapons, index, { woundMod: Number(e.target.value) || 0 }) })} />
                          <Input label="Notes" value={weapon.notes} onChange={(e) => setCombat({ weapons: arrayUpdate(character.combat.weapons, index, { notes: e.target.value }) })} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              </div>
            ) : null}

            {activeTab === "health" ? (
              <div className="space-y-6">
                <Section title="Physical Health" description="Cleaner body silhouette with clickable hit locations and side-panel damage tracking.">
                  <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                    <BodySilhouette selected={activeHealthLocation} states={character.combat.hitLocations} onSelect={setActiveHealthLocation} />
                    <div className="rounded-3xl bg-zinc-950 p-4">
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xl font-bold text-white">{hitLocations.find((loc) => loc.key === activeHealthLocation)?.label}</div>
                          <div className="mt-1 text-sm text-zinc-400">Hit location {hitLocations.find((loc) => loc.key === activeHealthLocation)?.range}</div>
                        </div>
                        <select value={selectedLocation.armour} onChange={(e) => setCombat({ hitLocations: { ...character.combat.hitLocations, [activeHealthLocation]: { ...selectedLocation, armour: e.target.value } } })} className="min-h-[44px] rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-base text-white outline-none focus:border-emerald-500 sm:text-sm">
                          {armourOptions.map((option) => <option key={option} value={option}>{option} Armour</option>)}
                        </select>
                      </div>
                      <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-3">
                        {Array.from({ length: constitutionSlots }).map((_, idx) => {
                          const filled = selectedLocation.slots[idx];
                          return <button key={idx} onClick={() => { const slots = [...selectedLocation.slots]; slots[idx] = !slots[idx]; setCombat({ hitLocations: { ...character.combat.hitLocations, [activeHealthLocation]: { ...selectedLocation, slots } } }); }} className={`min-h-[64px] rounded-2xl border px-3 py-3 text-left ${filled ? "border-red-500 bg-red-500/20 text-red-100" : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600"}`}><div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Slot {idx + 1}</div><div className="mt-1 font-semibold">{["Minor", "Significant", "Grievous"][idx % 3]}</div></button>;
                        })}
                      </div>
                      <label className="inline-flex items-center gap-2 text-sm text-zinc-300"><input type="checkbox" checked={selectedLocation.destroyed} onChange={(e) => setCombat({ hitLocations: { ...character.combat.hitLocations, [activeHealthLocation]: { ...selectedLocation, destroyed: e.target.checked } } })} className="h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-emerald-500" /> Location Destroyed</label>
                      <div className="mt-6">
                        <div className="mb-3 flex items-center justify-between"><div className="text-sm font-semibold text-white">Grievous wounds for this location</div><button className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400" onClick={() => setCombat({ grievousWounds: [...character.combat.grievousWounds, { location: activeHealthLocation, description: "", healTime: "" }] })}><Plus className="h-4 w-4" /> Add</button></div>
                        <div className="space-y-3">
                          {locationGrievous.length === 0 ? <div className="rounded-2xl bg-zinc-900 p-4 text-sm text-zinc-500">No grievous wounds logged for this location.</div> : locationGrievous.map((entry, idx) => {
                            const actualIndex = character.combat.grievousWounds.findIndex((item) => item === entry);
                            return <div key={idx} className="grid gap-3 rounded-2xl bg-zinc-900 p-4 md:grid-cols-[1fr_160px_auto]"><Input label="Wound" value={entry.description} onChange={(e) => setCombat({ grievousWounds: arrayUpdate(character.combat.grievousWounds, actualIndex, { description: e.target.value }) })} /><Input label="Heal Time" value={entry.healTime} onChange={(e) => setCombat({ grievousWounds: arrayUpdate(character.combat.grievousWounds, actualIndex, { healTime: e.target.value }) })} /><div className="flex items-end"><button className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-red-600" onClick={() => setCombat({ grievousWounds: character.combat.grievousWounds.filter((_, i) => i !== actualIndex) })}><Trash2 className="h-4 w-4" /> Remove</button></div></div>;
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </Section>
                <Section title="Mental Health" description="Will determines how many minor, significant, and grievous mental wound slots are available.">
                  <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
                    <div className="rounded-3xl bg-zinc-950 p-4">
                      {[["minor", "Minor"], ["significant", "Significant"], ["grievous", "Grievous"]].map(([bucket, label]) => <div key={bucket} className="mb-4 last:mb-0"><div className="mb-2 text-sm font-semibold text-white">{label}</div><div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">{Array.from({ length: willSlots }).map((_, idx) => { const filled = character.mental[bucket][idx]; return <button key={idx} onClick={() => { const next = [...character.mental[bucket]]; next[idx] = !next[idx]; setMental({ [bucket]: next }); }} className={`min-h-[52px] rounded-2xl border px-3 py-3 text-sm ${filled ? "border-purple-400 bg-purple-500/20 text-purple-100" : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600"}`}>{label} {idx + 1}</button>; })}</div></div>)}
                    </div>
                    <div className="rounded-3xl bg-zinc-950 p-4 text-sm text-zinc-300"><div className="rounded-2xl bg-zinc-900 p-3">Significant wound penalty: {character.mental.significant.slice(0, willSlots).some(Boolean) ? "-10 active" : "none"}</div><div className="mt-3 rounded-2xl bg-zinc-900 p-3">Grievous wound penalty: {character.mental.grievous.slice(0, willSlots).some(Boolean) ? "-15 active" : "none"}</div></div>
                  </div>
                </Section>
              </div>
            ) : null}

            {activeTab === "survival" ? (
              <div className="space-y-6">
                <Section title="Survival Penalties" description="Numerical penalties from hunger, thirst, sleep, exhaustion, and temperature.">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    <div className="rounded-3xl bg-zinc-950 p-4"><div className="mb-2 text-sm font-semibold text-white">Hunger failures</div><NumberStepper value={character.survival.hungerFails} onChange={(value) => setSurvival({ hungerFails: clampNonNegative(value) })} min={0} max={20} /><div className="mt-3 text-sm text-zinc-400">Physical {computed.hungerPhysical} / Non-physical {computed.hungerMental}</div></div>
                    <div className="rounded-3xl bg-zinc-950 p-4"><div className="mb-2 text-sm font-semibold text-white">Thirst failures</div><NumberStepper value={character.survival.thirstFails} onChange={(value) => setSurvival({ thirstFails: clampNonNegative(value) })} min={0} max={20} /><div className="mt-3 text-sm text-zinc-400">Physical {computed.thirstPhysical} / Non-physical {computed.thirstMental}</div></div>
                    <div className="rounded-3xl bg-zinc-950 p-4"><div className="mb-2 text-sm font-semibold text-white">Sleep failures</div><NumberStepper value={character.survival.sleepFails} onChange={(value) => setSurvival({ sleepFails: clampNonNegative(value) })} min={0} max={20} /><div className="mt-3 text-sm text-zinc-400">All skills {computed.sleepAll}</div></div>
                    <div className="rounded-3xl bg-zinc-950 p-4"><div className="mb-2 text-sm font-semibold text-white">Exhaustion penalty</div><NumberStepper value={character.survival.exhaustionPenalty} onChange={(value) => setSurvival({ exhaustionPenalty: clampNonNegative(value) })} min={0} max={60} /><div className="mt-3 text-sm text-zinc-400">Physical only {computed.exhaustionPhysical}</div></div>
                    <div className="rounded-3xl bg-zinc-950 p-4"><div className="mb-2 text-sm font-semibold text-white">Temperature</div><select value={character.survival.temperature} onChange={(e) => setSurvival({ temperature: e.target.value })} className="min-h-[48px] w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-base text-white outline-none focus:border-emerald-500 sm:text-sm">{temperatureOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select><div className="mt-3 text-sm text-zinc-400">All skills {computed.tempAll}</div></div>
                  </div>
                </Section>
              </div>
            ) : null}

            {activeTab === "inventory" ? (
              <div className="space-y-6">
                <Section title="Gear & Wealth" description="Track gear, ammo, and wealth pressure.">
                  <div className="grid gap-4 xl:grid-cols-2">
                    <div className="rounded-3xl bg-zinc-950 p-4">
                      <div className="mb-3 flex items-center justify-between"><div className="text-sm font-semibold text-white">Gear</div><button className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400" onClick={() => setInventory({ gear: [...character.inventory.gear, { name: "", qty: 1, notes: "" }] })}><Plus className="h-4 w-4" /> Add</button></div>
                      <div className="space-y-3">{character.inventory.gear.map((item, index) => <div key={index} className="grid gap-3 rounded-2xl bg-zinc-900 p-4 md:grid-cols-[1fr_100px_1fr_auto]"><Input label="Item" value={item.name} onChange={(e) => setInventory({ gear: arrayUpdate(character.inventory.gear, index, { name: e.target.value }) })} /><Input label="Qty" type="number" value={item.qty} onChange={(e) => setInventory({ gear: arrayUpdate(character.inventory.gear, index, { qty: clampNonNegative(e.target.value) }) })} /><Input label="Notes" value={item.notes} onChange={(e) => setInventory({ gear: arrayUpdate(character.inventory.gear, index, { notes: e.target.value }) })} /><div className="flex items-end"><button className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-red-600" onClick={() => setInventory({ gear: character.inventory.gear.filter((_, i) => i !== index) })}><Trash2 className="h-4 w-4" /> Remove</button></div></div>)}</div>
                    </div>
                    <div className="rounded-3xl bg-zinc-950 p-4">
                      <div className="mb-3 flex items-center justify-between"><div className="text-sm font-semibold text-white">Ammo / consumables</div><button className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400" onClick={() => setInventory({ ammo: [...character.inventory.ammo, { type: "", qty: "", notes: "" }] })}><Plus className="h-4 w-4" /> Add</button></div>
                      <div className="space-y-3">{character.inventory.ammo.map((item, index) => <div key={index} className="grid gap-3 rounded-2xl bg-zinc-900 p-4 md:grid-cols-[1fr_120px_1fr_auto]"><Input label="Type" value={item.type} onChange={(e) => setInventory({ ammo: arrayUpdate(character.inventory.ammo, index, { type: e.target.value }) })} /><Input label="Qty" value={item.qty} onChange={(e) => setInventory({ ammo: arrayUpdate(character.inventory.ammo, index, { qty: e.target.value }) })} /><Input label="Notes" value={item.notes} onChange={(e) => setInventory({ ammo: arrayUpdate(character.inventory.ammo, index, { notes: e.target.value }) })} /><div className="flex items-end"><button className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-red-600" onClick={() => setInventory({ ammo: character.inventory.ammo.filter((_, i) => i !== index) })}><Trash2 className="h-4 w-4" /> Remove</button></div></div>)}</div>
                      <div className="mt-4 grid gap-4 md:grid-cols-2"><div><div className="mb-2 text-sm font-semibold text-white">Wealth pressure</div><NumberStepper value={character.inventory.wealthPenalty} onChange={(value) => setInventory({ wealthPenalty: clampNonNegative(value) })} min={0} max={50} /></div><TextArea label="Stash Notes" value={character.inventory.stashNotes} onChange={(e) => setInventory({ stashNotes: e.target.value })} rows={4} /></div>
                    </div>
                  </div>
                </Section>
              </div>
            ) : null}

            {activeTab === "notes" ? (
              <div className="grid gap-6 xl:grid-cols-2">
                <Section title="Character Notes" description="Appearance, contacts, and session notes."><div className="space-y-4"><TextArea label="Appearance" value={character.notes.appearance} onChange={(e) => setNotes({ appearance: e.target.value })} /><TextArea label="Allies / Factions / NPCs" value={character.notes.allies} onChange={(e) => setNotes({ allies: e.target.value })} /><TextArea label="Session Notes" value={character.notes.sessionNotes} onChange={(e) => setNotes({ sessionNotes: e.target.value })} rows={8} /></div></Section>
                <Section title="Goals & Campaign Notes" description="Player-facing goals and reminders."><div className="space-y-4"><TextArea label="Goals / Threads" value={character.notes.goals} onChange={(e) => setNotes({ goals: e.target.value })} rows={6} /><div className="rounded-3xl bg-zinc-950 p-4 text-sm text-zinc-300">This version is player-facing only and The Fall focused.</div></div></Section>
              </div>
            ) : null}
          </motion.div>

          <MobileTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      ) : null}

      <RollPopup open={Boolean(rollModal && appMode === "sheet")} title={rollModal?.title ?? "Roll"} result={rollModal?.result ?? null} onClose={() => setRollModal(null)} onReroll={rerollSkillCheck} rerollEnabled={Boolean(rollModal && rollModal.kind === "skill" && rollModal.result && !rollModal.result.success && currentSigils > 0)} />
    </div>
  );
}
