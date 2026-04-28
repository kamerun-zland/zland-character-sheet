import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Save,
  Download,
  Upload,
  RotateCcw,
  Plus,
  Trash2,
  Dices,
  Shield,
  HeartPulse,
  Backpack,
  NotebookPen,
  User,
  Sword,
  WandSparkles,
  ChevronLeft,
  ChevronRight,
  Check,
  Heart,
  Crosshair,
  RefreshCcw,
} from "lucide-react";

const STORAGE_KEY = "zland-character-sheet-v5-the-fall";
const APP_TITLE = "Z-Land Character Sheet";

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

const armourOptions = ["None", "Soft", "Sturdy", "Strong"];
const temperatureOptions = [
  "None",
  "Hot / Cold",
  "Burning / Freezing",
  "Hypothermia / Hyperthermia",
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

const weaponClassData = {
  Light: { damage: 10, woundMod: -5 },
  Medium: { damage: 20, woundMod: -10 },
  Heavy: { damage: 30, woundMod: -15 },
};

const rangeBands = ["Close", "Near", "Medium", "Far", "Distant"];

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

const maleBodyOptions = [
  { min: 1, max: 10, label: "Scrawny" },
  { min: 11, max: 25, label: "Lean" },
  { min: 26, max: 40, label: "Athletic" },
  { min: 41, max: 60, label: "Average" },
  { min: 61, max: 75, label: "Brawny" },
  { min: 76, max: 90, label: "Stocky" },
  { min: 91, max: 100, label: "Heavy" },
];

const femaleBodyOptions = [
  { min: 1, max: 10, label: "Petite" },
  { min: 11, max: 25, label: "Slender" },
  { min: 26, max: 40, label: "Fit" },
  { min: 41, max: 60, label: "Average" },
  { min: 61, max: 75, label: "Muscular" },
  { min: 76, max: 90, label: "Buxom" },
  { min: 91, max: 100, label: "Plump" },
];

const handednessOptions = [
  { min: 1, max: 89, label: "Right Handed" },
  { min: 90, max: 99, label: "Left Handed" },
  { min: 100, max: 100, label: "Ambidextrous" },
];

const skinOptions = [
  { min: 1, max: 17, label: "Pale" },
  { min: 18, max: 34, label: "Fair" },
  { min: 35, max: 50, label: "Ivory" },
  { min: 51, max: 66, label: "Olive" },
  { min: 67, max: 83, label: "Brown" },
  { min: 84, max: 100, label: "Black" },
];

const hairOptions = [
  { min: 1, max: 34, label: "Red" },
  { min: 35, max: 68, label: "Blonde" },
  { min: 69, max: 100, label: "Chestnut" },
  { min: 101, max: 122, label: "Auburn" },
  { min: 123, max: 166, label: "Brown" },
  { min: 167, max: 200, label: "Black" },
];

const eyeOptions = [
  { min: 1, max: 34, label: "Blue" },
  { min: 35, max: 68, label: "Grey" },
  { min: 69, max: 100, label: "Green" },
  { min: 101, max: 122, label: "Hazel" },
  { min: 123, max: 166, label: "Brown" },
  { min: 167, max: 200, label: "Dark Brown" },
];

const childhoodQuestions = {
  parents: [
    { min: 1, max: 50, label: "Both were alive", skills: ["Luck", "Fine-Craft"] },
    { min: 51, max: 70, label: "Something happened to mum", skills: [] },
    { min: 71, max: 90, label: "Something happened to dad", skills: [] },
    { min: 91, max: 100, label: "Something happened to both", skills: [] },
  ],
  parentWhat: [
    { min: 1, max: 11, label: "I never knew my parent(s)", skills: ["Will", "Diplomacy"] },
    { min: 12, max: 22, label: "My parent(s) were murdered", skills: ["Investigate", "Intuition"] },
    { min: 23, max: 33, label: "My parent(s) abandoned me", skills: ["Wealth", "Broad-Craft"] },
    { min: 34, max: 44, label: "My parent(s) died in a war/battle", skills: ["Athletics", "Drive"] },
    { min: 45, max: 55, label: "My parent(s) died in an accident/of an illness", skills: ["Logic", "Constitution"] },
    { min: 56, max: 66, label: "My parent(s) and I are estranged", skills: ["Intimidate", "Perception"] },
    { min: 67, max: 77, label: "My parent(s) are in prison", skills: ["Burglary", "Fight"] },
    { min: 78, max: 88, label: "I killed my parent(s)", skills: ["Shoot", "Deceive"] },
    { min: 89, max: 100, label: "I was kidnapped from my parent(s)", skills: ["Might", "Stealth"] },
  ],
  familySize: [
    { min: 1, max: 20, label: "Tiny", skills: [] },
    { min: 21, max: 40, label: "Small", skills: [] },
    { min: 41, max: 60, label: "Average", skills: [] },
    { min: 61, max: 80, label: "Large", skills: [] },
    { min: 81, max: 100, label: "Massive", skills: [] },
  ],
  god: [
    { min: 1, max: 20, label: "Deus Vult!", skills: ["Intimidate", "Luck"] },
    { min: 21, max: 40, label: "Jesus loves us all", skills: ["Fine-Craft", "Logic"] },
    { min: 41, max: 60, label: "As long as it does not affect my day-to-day life", skills: ["Diplomacy", "Investigate"] },
    { min: 61, max: 80, label: "I leave him alone and he leaves me alone", skills: ["Intuition", "Stealth"] },
    { min: 81, max: 100, label: "I do not know and I do not care", skills: ["Perception", "Will"] },
  ],
  caregivers: [
    { min: 1, max: 20, label: "The Nazis could have learnt a thing or two", skills: ["Might", "Fight"] },
    { min: 21, max: 40, label: "Spare the rod, spoil the child", skills: ["Constitution", "Shoot"] },
    { min: 41, max: 60, label: "I got smacked when I needed it", skills: ["Broad-Craft", "Athletics"] },
    { min: 61, max: 80, label: "Best friends with the naughty corner", skills: ["Burglary", "Deceive"] },
    { min: 81, max: 100, label: "I did not have caregivers, I had staff", skills: ["Drive", "Wealth"] },
  ],
  grewUp: [
    { min: 1, max: 10, label: "On the streets", skills: ["Stealth", "Burglary"] },
    { min: 11, max: 20, label: "On the road, always traveling for business", skills: ["Drive", "Fine-Craft"] },
    { min: 21, max: 30, label: "On the farm, in the muck", skills: ["Athletics", "Constitution"] },
    { min: 31, max: 40, label: "In the shop, always underfoot", skills: ["Broad-Craft", "Diplomacy"] },
    { min: 41, max: 50, label: "On the run from enemies", skills: ["Fight", "Shoot"] },
    { min: 51, max: 60, label: "In a boring suburban home", skills: ["Perception", "Luck"] },
    { min: 61, max: 70, label: "In a boarding school", skills: ["Logic", "Investigate"] },
    { min: 71, max: 80, label: "In a mansion, waited upon hand and foot", skills: ["Wealth", "Intimidate"] },
    { min: 81, max: 90, label: "In a cramped urban apartment", skills: ["Deceive", "Intuition"] },
    { min: 91, max: 100, label: "In one military base or the other", skills: ["Will", "Might"] },
  ],
  influence: [
    { min: 1, max: 10, label: "My parent(s) or the idea of them", skills: ["Drive", "Diplomacy"] },
    { min: 11, max: 20, label: "My sibling or friend if I was an only child", skills: ["Athletics", "Fight"] },
    { min: 21, max: 30, label: "My best friend", skills: ["Fine-Craft", "Burglary"] },
    { min: 31, max: 40, label: "My favourite teacher", skills: ["Logic", "Broad-Craft"] },
    { min: 41, max: 50, label: "A military hero", skills: ["Shoot", "Might"] },
    { min: 51, max: 60, label: "My bully", skills: ["Intimidate", "Stealth"] },
    { min: 61, max: 70, label: "A celebrity", skills: ["Intuition", "Wealth"] },
    { min: 71, max: 80, label: "A religious leader", skills: ["Will", "Constitution"] },
    { min: 81, max: 90, label: "A fictional character from my favourite book, show, or movie", skills: ["Investigate", "Luck"] },
    { min: 91, max: 100, label: "Me", skills: ["Deceive", "Perception"] },
  ],
  feeling: [
    { min: 1, max: 10, label: "Happy", skills: ["Athletics", "Deceive"] },
    { min: 11, max: 20, label: "Sad", skills: ["Diplomacy", "Intuition"] },
    { min: 21, max: 30, label: "Angry", skills: ["Shoot", "Intimidate"] },
    { min: 31, max: 40, label: "Peaceful", skills: ["Drive", "Broad-Craft"] },
    { min: 41, max: 50, label: "Afraid", skills: ["Perception", "Stealth"] },
    { min: 51, max: 60, label: "Ashamed", skills: ["Burglary", "Constitution"] },
    { min: 61, max: 70, label: "Confused", skills: ["Luck", "Might"] },
    { min: 71, max: 80, label: "Proud", skills: ["Fine-Craft", "Fight"] },
    { min: 81, max: 90, label: "Cynical", skills: ["Investigate", "Will"] },
    { min: 91, max: 100, label: "Indifferent", skills: ["Logic", "Wealth"] },
  ],
};

const teenQuestions = {
  subject: [
    { min: 1, max: 10, label: "Science", skills: ["Logic", "Investigate"] },
    { min: 11, max: 20, label: "Social Studies", skills: ["Burglary", "Fine-Craft"] },
    { min: 21, max: 30, label: "Outdoor Education", skills: ["Drive", "Athletics"] },
    { min: 31, max: 40, label: "Legal Studies", skills: ["Deceive", "Luck"] },
    { min: 41, max: 50, label: "Woodwork / Metalwork", skills: ["Broad-Craft", "Fight"] },
    { min: 51, max: 60, label: "English / vernacular", skills: ["Diplomacy", "Stealth"] },
    { min: 61, max: 70, label: "Drama / Theatre", skills: ["Intuition", "Intimidate"] },
    { min: 71, max: 80, label: "Gym Class", skills: ["Constitution", "Might"] },
    { min: 81, max: 90, label: "Home Economics / Hospitality", skills: ["Wealth", "Perception"] },
    { min: 91, max: 100, label: "Mathematics", skills: ["Will", "Shoot"] },
  ],
  bestFriend: [
    { min: 1, max: 10, label: "A street urchin", skills: ["Perception", "Stealth"] },
    { min: 11, max: 20, label: "The rich kid", skills: ["Wealth", "Drive"] },
    { min: 21, max: 30, label: "A young farmhand", skills: ["Might", "Shoot"] },
    { min: 31, max: 40, label: "The normal kid", skills: ["Broad-Craft", "Diplomacy"] },
    { min: 41, max: 50, label: "The loner / outcast", skills: ["Athletics", "Burglary"] },
    { min: 51, max: 60, label: "An army brat", skills: ["Fight", "Constitution"] },
    { min: 61, max: 70, label: "A bookworm", skills: ["Luck", "Investigate"] },
    { min: 71, max: 80, label: "The Pastor’s daughter / son", skills: ["Will", "Intuition"] },
    { min: 81, max: 90, label: "A powerful politician’s child", skills: ["Deceive", "Fine-Craft"] },
    { min: 91, max: 100, label: "I did not have a best friend", skills: ["Logic", "Intimidate"] },
  ],
  crush: [
    { min: 1, max: 10, label: "Sweet, like chocolate", skills: ["Luck", "Broad-Craft"] },
    { min: 11, max: 20, label: "They loved me, and so did their best friend", skills: ["Constitution", "Athletics"] },
    { min: 21, max: 30, label: "I fought with my best friend over them", skills: ["Shoot", "Burglary"] },
    { min: 31, max: 40, label: "I caught them and their old lover together", skills: ["Intuition", "Fight"] },
    { min: 41, max: 50, label: "Their parents did not like me", skills: ["Fine-Craft", "Intimidate"] },
    { min: 51, max: 60, label: "They got involved with the wrong crowd and turned to crime", skills: ["Burglary", "Might"] },
    { min: 61, max: 70, label: "They did not know I existed, but I up-voted all their photos", skills: ["Will", "Logic"] },
    { min: 71, max: 80, label: "They kept secrets from me", skills: ["Investigate", "Stealth"] },
    { min: 81, max: 90, label: "They did not love me back", skills: ["Drive", "Perception"] },
    { min: 91, max: 100, label: "Cheap and by the hour", skills: ["Deceive", "Diplomacy"] },
  ],
  turningPoint: [
    { min: 1, max: 10, label: "Nearly died. I still bear the scars of the incident", skills: ["Constitution", "Perception"] },
    { min: 11, max: 20, label: "Saved someone from dying", skills: ["Athletics", "Fine-Craft"] },
    { min: 21, max: 30, label: "Was blackmailed into doing something terrible", skills: ["Stealth", "Shoot"] },
    { min: 31, max: 40, label: "Nursed a starving animal back to health", skills: ["Broad-Craft", "Drive"] },
    { min: 41, max: 50, label: "Got an addiction", skills: ["Burglary", "Fight"] },
    { min: 51, max: 60, label: "Got disowned by those closest to me", skills: ["Will", "Deceive"] },
    { min: 61, max: 70, label: "Was given a precious family heirloom", skills: ["Logic", "Might"] },
    { min: 71, max: 80, label: "My most prized possession was stolen", skills: ["Investigate", "Intimidate"] },
    { min: 81, max: 90, label: "Travelled around the world", skills: ["Luck", "Intuition"] },
    { min: 91, max: 100, label: "Won the jackpot during my first time at a casino", skills: ["Wealth", "Diplomacy"] },
  ],
  loseAnyone: [
    { min: 1, max: 10, label: "My parent(s)", skills: [] },
    { min: 11, max: 20, label: "My sibling", skills: [] },
    { min: 21, max: 30, label: "My crush", skills: [] },
    { min: 31, max: 40, label: "Other family member", skills: [] },
    { min: 41, max: 50, label: "My best friend", skills: [] },
    { min: 51, max: 60, label: "My favourite teacher", skills: [] },
    { min: 61, max: 100, label: "Fate spared me", skills: ["Luck", "Will"] },
  ],
  loseAnyoneWhat: [
    { min: 1, max: 20, label: "They vanished", skills: ["Investigate", "Intuition"] },
    { min: 21, max: 30, label: "An accident, nothing could be done", skills: ["Might", "Fine-Craft"] },
    { min: 31, max: 40, label: "Murder most foul", skills: ["Perception", "Fight"] },
    { min: 41, max: 50, label: "Old debts chased them away", skills: ["Athletics", "Intimidate"] },
    { min: 51, max: 60, label: "Illness", skills: ["Constitution", "Broad-Craft"] },
    { min: 61, max: 70, label: "An ill-fated journey was their end", skills: ["Drive", "Stealth"] },
    { min: 71, max: 80, label: "They were kidnapped", skills: ["Logic", "Diplomacy"] },
    { min: 81, max: 90, label: "The police discovered they were a criminal", skills: ["Burglary", "Wealth"] },
    { min: 91, max: 100, label: "They gave up on this world and rest eternally", skills: ["Shoot", "Deceive"] },
  ],
  feeling: [
    { min: 1, max: 10, label: "Happy", skills: ["Might", "Athletics"] },
    { min: 11, max: 20, label: "Sad", skills: ["Shoot", "Constitution"] },
    { min: 21, max: 30, label: "Angry", skills: ["Will", "Burglary"] },
    { min: 31, max: 40, label: "Peaceful", skills: ["Fight", "Logic"] },
    { min: 41, max: 50, label: "Afraid", skills: ["Deceive", "Investigate"] },
    { min: 51, max: 60, label: "Ashamed", skills: ["Intimidate", "Stealth"] },
    { min: 61, max: 70, label: "Confused", skills: ["Intuition", "Diplomacy"] },
    { min: 71, max: 80, label: "Proud", skills: ["Drive", "Luck"] },
    { min: 81, max: 90, label: "Cynical", skills: ["Fine-Craft", "Perception"] },
    { min: 91, max: 100, label: "Indifferent", skills: ["Broad-Craft", "Wealth"] },
  ],
};

const finishingQuestions = {
  soulmate: [
    { min: 1, max: 50, label: "Yes", skills: [] },
    { min: 51, max: 100, label: "No", skills: [] },
  ],
  children: [
    { min: 1, max: 10, label: "One", skills: [] },
    { min: 11, max: 30, label: "Two", skills: [] },
    { min: 31, max: 50, label: "Three", skills: [] },
    { min: 51, max: 100, label: "Never work with children or animals", skills: [] },
  ],
  loseSomeone: [
    { min: 1, max: 10, label: "Your child(ren)", skills: ["Deceive", "Broad-Craft"] },
    { min: 11, max: 20, label: "Your mentor", skills: ["Logic", "Intuition"] },
    { min: 21, max: 30, label: "Your spouse / lover", skills: ["Drive", "Will"] },
    { min: 31, max: 40, label: "Your closest friend", skills: ["Fine-Craft", "Shoot"] },
    { min: 41, max: 50, label: "A sibling", skills: ["Diplomacy", "Investigate"] },
    { min: 51, max: 60, label: "A parent", skills: ["Might", "Fight"] },
    { min: 61, max: 100, label: "Fate spared you", skills: ["Luck", "Perception"] },
  ],
  lovedOnes: [
    { min: 1, max: 20, label: "I stand alone in the world", skills: [] },
    { min: 21, max: 40, label: "A paltry few still care", skills: [] },
    { min: 41, max: 60, label: "Only half remain", skills: [] },
    { min: 61, max: 80, label: "Most of my loved ones stand with me", skills: [] },
    { min: 81, max: 100, label: "I have more loved ones around me than I can count", skills: [] },
  ],
  freeTime: [
    { min: 1, max: 20, label: "Learning new things and bettering myself", skills: ["Logic", "Constitution"] },
    { min: 21, max: 40, label: "Creating beautiful things that will outlast me", skills: ["Might", "Wealth"] },
    { min: 41, max: 60, label: "Going to places I have never been before", skills: ["Burglary", "Drive"] },
    { min: 61, max: 80, label: "Talking, singing and dancing the night away", skills: ["Intimidate", "Athletics"] },
    { min: 81, max: 100, label: "Hunting and fishing", skills: ["Stealth", "Fight"] },
  ],
  important: [
    { min: 1, max: 10, label: "My family, my blood", skills: ["Diplomacy", "Fight"] },
    { min: 11, max: 20, label: "My friends, the family I chose", skills: ["Fine-Craft", "Intimidate"] },
    { min: 21, max: 30, label: "My people, my nation", skills: ["Athletics", "Might"] },
    { min: 31, max: 40, label: "My god(s), my faith", skills: ["Will", "Perception"] },
    { min: 41, max: 50, label: "Knowledge, and the study thereof", skills: ["Logic", "Intuition"] },
    { min: 51, max: 60, label: "Power and the will to use it", skills: ["Wealth", "Burglary"] },
    { min: 61, max: 70, label: "Technology and the future", skills: ["Drive", "Broad-Craft"] },
    { min: 71, max: 80, label: "Freedom and chaos, as nature intended", skills: ["Luck", "Stealth"] },
    { min: 81, max: 90, label: "Order, peace, tranquility", skills: ["Shoot", "Investigate"] },
    { min: 91, max: 100, label: "Myself, clearly", skills: ["Deceive", "Constitution"] },
  ],
};

const adulthoodCareers = [
  { min: 1, max: 10, career: "Academic", jobs: [
    { min: 1, max: 2, name: "Economy", skill: "Luck" },
    { min: 3, max: 4, name: "Medicine", skill: "Investigate" },
    { min: 5, max: 6, name: "Philosophy", skill: "Deceive" },
    { min: 7, max: 8, name: "Science", skill: "Logic" },
    { min: 9, max: 10, name: "Technology", skill: "Intuition" },
  ] },
  { min: 11, max: 20, career: "Artist", jobs: [
    { min: 1, max: 2, name: "Actor", skill: "Deceive" },
    { min: 3, max: 4, name: "Author", skill: "Intuition" },
    { min: 5, max: 6, name: "Dancer", skill: "Burglary" },
    { min: 7, max: 8, name: "Painter", skill: "Fine-Craft" },
    { min: 9, max: 10, name: "Singer", skill: "Diplomacy" },
  ] },
  { min: 21, max: 30, career: "Athlete", jobs: [
    { min: 1, max: 2, name: "Athletics", skill: "Athletics" },
    { min: 3, max: 4, name: "Ball Sports", skill: "Drive" },
    { min: 5, max: 6, name: "E-Sports", skill: "Stealth" },
    { min: 7, max: 8, name: "Racquet Sports", skill: "Constitution" },
    { min: 9, max: 10, name: "Swimming", skill: "Might" },
  ] },
  { min: 31, max: 40, career: "Bureaucrat", jobs: [
    { min: 1, max: 2, name: "Accountant", skill: "Wealth" },
    { min: 3, max: 4, name: "Administrator", skill: "Investigate" },
    { min: 5, max: 6, name: "Civil Servant", skill: "Perception" },
    { min: 7, max: 8, name: "Librarian", skill: "Diplomacy" },
    { min: 9, max: 10, name: "Office Worker", skill: "Logic" },
  ] },
  { min: 41, max: 50, career: "Cleric", jobs: [
    { min: 1, max: 2, name: "Friar / Beguine", skill: "Luck" },
    { min: 3, max: 4, name: "Lay Brother / Sister", skill: "Perception" },
    { min: 5, max: 6, name: "Missionary", skill: "Investigate" },
    { min: 7, max: 8, name: "Monk / Nun", skill: "Will" },
    { min: 9, max: 10, name: "Priest / Priestess", skill: "Intuition" },
  ] },
  { min: 51, max: 60, career: "Hobo", jobs: [
    { min: 1, max: 2, name: "Burglar", skill: "Burglary" },
    { min: 3, max: 4, name: "Fugitive", skill: "Athletics" },
    { min: 5, max: 6, name: "Mobster", skill: "Intimidate" },
    { min: 7, max: 8, name: "Thief", skill: "Stealth" },
    { min: 9, max: 10, name: "Vagrant", skill: "Broad-Craft" },
  ] },
  { min: 61, max: 70, career: "Policeman", jobs: [
    { min: 1, max: 2, name: "Emergency Response", skill: "Shoot" },
    { min: 3, max: 4, name: "Military Provost", skill: "Fight" },
    { min: 5, max: 6, name: "Private Investigator", skill: "Athletics" },
    { min: 7, max: 8, name: "Private Security", skill: "Constitution" },
    { min: 9, max: 10, name: "Street Cop", skill: "Might" },
  ] },
  { min: 71, max: 80, career: "Salesman", jobs: [
    { min: 1, max: 2, name: "Entertainment", skill: "Drive" },
    { min: 3, max: 4, name: "Fashion", skill: "Luck" },
    { min: 5, max: 6, name: "Hospitality", skill: "Diplomacy" },
    { min: 7, max: 8, name: "Luxury Goods", skill: "Wealth" },
    { min: 9, max: 10, name: "Retail", skill: "Deceive" },
  ] },
  { min: 81, max: 90, career: "Soldier", jobs: [
    { min: 1, max: 2, name: "Air Force", skill: "Drive" },
    { min: 3, max: 4, name: "Infantry", skill: "Might" },
    { min: 5, max: 6, name: "Marines", skill: "Fight" },
    { min: 7, max: 8, name: "Navy", skill: "Will" },
    { min: 9, max: 10, name: "Private Contractor", skill: "Shoot" },
  ] },
  { min: 91, max: 100, career: "Tradesman", jobs: [
    { min: 1, max: 2, name: "Builder", skill: "Broad-Craft" },
    { min: 3, max: 4, name: "Computing", skill: "Fine-Craft" },
    { min: 5, max: 6, name: "Engineer", skill: "Constitution" },
    { min: 7, max: 8, name: "Labourer", skill: "Intimidate" },
    { min: 9, max: 10, name: "Tailor", skill: "Perception" },
  ] },
];

const wizardSteps = ["Identity", "Childhood", "Teen Years", "Adulthood", "Finishing", "Review"];

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

function makeBaseSkills() {
  return Object.fromEntries(skillOrder.map((skill) => [skill, 30]));
}

function makeLocationState() {
  return Object.fromEntries(
    hitLocations.map((loc) => [loc.key, { armour: "None", destroyed: false, slots: Array(10).fill(false) }])
  );
}

function makeCombatModifierState() {
  return {
    rangedAttack: { inMelee: false, movingQuickly: false, offHanded: false, firingBlindly: false, aimed: false, areaOfEffect: false },
    rangedDefense: { inMelee: false, movingQuickly: false, areaOfEffect: false, dodge: false, surprised: false, inCover: false },
    meleeAttack: { charging: false, superiorPosition: false, offHanded: false, aimed: false, flankingAllies: 0 },
    meleeDefense: { parry: false, superiorPosition: false, offHanded: false, dodge: false, flankingEnemies: 0 },
  };
}

function makeWeapon(category = "ranged") {
  const baseClass = "Medium";
  return {
    name: "",
    category,
    weightClass: baseClass,
    rangeBand: category === "ranged" ? "Medium" : "Close",
    damage: weaponClassData[baseClass].damage,
    woundMod: weaponClassData[baseClass].woundMod,
    skill: category === "ranged" ? "Shoot" : "Fight",
    notes: "",
  };
}

function makeBlankCharacter() {
  return {
    meta: {
      characterName: "",
      archetype: "",
      era: "The Fall",
      portraitData: "",
      portraitName: "",
    },
    profile: {
      sex: "",
      age: "",
      build: "",
      handedness: "",
      skinColour: "",
      hairColour: "",
      eyeColour: "",
      hometown: "",
    },
    background: {
      concept: "",
      childhood: "",
      teenYears: "",
      adulthood: "",
      lovedOnes: "",
      freeTime: "",
      priorities: "",
    },
    skills: makeBaseSkills(),
    resources: { currentSigils: 0 },
    specialisations: [{ parent: "", name: "", level: "" }],
    combat: {
      hitLocations: makeLocationState(),
      grievousWounds: [{ location: "head", description: "", healTime: "" }],
      weapons: [makeWeapon("ranged"), makeWeapon("melee")],
      modifiers: makeCombatModifierState(),
      defenseSkills: { ranged: "Athletics", melee: "Fight" },
      combatNotes: "",
    },
    mental: {
      destroyed: false,
      minor: Array(10).fill(false),
      significant: Array(10).fill(false),
      grievous: Array(10).fill(false),
      grievousEntries: [{ subject: "", condition: "", successes: "" }],
    },
    survival: {
      hungerFails: 0,
      thirstFails: 0,
      sleepFails: 0,
      exhaustionPenalty: 0,
      temperature: "None",
      infectionStatus: "Uninfected",
      notes: "",
      perishables: [{ type: "Meat", units: 0, daysLeft: 2 }],
    },
    inventory: {
      wealthPenalty: 0,
      gear: [{ name: "", qty: 1, notes: "" }],
      ammo: [{ type: "", qty: "", notes: "" }],
      stashNotes: "",
    },
    notes: {
      appearance: "",
      allies: "",
      sessionNotes: "",
      goals: "",
    },
  };
}

function makeBlankWizard() {
  const adulthood = buildManualAdulthoodTerms(24);
  return {
    name: "",
    concept: "",
    age: 24,
    ageInput: "24",
    identity: {
      sex: null,
      build: null,
      handedness: null,
      skin: null,
      hair: null,
      eye: null,
      skinRoll: null,
    },
    childhood: {
      parents: null,
      parentWhat: null,
      familySize: null,
      god: null,
      caregivers: null,
      grewUp: null,
      influence: null,
      feeling: null,
    },
    teen: {
      subject: null,
      bestFriend: null,
      crush: null,
      turningPoint: null,
      loseAnyone: null,
      loseAnyoneWhat: null,
      feeling: null,
    },
    adulthood,
    finishing: {
      soulmate: null,
      children: null,
      loseSomeone: null,
      lovedOnes: null,
      freeTime: null,
      important: null,
    },
  };
}

function clampSkill(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return 0;
  return Math.max(0, Math.min(100, num));
}

function clampNonNegative(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return 0;
  return Math.max(0, num);
}

function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function pickByRoll(options, roll) {
  return options.find((item) => roll >= item.min && roll <= item.max) ?? null;
}

function applySkillGain(skills, skill, amount) {
  const next = { ...skills };
  next[skill] = clampSkill((next[skill] ?? 0) + amount);
  return next;
}

function reduceSkills(skills, names, amount) {
  const next = { ...skills };
  names.forEach((name) => {
    next[name] = Math.max(0, (next[name] ?? 0) - amount);
  });
  return next;
}

function slotCountFromSkill(value) {
  const parsed = Number(value) || 0;
  if (parsed >= 100) return 10;
  return Math.max(0, Math.floor(parsed / 10));
}

function slotLabel(index) {
  return ["Minor", "Significant", "Grievous"][index % 3];
}

function arrayUpdate(list, index, patch) {
  return list.map((item, i) => (i === index ? { ...item, ...patch } : item));
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

function resolveCareerByName(name) {
  return adulthoodCareers.find((career) => career.career === name) ?? null;
}

function resolveJobByName(careerName, jobName) {
  const career = resolveCareerByName(careerName);
  return career?.jobs.find((job) => job.name === jobName) ?? null;
}

function buildManualAdulthoodTerms(ageTarget, existingTerms = []) {
  const safeAge = Math.max(18, Math.min(90, Number(ageTarget) || 18));
  const termCount = safeAge <= 18 ? 0 : Math.ceil((safeAge - 18) / 3);
  const terms = [];
  let startAge = 18;
  for (let index = 0; index < termCount; index += 1) {
    const existing = existingTerms[index] ?? {};
    const endAge = Math.min(safeAge, startAge + 3);
    const resolvedJob = resolveJobByName(existing.career, existing.job);
    terms.push({
      index: index + 1,
      startAge,
      endAge,
      career: existing.career ?? "",
      job: existing.job ?? "",
      skill: resolvedJob?.skill ?? existing.skill ?? "",
      gain: existing.gain ?? "",
      ageCheckRoll: endAge >= 40 ? (existing.ageCheckRoll ?? "") : "",
    });
    startAge += 3;
  }
  return {
    ageTarget: safeAge,
    terms,
    summary: termCount ? `${termCount} term${termCount === 1 ? "" : "s"} from age 18 to ${safeAge}.` : "No adulthood terms needed.",
  };
}

function calculateWizardSkills(wizard) {
  let skills = makeBaseSkills();
  const applied = [];
  const selections = [
    wizard.childhood.parents,
    wizard.childhood.parentWhat,
    wizard.childhood.god,
    wizard.childhood.caregivers,
    wizard.childhood.grewUp,
    wizard.childhood.influence,
    wizard.childhood.feeling,
    wizard.teen.subject,
    wizard.teen.bestFriend,
    wizard.teen.crush,
    wizard.teen.turningPoint,
    wizard.teen.loseAnyone,
    wizard.teen.loseAnyoneWhat,
    wizard.teen.feeling,
    wizard.finishing.loseSomeone,
    wizard.finishing.freeTime,
    wizard.finishing.important,
  ].filter(Boolean);

  selections.forEach((selection) => {
    (selection.skills ?? []).forEach((skill) => {
      const gain = rollDie(5);
      skills = applySkillGain(skills, skill, gain);
      applied.push({ source: selection.label, skill, gain });
    });
  });

  wizard.adulthood.terms.forEach((term) => {
    const job = resolveJobByName(term.career, term.job);
    const gain = Number(term.gain) || 0;
    if (job && gain > 0) {
      skills = applySkillGain(skills, job.skill, gain);
      applied.push({ source: `${term.career}: ${term.job}`, skill: job.skill, gain });
    }
    if (term.endAge >= 40) {
      const ageRoll = Number(term.ageCheckRoll) || 0;
      if (ageRoll > (skills.Constitution || 30)) {
        skills = reduceSkills(skills, skillOrder.filter((name) => physicalSkills.has(name)), 1);
        applied.push({ source: `Age ${term.endAge} check`, skill: "Physical skills", gain: -1 });
      }
      if (ageRoll === 100) {
        skills = reduceSkills(skills, skillOrder, 2);
        applied.push({ source: `Age ${term.endAge} roll 100`, skill: "All skills", gain: -2 });
      }
      if (term.endAge >= 60) {
        skills = reduceSkills(skills, skillOrder, 1);
        applied.push({ source: `Age ${term.endAge}+`, skill: "All skills", gain: -1 });
      }
    }
  });

  return { skills, applied };
}

function buildBackgroundText(wizard) {
  const childhood = [
    wizard.childhood.parents?.label,
    wizard.childhood.parentWhat?.label,
    wizard.childhood.familySize?.label ? `Family size: ${wizard.childhood.familySize.label}` : "",
    wizard.childhood.god?.label,
    wizard.childhood.caregivers?.label,
    wizard.childhood.grewUp?.label,
    wizard.childhood.influence?.label,
    wizard.childhood.feeling?.label ? `Childhood felt: ${wizard.childhood.feeling.label}` : "",
  ].filter(Boolean).join("\n");

  const teenYears = [
    wizard.teen.subject?.label ? `Favourite subject: ${wizard.teen.subject.label}` : "",
    wizard.teen.bestFriend?.label ? `Best friend: ${wizard.teen.bestFriend.label}` : "",
    wizard.teen.crush?.label ? `First crush: ${wizard.teen.crush.label}` : "",
    wizard.teen.turningPoint?.label ? `Turning point: ${wizard.teen.turningPoint.label}` : "",
    wizard.teen.loseAnyone?.label ? `Teen loss: ${wizard.teen.loseAnyone.label}` : "",
    wizard.teen.loseAnyoneWhat?.label ? `What happened: ${wizard.teen.loseAnyoneWhat.label}` : "",
    wizard.teen.feeling?.label ? `Teen years felt: ${wizard.teen.feeling.label}` : "",
  ].filter(Boolean).join("\n");

  const adulthood = wizard.adulthood.terms.length
    ? wizard.adulthood.terms.map((term) => {
        const job = resolveJobByName(term.career, term.job);
        const label = term.career && term.job ? `${term.career} / ${term.job}` : "Unassigned term";
        const skill = job?.skill ?? term.skill ?? "No skill";
        const gain = term.gain || 0;
        return `Age ${term.startAge}-${term.endAge}: ${label} (+${gain} ${skill})`;
      }).join("\n")
    : "";

  const lovedOnes = [
    wizard.finishing.soulmate?.label ? `Soulmate: ${wizard.finishing.soulmate.label}` : "",
    wizard.finishing.children?.label ? `Children: ${wizard.finishing.children.label}` : "",
    wizard.finishing.loseSomeone?.label ? `Later loss: ${wizard.finishing.loseSomeone.label}` : "",
    wizard.finishing.lovedOnes?.label ? `Who remains: ${wizard.finishing.lovedOnes.label}` : "",
  ].filter(Boolean).join("\n");

  return {
    childhood,
    teenYears,
    adulthood,
    lovedOnes,
    freeTime: wizard.finishing.freeTime?.label ?? "",
    priorities: wizard.finishing.important?.label ?? "",
  };
}

function buildCharacterFromWizard(wizard) {
  const character = makeBlankCharacter();
  const { skills } = calculateWizardSkills(wizard);
  const background = buildBackgroundText(wizard);
  character.meta.characterName = wizard.name || "Unnamed Survivor";
  character.meta.era = "The Fall";
  character.background.concept = wizard.concept;
  character.profile.age = String(wizard.age);
  character.profile.sex = wizard.identity.sex?.label ?? "";
  character.profile.build = wizard.identity.build?.label ?? "";
  character.profile.handedness = wizard.identity.handedness?.label ?? "";
  character.profile.skinColour = wizard.identity.skin?.label ?? "";
  character.profile.hairColour = wizard.identity.hair?.label ?? "";
  character.profile.eyeColour = wizard.identity.eye?.label ?? "";
  character.background.childhood = background.childhood;
  character.background.teenYears = background.teenYears;
  character.background.adulthood = background.adulthood;
  character.background.lovedOnes = background.lovedOnes;
  character.background.freeTime = background.freeTime;
  character.background.priorities = background.priorities;
  character.skills = skills;
  character.resources.currentSigils = slotCountFromSkill(skills.Luck);
  character.notes.goals = wizard.concept ? `Core concept: ${wizard.concept}` : "";
  return character;
}

function normalizeBoolArray(values, length = 10) {
  return Array.from({ length }, (_, index) => Boolean(values?.[index]));
}

function normalizeCharacter(data) {
  const blank = makeBlankCharacter();
  const source = data ?? {};
  const legacyWeapons = [];
  (source.combat?.rangedWeapons ?? []).forEach((item) => {
    legacyWeapons.push({ ...makeWeapon("ranged"), name: item.name ?? "", rangeBand: item.range || "Medium", damage: item.damage || weaponClassData.Medium.damage, skill: "Shoot", notes: "" });
  });
  (source.combat?.meleeWeapons ?? []).forEach((item) => {
    legacyWeapons.push({ ...makeWeapon("melee"), name: item.name ?? "", damage: item.damage || weaponClassData.Medium.damage, skill: "Fight", notes: item.mod ? `Legacy mod: ${item.mod}` : "" });
  });
  const weapons = Array.isArray(source.combat?.weapons) && source.combat.weapons.length ? source.combat.weapons : legacyWeapons.length ? legacyWeapons : blank.combat.weapons;
  const currentSigils = source.resources?.currentSigils ?? source.profile?.sigils ?? slotCountFromSkill(source.skills?.Luck ?? blank.skills.Luck);
  return {
    ...blank,
    ...source,
    meta: { ...blank.meta, ...(source.meta ?? {}) },
    profile: { ...blank.profile, ...(source.profile ?? {}) },
    background: { ...blank.background, ...(source.background ?? {}) },
    skills: { ...blank.skills, ...(source.skills ?? {}) },
    resources: { ...blank.resources, ...(source.resources ?? {}), currentSigils: clampNonNegative(currentSigils) },
    specialisations: Array.isArray(source.specialisations) && source.specialisations.length ? source.specialisations : blank.specialisations,
    combat: {
      ...blank.combat,
      ...(source.combat ?? {}),
      hitLocations: hitLocations.reduce((acc, loc) => {
        acc[loc.key] = {
          ...blank.combat.hitLocations[loc.key],
          ...(source.combat?.hitLocations?.[loc.key] ?? {}),
          slots: Array.from({ length: 10 }, (_, index) => Boolean(source.combat?.hitLocations?.[loc.key]?.slots?.[index])),
        };
        return acc;
      }, {}),
      grievousWounds: Array.isArray(source.combat?.grievousWounds) && source.combat.grievousWounds.length ? source.combat.grievousWounds : blank.combat.grievousWounds,
      weapons: weapons.map((weapon) => ({ ...makeWeapon(weapon.category === "melee" ? "melee" : "ranged"), ...weapon })),
      modifiers: {
        ...makeCombatModifierState(),
        ...(source.combat?.modifiers ?? {}),
        rangedAttack: { ...makeCombatModifierState().rangedAttack, ...(source.combat?.modifiers?.rangedAttack ?? {}) },
        rangedDefense: { ...makeCombatModifierState().rangedDefense, ...(source.combat?.modifiers?.rangedDefense ?? {}) },
        meleeAttack: { ...makeCombatModifierState().meleeAttack, ...(source.combat?.modifiers?.meleeAttack ?? {}) },
        meleeDefense: { ...makeCombatModifierState().meleeDefense, ...(source.combat?.modifiers?.meleeDefense ?? {}) },
      },
      defenseSkills: { ...blank.combat.defenseSkills, ...(source.combat?.defenseSkills ?? {}) },
    },
    mental: {
      ...blank.mental,
      ...(source.mental ?? {}),
      minor: normalizeBoolArray(source.mental?.minor),
      significant: normalizeBoolArray(source.mental?.significant),
      grievous: normalizeBoolArray(source.mental?.grievous),
      grievousEntries: Array.isArray(source.mental?.grievousEntries) && source.mental.grievousEntries.length ? source.mental.grievousEntries : blank.mental.grievousEntries,
    },
    survival: {
      ...blank.survival,
      ...(source.survival ?? {}),
      perishables: Array.isArray(source.survival?.perishables) && source.survival.perishables.length ? source.survival.perishables : blank.survival.perishables,
    },
    inventory: {
      ...blank.inventory,
      ...(source.inventory ?? {}),
      gear: Array.isArray(source.inventory?.gear) && source.inventory.gear.length ? source.inventory.gear : blank.inventory.gear,
      ammo: Array.isArray(source.inventory?.ammo) && source.inventory.ammo.length ? source.inventory.ammo : blank.inventory.ammo,
    },
    notes: { ...blank.notes, ...(source.notes ?? {}) },
  };
}

function getSuccessDegree(roll) {
  return successDegrees.find((entry) => roll <= entry.max)?.label ?? "Scarce";
}

function getFailureDegree(delta) {
  const amount = Math.max(1, delta);
  return failureDegrees.find((entry) => amount <= entry.max)?.label ?? "Subhuman";
}

function DiceWidget() {
  const [lastRoll, setLastRoll] = useState({ label: "d100", value: "-" });
  const [history, setHistory] = useState([]);
  const roll = (sides, label) => {
    const value = Math.floor(Math.random() * sides) + 1;
    const result = { label, value };
    setLastRoll(result);
    setHistory((prev) => [result, ...prev].slice(0, 5));
  };
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-4 shadow-2xl">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-200"><Dices className="h-4 w-4 text-emerald-400" /> Dice Roller</div>
      <div className="mb-4 grid grid-cols-3 gap-2">
        <button className="min-h-[44px] rounded-2xl bg-zinc-800 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-700" onClick={() => roll(100, "d100")}>d100</button>
        <button className="min-h-[44px] rounded-2xl bg-zinc-800 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-700" onClick={() => roll(10, "d10")}>d10</button>
        <button className="min-h-[44px] rounded-2xl bg-zinc-800 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-700" onClick={() => roll(5, "d5")}>d5</button>
      </div>
      <div className="mb-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 p-4 text-center text-black shadow-lg">
        <div className="text-xs font-semibold uppercase tracking-[0.2em]">{lastRoll.label}</div>
        <div className="text-3xl font-black">{lastRoll.value}</div>
      </div>
      <div className="space-y-1 text-xs text-zinc-400">
        {history.length === 0 ? <div>No rolls yet.</div> : history.map((item, idx) => (
          <div key={`${item.label}-${item.value}-${idx}`} className="flex items-center justify-between rounded-xl bg-zinc-900 px-3 py-2">
            <span>{item.label}</span>
            <span className="font-semibold text-zinc-200">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Section({ title, description, children, right }) {
  return (
    <div className="rounded-[24px] border border-zinc-800 bg-zinc-900/80 p-4 shadow-xl sm:rounded-[28px] sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          {description ? <p className="mt-1 text-sm leading-6 text-zinc-400">{description}</p> : null}
        </div>
        {right ? <div className="w-full sm:w-auto">{right}</div> : null}
      </div>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, placeholder = "", type = "text", min, max, disabled = false, inputMode, pattern, step }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{label}</span>
      <input
        type={type}
        min={min}
        max={max}
        step={step}
        inputMode={inputMode}
        pattern={pattern}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="min-h-[48px] w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3.5 text-base text-white outline-none transition focus:border-emerald-500 disabled:opacity-50 sm:text-sm"
      />
    </label>
  );
}

function TextArea({ label, value, onChange, placeholder = "", rows = 4 }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{label}</span>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3.5 text-base text-white outline-none transition focus:border-emerald-500 sm:text-sm"
      />
    </label>
  );
}

function NumberStepper({ value, onChange, min = 0, max = 100 }) {
  return (
    <div className="flex items-center gap-2">
      <button className="h-11 w-11 rounded-xl bg-zinc-800 text-base text-white hover:bg-zinc-700" onClick={() => onChange(Math.max(min, Number(value || 0) - 1))}>−</button>
      <input type="number" min={min} max={max} value={value} onChange={(e) => onChange(clampNonNegative(e.target.value))} className="h-11 w-20 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-center text-base text-white outline-none focus:border-emerald-500 sm:text-sm" />
      <button className="h-11 w-11 rounded-xl bg-zinc-800 text-base text-white hover:bg-zinc-700" onClick={() => onChange(Math.min(max, Number(value || 0) + 1))}>+</button>
    </div>
  );
}

function WizardQuestion({ title, options, value, onChange, description }) {
  const handleRoll = () => onChange(pickByRoll(options, rollDie(100)));
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-white">{title}</div>
          {description ? <div className="mt-1 text-xs text-zinc-500">{description}</div> : null}
        </div>
        <button className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-black hover:bg-emerald-400" onClick={handleRoll}><Dices className="h-3.5 w-3.5" /> Roll</button>
      </div>
      <select value={value?.label ?? ""} onChange={(e) => onChange(options.find((opt) => opt.label === e.target.value) ?? null)} className="min-h-[48px] w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-base text-white outline-none focus:border-emerald-500 sm:text-sm">
        <option value="">Pick or roll...</option>
        {options.map((option) => <option key={option.label} value={option.label}>{option.label}</option>)}
      </select>
      {value ? (
        <div className="mt-3 rounded-2xl bg-zinc-900 p-3 text-sm text-zinc-300">
          <div className="font-medium text-white">{value.label}</div>
          {(value.skills ?? []).length > 0 ? <div className="mt-1 text-zinc-400">Skills gained: {value.skills.join(", ")} +1d5 each</div> : <div className="mt-1 text-zinc-500">No direct skill gain on this result.</div>}
        </div>
      ) : null}
    </div>
  );
}

function IdentityQuestion({ title, value, options, onPick, onRoll, note }) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-white">{title}</div>
          {note ? <div className="mt-1 text-xs text-zinc-500">{note}</div> : null}
        </div>
        {onRoll ? <button className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-black hover:bg-emerald-400" onClick={onRoll}><Dices className="h-3.5 w-3.5" /> Roll</button> : null}
      </div>
      <select value={value?.label ?? ""} onChange={(e) => onPick(options.find((opt) => opt.label === e.target.value) ?? null)} className="min-h-[48px] w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-base text-white outline-none focus:border-emerald-500 sm:text-sm">
        <option value="">Pick or roll...</option>
        {options.map((option) => <option key={option.label} value={option.label}>{option.label}</option>)}
      </select>
    </div>
  );
}

function RollResultCard({ result, onReroll, rerollEnabled, label = "Last roll" }) {
  if (!result) return <div className="rounded-3xl bg-zinc-950 p-4 text-sm text-zinc-500">No rolls made yet.</div>;
  return (
    <div className="rounded-3xl bg-zinc-950 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">{label}</div>
          <div className="mt-1 text-lg font-bold text-white">{result.label}</div>
          <div className="mt-1 text-sm text-zinc-400">Base {result.baseSkill} • Final target {result.target} • Total modifier {result.totalModifier >= 0 ? `+${result.totalModifier}` : result.totalModifier}</div>
        </div>
        <div className={`rounded-2xl px-4 py-3 text-center ${result.success ? "bg-emerald-500/20 text-emerald-200" : "bg-red-500/20 text-red-200"}`}>
          <div className="text-xs uppercase tracking-[0.18em]">Roll</div>
          <div className="text-2xl font-black">{result.roll}</div>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl bg-zinc-900 p-3 text-sm text-zinc-300">
          <div className="font-semibold text-white">Outcome</div>
          <div className="mt-1">{result.success ? "Success" : "Failure"} • {result.degree}</div>
          {result.criticalSuccess ? <div className="mt-1 text-emerald-300">Critical success</div> : null}
          {result.criticalFailure ? <div className="mt-1 text-red-300">Critical failure</div> : null}
        </div>
        <div className="rounded-2xl bg-zinc-900 p-3 text-sm text-zinc-300">
          <div className="font-semibold text-white">Applied extras</div>
          <div className="mt-1">Manual modifier: {result.manualModifier >= 0 ? `+${result.manualModifier}` : result.manualModifier}</div>
          <div className="mt-1">Auto penalties included: yes</div>
          <div className="mt-1">Sigil bonus: {result.usedSigilBonus ? "+25" : "none"}</div>
        </div>
      </div>
      {rerollEnabled ? <div className="mt-3"><button className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-black hover:bg-amber-400" onClick={onReroll}><RefreshCcw className="h-4 w-4" /> Spend Sigil to Reroll</button></div> : null}
    </div>
  );
}

function RollPopup({ open, title, result, onClose, onReroll, rerollEnabled }) {
  if (!open || !result) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-xl rounded-[28px] border border-zinc-800 bg-zinc-900 p-4 shadow-2xl sm:p-5" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Roll Result</div>
            <div className="text-lg font-bold text-white">{title}</div>
          </div>
          <button className="inline-flex min-h-[44px] items-center rounded-2xl bg-zinc-800 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700" onClick={onClose}>Close</button>
        </div>
        <RollResultCard result={result} onReroll={onReroll} rerollEnabled={rerollEnabled} label={title} />
      </div>
    </div>
  );
}

function BodyDiagram({ selected, onSelect, states }) {
  const areaClass = (key) => {
    const hasWound = states[key].slots.some(Boolean) || states[key].destroyed;
    if (selected === key) return "fill-emerald-500/35 stroke-emerald-300";
    if (hasWound) return "fill-red-500/28 stroke-red-300";
    return "fill-zinc-800/10 stroke-zinc-500/0 hover:fill-zinc-700/20";
  };

  const labelClass = (key) => {
    const hasWound = states[key].slots.some(Boolean) || states[key].destroyed;
    if (selected === key) return "text-emerald-300";
    if (hasWound) return "text-red-300";
    return "text-zinc-500";
  };

  return (
    <div className="rounded-3xl bg-zinc-950 p-4">
      <svg viewBox="0 0 240 420" className="mx-auto h-[420px] w-full max-w-[260px] sm:h-[470px]" role="img" aria-label="Body hit location diagram">
        <g>
          <path
            d="M120 14c-10 0-17 8-17 19 0 8 3 13 6 16v12c-7 5-12 12-12 22v21l-7 31-12 36-7 38c-2 10 3 17 11 17 6 0 10-4 12-10l8-30 2 29-4 74-2 78c0 8 6 14 13 14s12-6 13-14l9-81 9 81c1 8 6 14 13 14s13-6 13-14l-2-78-4-74 2-29 8 30c2 6 6 10 12 10 8 0 13-7 11-17l-7-38-12-36-7-31V83c0-10-5-17-12-22V49c3-3 6-8 6-16 0-11-7-19-17-19Zm0 8c5 0 9 5 9 11 0 7-3 10-7 12h-4c-4-2-7-5-7-12 0-6 4-11 9-11Z"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path d="M108 59h24" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" />
          <path d="M102 111h36" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
          <path d="M101 150h38" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" opacity="0.45" />
          <path d="M94 238h18" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
          <path d="M128 238h18" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
        </g>

        <g strokeWidth="1.5">
          <circle cx="120" cy="33" r="19" className={areaClass("head")} onClick={() => onSelect("head")} />
          <rect x="97" y="63" width="46" height="112" rx="20" className={areaClass("torso")} onClick={() => onSelect("torso")} />
          <rect x="69" y="88" width="24" height="136" rx="12" className={areaClass("leftArm")} onClick={() => onSelect("leftArm")} />
          <rect x="147" y="88" width="24" height="136" rx="12" className={areaClass("rightArm")} onClick={() => onSelect("rightArm")} />
          <rect x="98" y="177" width="18" height="182" rx="9" className={areaClass("leftLeg")} onClick={() => onSelect("leftLeg")} />
          <rect x="124" y="177" width="18" height="182" rx="9" className={areaClass("rightLeg")} onClick={() => onSelect("rightLeg")} />
        </g>
      </svg>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {hitLocations.map((loc) => (
          <button key={loc.key} onClick={() => onSelect(loc.key)} className={`min-h-[44px] rounded-2xl border px-3 py-2 text-left text-sm ${selected === loc.key ? "border-emerald-400 bg-emerald-500/20 text-emerald-100" : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600"}`}>
            <div className="font-semibold">{loc.label}</div>
            <div className={`text-xs ${labelClass(loc.key)}`}>{loc.range}</div>
          </button>
        ))}
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
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-semibold transition ${active ? "bg-emerald-500 text-black" : "bg-zinc-900 text-zinc-300"}`}>
              <Icon className="h-4 w-4" />
              <span className="leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ZLandInteractiveCharacterSheet() {
  const fileInputRef = useRef(null);
  const portraitInputRef = useRef(null);
  const [appMode, setAppMode] = useState("home");
  const [wizardStep, setWizardStep] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [activeHealthLocation, setActiveHealthLocation] = useState("torso");
  const [saveState, setSaveState] = useState("Ready");
  const [skillRollModifier, setSkillRollModifier] = useState(0);
  const [queuedSigilBonus, setQueuedSigilBonus] = useState(false);
  const [skillRollResult, setSkillRollResult] = useState(null);
  const [combatRollResult, setCombatRollResult] = useState(null);
  const [rollModal, setRollModal] = useState(null);
  const [wizard, setWizard] = useState(makeBlankWizard());
  const [hasSavedCharacter, setHasSavedCharacter] = useState(() => {
    if (typeof window === "undefined") return false;
    try { return !!window.localStorage.getItem(STORAGE_KEY); } catch { return false; }
  });
  const [character, setCharacter] = useState(() => {
    if (typeof window === "undefined") return makeBlankCharacter();
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored ? normalizeCharacter(JSON.parse(stored)) : normalizeCharacter(makeBlankCharacter());
    } catch {
      return normalizeCharacter(makeBlankCharacter());
    }
  });

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = APP_TITLE;
    }
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
  const mightCarryDays = slotCountFromSkill(character.skills.Might);
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
      if (skill === "Wealth") mod += -clampNonNegative(character.inventory.wealthPenalty);
      return [skill, Math.max(0, (Number(character.skills[skill]) || 0) + mod)];
    }));
    return { hungerPhysical, hungerMental, thirstPhysical, thirstMental, sleepAll, exhaustionPhysical, tempAll, mentalPenalty, effectiveSkills };
  }, [character, willSlots]);

  const wizardResult = useMemo(() => calculateWizardSkills(wizard), [wizard]);
  const backgroundPreview = useMemo(() => buildBackgroundText(wizard), [wizard]);

  const setMeta = (patch) => setCharacter((prev) => ({ ...prev, meta: { ...prev.meta, ...patch } }));
  const setProfile = (patch) => setCharacter((prev) => ({ ...prev, profile: { ...prev.profile, ...patch } }));
  const setBackground = (patch) => setCharacter((prev) => ({ ...prev, background: { ...prev.background, ...patch } }));
  const setNotes = (patch) => setCharacter((prev) => ({ ...prev, notes: { ...prev.notes, ...patch } }));
  const setSurvival = (patch) => setCharacter((prev) => ({ ...prev, survival: { ...prev.survival, ...patch } }));
  const setInventory = (patch) => setCharacter((prev) => ({ ...prev, inventory: { ...prev.inventory, ...patch } }));
  const setCombat = (patch) => setCharacter((prev) => ({ ...prev, combat: { ...prev.combat, ...patch } }));
  const setMental = (patch) => setCharacter((prev) => ({ ...prev, mental: { ...prev.mental, ...patch } }));
  const setResources = (patch) => setCharacter((prev) => ({ ...prev, resources: { ...prev.resources, ...patch } }));

  const updateSkill = (skill, value) => setCharacter((prev) => ({ ...prev, skills: { ...prev.skills, [skill]: clampSkill(value) } }));

  const applyArchetype = (name) => {
    const preset = archetypes[name];
    if (!preset) return;
    setCharacter((prev) => ({ ...prev, meta: { ...prev.meta, archetype: name }, skills: { ...preset } }));
  };

  const adjustSigils = (delta) => setResources({ currentSigils: Math.max(0, currentSigils + delta) });
  const resetSigilsToThreshold = () => setResources({ currentSigils: sigilThreshold });

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
    setCharacter(normalizeCharacter(makeBlankCharacter()));
    setActiveTab("overview");
    setAppMode("sheet");
    setSkillRollResult(null);
    setCombatRollResult(null);
    setRollModal(null);
    setQueuedSigilBonus(false);
  };

  const startWizard = () => { setWizard(makeBlankWizard()); setWizardStep(0); setAppMode("wizard"); };

  const openSavedCharacter = () => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) { window.alert("No autosaved character was found on this device yet."); return; }
      setCharacter(normalizeCharacter(JSON.parse(stored)));
      setActiveTab("overview");
      setAppMode("sheet");
      setSaveState("Opened saved character");
    } catch {
      window.alert("The saved character on this device could not be opened.");
    }
  };

  const handleExport = () => {
    const safeName = (character.meta.characterName || "zland-character").replace(/\s+/g, "-").toLowerCase();
    exportJson(`${safeName}.json`, character);
  };

  const handleImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = normalizeCharacter(JSON.parse(String(reader.result)));
        setCharacter(parsed);
        setActiveTab("overview");
        setAppMode("sheet");
        setHasSavedCharacter(true);
        setSaveState(`Imported ${file.name}`);
      } catch {
        window.alert("That file could not be imported as a Z-LAND character JSON file.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
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

  const removePortrait = () => setMeta({ portraitData: "", portraitName: "" });

  const updateLocation = (locKey, patch) => {
    setCharacter((prev) => ({
      ...prev,
      combat: {
        ...prev.combat,
        hitLocations: {
          ...prev.combat.hitLocations,
          [locKey]: { ...prev.combat.hitLocations[locKey], ...patch },
        },
      },
    }));
  };

  const togglePhysicalSlot = (locKey, idx) => {
    setCharacter((prev) => {
      const next = [...prev.combat.hitLocations[locKey].slots];
      next[idx] = !next[idx];
      return {
        ...prev,
        combat: {
          ...prev.combat,
          hitLocations: {
            ...prev.combat.hitLocations,
            [locKey]: { ...prev.combat.hitLocations[locKey], slots: next },
          },
        },
      };
    });
  };

  const toggleMentalSlot = (bucket, idx) => {
    setCharacter((prev) => {
      const next = [...prev.mental[bucket]];
      next[idx] = !next[idx];
      return { ...prev, mental: { ...prev.mental, [bucket]: next } };
    });
  };

  const getCombatModifierTotal = (section) => {
    const modifiers = character.combat.modifiers;
    if (section === "rangedAttack") return (modifiers.rangedAttack.inMelee ? -40 : 0) + (modifiers.rangedAttack.movingQuickly ? -20 : 0) + (modifiers.rangedAttack.offHanded ? -20 : 0) + (modifiers.rangedAttack.firingBlindly ? -40 : 0) + (modifiers.rangedAttack.areaOfEffect ? 15 : 0) + (modifiers.rangedAttack.aimed ? Math.floor((computed.effectiveSkills.Shoot ?? 0) / 2) : 0);
    if (section === "rangedDefense") return (modifiers.rangedDefense.inMelee ? -10 : 0) + (modifiers.rangedDefense.movingQuickly ? 20 : 0) + (modifiers.rangedDefense.areaOfEffect ? -15 : 0) + (modifiers.rangedDefense.dodge ? 10 : 0) + (modifiers.rangedDefense.surprised ? -40 : 0) + (modifiers.rangedDefense.inCover ? 20 : 0);
    if (section === "meleeAttack") return (modifiers.meleeAttack.charging ? 20 : 0) + (modifiers.meleeAttack.superiorPosition ? 40 : 0) + (modifiers.meleeAttack.offHanded ? -20 : 0) + (modifiers.meleeAttack.aimed ? -10 : 0) + (clampNonNegative(modifiers.meleeAttack.flankingAllies) * 5);
    if (section === "meleeDefense") return (modifiers.meleeDefense.parry ? -20 : 0) + (modifiers.meleeDefense.superiorPosition ? 40 : 0) + (modifiers.meleeDefense.offHanded ? -20 : 0) + (modifiers.meleeDefense.dodge ? 10 : 0) - (clampNonNegative(modifiers.meleeDefense.flankingEnemies) * 5);
    return 0;
  };

  const createRollResult = ({ label, skillName, baseSkill, extraModifier = 0, manualModifier = 0, useQueuedSigil = false }) => {
    const usedSigilBonus = useQueuedSigil && currentSigils > 0;
    if (usedSigilBonus) adjustSigils(-1);
    const sigilBonus = usedSigilBonus ? 25 : 0;
    const totalModifier = extraModifier + manualModifier + sigilBonus;
    const target = Math.max(0, Math.min(100, (Number(baseSkill) || 0) + totalModifier));
    const roll = rollDie(100);
    const criticalFailure = roll === 100;
    const success = roll <= target && !criticalFailure;
    const criticalSuccess = success && roll === target;
    const degree = success ? getSuccessDegree(roll) : getFailureDegree(roll - target);
    setQueuedSigilBonus(false);
    return { label, skillName, baseSkill: Number(baseSkill) || 0, target, roll, success, criticalSuccess, criticalFailure, degree, totalModifier, manualModifier, extraModifier, usedSigilBonus, timestamp: Date.now() };
  };

  const rollSkillCheck = (skillName) => {
    const result = createRollResult({
      label: skillName,
      skillName,
      baseSkill: computed.effectiveSkills[skillName] ?? 0,
      manualModifier: Number(skillRollModifier) || 0,
      useQueuedSigil: queuedSigilBonus,
    });
    setSkillRollResult(result);
    setRollModal({ kind: "skill", title: `${skillName} Roll`, result });
  };

  const rerollSkillCheck = () => {
    if (!skillRollResult || skillRollResult.success || currentSigils <= 0) return;
    adjustSigils(-1);
    const result = createRollResult({
      label: `${skillRollResult.label} (Reroll)`,
      skillName: skillRollResult.skillName,
      baseSkill: skillRollResult.baseSkill,
      extraModifier: skillRollResult.extraModifier,
      manualModifier: skillRollResult.manualModifier,
      useQueuedSigil: false,
    });
    const rerolled = { ...result, usedSigilBonus: false };
    setSkillRollResult(rerolled);
    setRollModal({ kind: "skill", title: `${skillRollResult.skillName} Roll`, result: rerolled });
  };

  const rollWeaponAttack = (weapon) => {
    const section = weapon.category === "ranged" ? "rangedAttack" : "meleeAttack";
    const result = createRollResult({
      label: `${weapon.name || "Unnamed weapon"} attack`,
      skillName: weapon.skill,
      baseSkill: computed.effectiveSkills[weapon.skill] ?? 0,
      extraModifier: getCombatModifierTotal(section),
      useQueuedSigil: queuedSigilBonus,
    });
    const combatResult = { ...result, weapon };
    setCombatRollResult(combatResult);
    setRollModal({ kind: "combat", title: `${weapon.name || "Weapon"} Attack`, result: combatResult });
  };

  const rollCombatDefense = (mode) => {
    const skillName = character.combat.defenseSkills[mode];
    const section = mode === "ranged" ? "rangedDefense" : "meleeDefense";
    const result = createRollResult({
      label: `${mode === "ranged" ? "Ranged" : "Melee"} defense`,
      skillName,
      baseSkill: computed.effectiveSkills[skillName] ?? 0,
      extraModifier: getCombatModifierTotal(section),
      useQueuedSigil: queuedSigilBonus,
    });
    setCombatRollResult(result);
    setRollModal({ kind: "combat", title: `${mode === "ranged" ? "Ranged" : "Melee"} Defense`, result });
  };

  const updateWizardAge = (ageValue) => {
    const digits = String(ageValue).replace(/\D/g, "").slice(0, 2);
    setWizard((prev) => {
      if (digits === "") {
        return {
          ...prev,
          ageInput: "",
          age: 18,
          adulthood: buildManualAdulthoodTerms(18, prev.adulthood.terms),
        };
      }
      const numericAge = Math.max(18, Math.min(90, Number(digits)));
      return {
        ...prev,
        ageInput: digits,
        age: numericAge,
        adulthood: buildManualAdulthoodTerms(numericAge, prev.adulthood.terms),
      };
    });
  };

  const rollIdentity = (key) => {
    setWizard((prev) => {
      const next = { ...prev, identity: { ...prev.identity } };
      if (key === "sex") next.identity.sex = pickByRoll(sexOptions, rollDie(100));
      if (key === "build") {
        const table = (next.identity.sex?.label ?? "Male") === "Female" ? femaleBodyOptions : maleBodyOptions;
        next.identity.build = pickByRoll(table, rollDie(100));
      }
      if (key === "handedness") next.identity.handedness = pickByRoll(handednessOptions, rollDie(100));
      if (key === "skin") {
        const roll = rollDie(100);
        next.identity.skinRoll = roll;
        next.identity.skin = pickByRoll(skinOptions, roll);
      }
      if (key === "hair") next.identity.hair = pickByRoll(hairOptions, rollDie(100) + (next.identity.skinRoll ?? 0));
      if (key === "eye") next.identity.eye = pickByRoll(eyeOptions, rollDie(100) + (next.identity.skinRoll ?? 0));
      return next;
    });
  };

  const updateAdulthoodTerm = (index, patch) => {
    setWizard((prev) => {
      const nextTerms = prev.adulthood.terms.map((term, i) => {
        if (i !== index) return term;
        const merged = { ...term, ...patch };
        const job = resolveJobByName(merged.career, merged.job);
        return { ...merged, skill: job?.skill ?? "" };
      });
      return { ...prev, adulthood: { ...prev.adulthood, terms: nextTerms } };
    });
  };

  const rollAdulthoodGain = (index) => updateAdulthoodTerm(index, { gain: rollDie(5) });
  const rollAdulthoodAgeCheck = (index) => updateAdulthoodTerm(index, { ageCheckRoll: rollDie(100) });

  const finishWizard = () => {
    setCharacter(normalizeCharacter(buildCharacterFromWizard(wizard)));
    setActiveTab("overview");
    setAppMode("sheet");
    setSaveState("Character created with The Fall wizard");
  };

  const summaryCards = [
    { label: "Physical wound slots / location", value: constitutionSlots, hint: "Based on Constitution" },
    { label: "Mental wound slots / severity", value: willSlots, hint: "Based on Will" },
    { label: "Food / water carry days", value: mightCarryDays, hint: "Based on Might" },
    { label: "Current Sigils", value: currentSigils, hint: `Threshold ${sigilThreshold}` },
  ];

  const selectedLocationState = character.combat.hitLocations[activeHealthLocation];
  const filteredGrievousWounds = character.combat.grievousWounds.filter((item) => item.location === activeHealthLocation);

  const renderHome = () => (
    <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full overflow-hidden rounded-[32px] border border-zinc-800 bg-zinc-900/85 p-6 shadow-2xl backdrop-blur sm:p-8">
        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr] xl:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Z-LAND • The Fall</div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">{APP_TITLE}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">This build is focused on The Fall era only. Start a guided character creation wizard, open the saved sheet on this device, or import a JSON character file.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <button className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-4 text-sm font-semibold text-black hover:bg-emerald-400" onClick={startWizard}><WandSparkles className="h-4 w-4" /> Create with Wizard</button>
              <button className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl px-4 py-4 text-sm font-semibold ${hasSavedCharacter ? "bg-zinc-800 text-white hover:bg-zinc-700" : "cursor-not-allowed bg-zinc-900 text-zinc-600"}`} onClick={openSavedCharacter} disabled={!hasSavedCharacter}><Save className="h-4 w-4" /> Open Saved</button>
              <button className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-zinc-800 px-4 py-4 text-sm font-semibold text-white hover:bg-zinc-700" onClick={() => fileInputRef.current?.click()}><Upload className="h-4 w-4" /> Import File</button>
            </div>
            <input ref={fileInputRef} type="file" accept="application/json" onChange={handleImport} className="hidden" />
          </div>
          <div className="grid gap-4">
            <div className="rounded-[28px] border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">What changed</div>
              <div className="mt-4 grid gap-3 text-sm text-zinc-300">
                <div className="rounded-2xl bg-zinc-900 p-4">Guided The Fall life-path wizard</div>
                <div className="rounded-2xl bg-zinc-900 p-4">Dedicated Health tab with clickable hit locations</div>
                <div className="rounded-2xl bg-zinc-900 p-4">Interactive skill rolling with penalties and Sigils</div>
                <div className="rounded-2xl bg-zinc-900 p-4">Proper Combat tab with core modifier toggles and weapons</div>
              </div>
            </div>
            <DiceWidget />
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderWizard = () => (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 overflow-hidden rounded-[32px] border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl backdrop-blur">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">The Fall Character Wizard</div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">{APP_TITLE}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400 sm:text-base">Roll or pick through identity, childhood, teen years, adulthood, and finishing touches.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-700" onClick={() => setAppMode("home")}><ChevronLeft className="h-4 w-4" /> Back</button>
            {wizardStep > 0 ? <button className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-700" onClick={() => setWizardStep((prev) => Math.max(0, prev - 1))}><ChevronLeft className="h-4 w-4" /> Previous</button> : null}
            {wizardStep < wizardSteps.length - 1 ? <button className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black hover:bg-emerald-400" onClick={() => setWizardStep((prev) => Math.min(wizardSteps.length - 1, prev + 1))}>Next <ChevronRight className="h-4 w-4" /></button> : <button className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black hover:bg-emerald-400" onClick={finishWizard}><Check className="h-4 w-4" /> Create Character</button>}
          </div>
        </div>
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1 md:grid md:grid-cols-6 md:overflow-visible md:pb-0">
          {wizardSteps.map((step, index) => (
            <button key={step} onClick={() => setWizardStep(index)} className={`whitespace-nowrap rounded-2xl px-3 py-3 text-sm font-semibold transition ${wizardStep === index ? "bg-emerald-500 text-black" : "bg-zinc-950 text-zinc-300 hover:bg-zinc-800"}`}>{index + 1}. {step}</button>
          ))}
        </div>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          {wizardStep === 0 && (
            <Section title="Identity" description="The Fall starts with normal people. Roll who they were before the world ended.">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Input label="Character Name" value={wizard.name} onChange={(e) => setWizard((prev) => ({ ...prev, name: e.target.value }))} placeholder="Amber Hale" />
                <Input label="Starting Age" type="text" inputMode="numeric" pattern="[0-9]*" min={18} max={90} value={wizard.ageInput} onChange={(e) => updateWizardAge(e.target.value)} />
                <Input label="Concept" value={wizard.concept} onChange={(e) => setWizard((prev) => ({ ...prev, concept: e.target.value }))} placeholder="Paramedic with trust issues" />
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <IdentityQuestion title="Sex" value={wizard.identity.sex} options={sexOptions} onPick={(choice) => setWizard((prev) => ({ ...prev, identity: { ...prev.identity, sex: choice } }))} onRoll={() => rollIdentity("sex")} />
                <IdentityQuestion title="Body Type" value={wizard.identity.build} options={(wizard.identity.sex?.label ?? "Male") === "Female" ? femaleBodyOptions : maleBodyOptions} onPick={(choice) => setWizard((prev) => ({ ...prev, identity: { ...prev.identity, build: choice } }))} onRoll={() => rollIdentity("build")} note="Uses the male or female table based on Sex." />
                <IdentityQuestion title="Handedness" value={wizard.identity.handedness} options={handednessOptions} onPick={(choice) => setWizard((prev) => ({ ...prev, identity: { ...prev.identity, handedness: choice } }))} onRoll={() => rollIdentity("handedness")} />
                <IdentityQuestion title="Skin Colour" value={wizard.identity.skin} options={skinOptions} onPick={(choice) => setWizard((prev) => ({ ...prev, identity: { ...prev.identity, skin: choice } }))} onRoll={() => rollIdentity("skin")} />
                <IdentityQuestion title="Hair Colour" value={wizard.identity.hair} options={hairOptions} onPick={(choice) => setWizard((prev) => ({ ...prev, identity: { ...prev.identity, hair: choice } }))} onRoll={() => rollIdentity("hair")} note="Hair uses d100 plus the skin roll." />
                <IdentityQuestion title="Eye Colour" value={wizard.identity.eye} options={eyeOptions} onPick={(choice) => setWizard((prev) => ({ ...prev, identity: { ...prev.identity, eye: choice } }))} onRoll={() => rollIdentity("eye")} note="Eye colour also uses d100 plus the skin roll." />
              </div>
            </Section>
          )}

          {wizardStep === 1 && (
            <Section title="Childhood" description="Roll the events and relationships that shaped the person before the plague arrived.">
              <div className="grid gap-4 md:grid-cols-2">
                <WizardQuestion title="Do you remember your parents?" options={childhoodQuestions.parents} value={wizard.childhood.parents} onChange={(choice) => setWizard((prev) => ({ ...prev, childhood: { ...prev.childhood, parents: choice, parentWhat: choice?.label === "Both were alive" ? null : prev.childhood.parentWhat } }))} />
                {wizard.childhood.parents && wizard.childhood.parents.label !== "Both were alive" ? <WizardQuestion title="What happened to your parent(s)?" options={childhoodQuestions.parentWhat} value={wizard.childhood.parentWhat} onChange={(choice) => setWizard((prev) => ({ ...prev, childhood: { ...prev.childhood, parentWhat: choice } }))} /> : <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-500">If both parents were alive, this follow-up is skipped.</div>}
                <WizardQuestion title="How large was your family?" options={childhoodQuestions.familySize} value={wizard.childhood.familySize} onChange={(choice) => setWizard((prev) => ({ ...prev, childhood: { ...prev.childhood, familySize: choice } }))} />
                <WizardQuestion title="What was your relationship with God?" options={childhoodQuestions.god} value={wizard.childhood.god} onChange={(choice) => setWizard((prev) => ({ ...prev, childhood: { ...prev.childhood, god: choice } }))} />
                <WizardQuestion title="How strict were your caregivers?" options={childhoodQuestions.caregivers} value={wizard.childhood.caregivers} onChange={(choice) => setWizard((prev) => ({ ...prev, childhood: { ...prev.childhood, caregivers: choice } }))} />
                <WizardQuestion title="Where did you grow up?" options={childhoodQuestions.grewUp} value={wizard.childhood.grewUp} onChange={(choice) => setWizard((prev) => ({ ...prev, childhood: { ...prev.childhood, grewUp: choice } }))} />
                <WizardQuestion title="Who was the greatest influence on your childhood?" options={childhoodQuestions.influence} value={wizard.childhood.influence} onChange={(choice) => setWizard((prev) => ({ ...prev, childhood: { ...prev.childhood, influence: choice } }))} />
                <WizardQuestion title="How do you feel about your childhood?" options={childhoodQuestions.feeling} value={wizard.childhood.feeling} onChange={(choice) => setWizard((prev) => ({ ...prev, childhood: { ...prev.childhood, feeling: choice } }))} />
              </div>
            </Section>
          )}

          {wizardStep === 2 && (
            <Section title="Teen Years" description="School, friendships, love, loss, and the turning point that carried them toward adulthood.">
              <div className="grid gap-4 md:grid-cols-2">
                <WizardQuestion title="Favourite subject in school" options={teenQuestions.subject} value={wizard.teen.subject} onChange={(choice) => setWizard((prev) => ({ ...prev, teen: { ...prev.teen, subject: choice } }))} />
                <WizardQuestion title="Best friend" options={teenQuestions.bestFriend} value={wizard.teen.bestFriend} onChange={(choice) => setWizard((prev) => ({ ...prev, teen: { ...prev.teen, bestFriend: choice } }))} />
                <WizardQuestion title="First crush" options={teenQuestions.crush} value={wizard.teen.crush} onChange={(choice) => setWizard((prev) => ({ ...prev, teen: { ...prev.teen, crush: choice } }))} />
                <WizardQuestion title="Turning point" options={teenQuestions.turningPoint} value={wizard.teen.turningPoint} onChange={(choice) => setWizard((prev) => ({ ...prev, teen: { ...prev.teen, turningPoint: choice } }))} />
                <WizardQuestion title="Did you lose anyone?" options={teenQuestions.loseAnyone} value={wizard.teen.loseAnyone} onChange={(choice) => setWizard((prev) => ({ ...prev, teen: { ...prev.teen, loseAnyone: choice, loseAnyoneWhat: choice?.label === "Fate spared me" ? null : prev.teen.loseAnyoneWhat } }))} />
                {wizard.teen.loseAnyone && wizard.teen.loseAnyone.label !== "Fate spared me" ? <WizardQuestion title="If you lost someone, what happened?" options={teenQuestions.loseAnyoneWhat} value={wizard.teen.loseAnyoneWhat} onChange={(choice) => setWizard((prev) => ({ ...prev, teen: { ...prev.teen, loseAnyoneWhat: choice } }))} /> : <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-500">If fate spared them, this follow-up is skipped.</div>}
                <WizardQuestion title="How do you feel about your teen years?" options={teenQuestions.feeling} value={wizard.teen.feeling} onChange={(choice) => setWizard((prev) => ({ ...prev, teen: { ...prev.teen, feeling: choice } }))} />
              </div>
            </Section>
          )}

          {wizardStep === 3 && (
            <Section title="Adulthood" description="Pick the career path term by term. Each term covers 3 years, and the player chooses the career and job for every term.">
              <div className="grid gap-4 lg:grid-cols-[220px_auto]">
                <div className="rounded-3xl bg-zinc-950 p-4">
                  <Input label="Target Age" type="text" inputMode="numeric" pattern="[0-9]*" min={18} max={90} value={wizard.ageInput} onChange={(e) => updateWizardAge(e.target.value)} />
                  <div className="mt-4 rounded-2xl bg-zinc-900 p-4 text-sm text-zinc-300">{wizard.adulthood.summary}</div>
                  <div className="mt-3 text-sm text-zinc-500">The wizard does not choose a career path for the player here. The player selects each term manually.</div>
                </div>
                <div className="rounded-3xl bg-zinc-950 p-4">
                  {wizard.adulthood.terms.length === 0 ? <div className="text-sm text-zinc-500">No adulthood terms are needed for this age.</div> : (
                    <div className="space-y-4">
                      {wizard.adulthood.terms.map((term, index) => {
                        const selectedCareer = resolveCareerByName(term.career);
                        const selectedJob = resolveJobByName(term.career, term.job);
                        const needsAgeCheck = term.endAge >= 40;
                        return (
                          <div key={term.index} className="rounded-2xl bg-zinc-900 p-4">
                            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <div className="font-semibold text-white">Term {term.index}</div>
                                <div className="text-sm text-zinc-500">Age {term.startAge}-{term.endAge}</div>
                              </div>
                              <div className="rounded-full bg-zinc-950 px-3 py-1 text-xs uppercase tracking-[0.18em] text-zinc-400">{selectedJob?.skill || "No skill yet"}</div>
                            </div>
                            <div className="grid gap-3 lg:grid-cols-[1fr_1fr_120px_auto]">
                              <label className="block">
                                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Career</span>
                                <select value={term.career} onChange={(e) => updateAdulthoodTerm(index, { career: e.target.value, job: "", skill: "" })} className="min-h-[48px] w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-base text-white outline-none focus:border-emerald-500 sm:text-sm">
                                  <option value="">Choose career...</option>
                                  {adulthoodCareers.map((career) => <option key={career.career} value={career.career}>{career.career}</option>)}
                                </select>
                              </label>
                              <label className="block">
                                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Job</span>
                                <select value={term.job} onChange={(e) => updateAdulthoodTerm(index, { job: e.target.value })} disabled={!selectedCareer} className="min-h-[48px] w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-base text-white outline-none focus:border-emerald-500 disabled:opacity-50 sm:text-sm">
                                  <option value="">Choose job...</option>
                                  {(selectedCareer?.jobs ?? []).map((job) => <option key={job.name} value={job.name}>{job.name}</option>)}
                                </select>
                              </label>
                              <label className="block">
                                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Gain</span>
                                <input type="number" min={0} max={5} value={term.gain} onChange={(e) => updateAdulthoodTerm(index, { gain: Math.max(0, Math.min(5, Number(e.target.value) || 0)) })} className="min-h-[48px] w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3.5 text-base text-white outline-none focus:border-emerald-500 sm:text-sm" />
                              </label>
                              <div className="flex items-end"><button className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black hover:bg-emerald-400" onClick={() => rollAdulthoodGain(index)}><Dices className="h-4 w-4" /> Roll d5</button></div>
                            </div>
                            {needsAgeCheck ? <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto]"><div className="rounded-2xl bg-zinc-950 p-3 text-sm text-zinc-300"><div className="font-medium text-white">Age check</div><div className="mt-1">Roll: {term.ageCheckRoll || "-"}</div><div className="mt-1 text-zinc-500">At 40+ roll a Constitution age check. At 60+ all skills also drop by 1 each term.</div></div><div className="flex items-end"><button className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-700" onClick={() => rollAdulthoodAgeCheck(index)}><Dices className="h-4 w-4" /> Roll Age Check</button></div></div> : null}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </Section>
          )}

          {wizardStep === 4 && (
            <Section title="Finishing Touches" description="Round out the survivor with the last personal details before the sheet opens.">
              <div className="grid gap-4 md:grid-cols-2">
                <WizardQuestion title="Found your soulmate?" options={finishingQuestions.soulmate} value={wizard.finishing.soulmate} onChange={(choice) => setWizard((prev) => ({ ...prev, finishing: { ...prev.finishing, soulmate: choice } }))} />
                <WizardQuestion title="How many children did you have?" options={finishingQuestions.children} value={wizard.finishing.children} onChange={(choice) => setWizard((prev) => ({ ...prev, finishing: { ...prev.finishing, children: choice } }))} />
                <WizardQuestion title="Did you lose someone?" options={finishingQuestions.loseSomeone} value={wizard.finishing.loseSomeone} onChange={(choice) => setWizard((prev) => ({ ...prev, finishing: { ...prev.finishing, loseSomeone: choice } }))} />
                <WizardQuestion title="How many loved ones stuck by you?" options={finishingQuestions.lovedOnes} value={wizard.finishing.lovedOnes} onChange={(choice) => setWizard((prev) => ({ ...prev, finishing: { ...prev.finishing, lovedOnes: choice } }))} />
                <WizardQuestion title="How do you like to spend your free time?" options={finishingQuestions.freeTime} value={wizard.finishing.freeTime} onChange={(choice) => setWizard((prev) => ({ ...prev, finishing: { ...prev.finishing, freeTime: choice } }))} />
                <WizardQuestion title="What is most important to you?" options={finishingQuestions.important} value={wizard.finishing.important} onChange={(choice) => setWizard((prev) => ({ ...prev, finishing: { ...prev.finishing, important: choice } }))} />
              </div>
            </Section>
          )}

          {wizardStep === 5 && (
            <Section title="Review" description="This is the resulting The Fall survivor before the full sheet opens.">
              <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                <div className="space-y-4">
                  <div className="rounded-3xl bg-zinc-950 p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Identity</div>
                    <div className="mt-2 text-lg font-bold text-white">{wizard.name || "Unnamed Survivor"}</div>
                    <div className="mt-2 text-sm text-zinc-300">Age {wizard.age} • {wizard.identity.sex?.label || "?"} • {wizard.identity.build?.label || "?"}</div>
                    <div className="mt-1 text-sm text-zinc-400">{wizard.identity.handedness?.label || "?"} • {wizard.identity.skin?.label || "?"} skin • {wizard.identity.hair?.label || "?"} hair • {wizard.identity.eye?.label || "?"} eyes</div>
                    {wizard.concept ? <div className="mt-3 rounded-2xl bg-zinc-900 p-3 text-sm text-zinc-300">{wizard.concept}</div> : null}
                  </div>
                  <div className="rounded-3xl bg-zinc-950 p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Life path preview</div>
                    <div className="mt-3 grid gap-3 text-sm text-zinc-300">
                      <div className="rounded-2xl bg-zinc-900 p-3 whitespace-pre-wrap">{backgroundPreview.childhood || "Childhood not finished yet."}</div>
                      <div className="rounded-2xl bg-zinc-900 p-3 whitespace-pre-wrap">{backgroundPreview.teenYears || "Teen years not finished yet."}</div>
                      <div className="rounded-2xl bg-zinc-900 p-3 whitespace-pre-wrap">{backgroundPreview.adulthood || "Adulthood not assigned yet."}</div>
                      <div className="rounded-2xl bg-zinc-900 p-3 whitespace-pre-wrap">{backgroundPreview.lovedOnes || "Finishing touches not finished yet."}</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-3xl bg-zinc-950 p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Generated skills</div>
                    <div className="mt-3 grid gap-2 md:grid-cols-2">
                      {skillOrder.map((skill) => <div key={skill} className="flex items-center justify-between rounded-2xl bg-zinc-900 px-3 py-2 text-sm text-zinc-300"><span>{skill}</span><span className="font-semibold text-white">{wizardResult.skills[skill]}</span></div>)}
                    </div>
                  </div>
                  <div className="rounded-3xl bg-zinc-950 p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Applied bonuses</div>
                    <div className="mt-3 max-h-[360px] space-y-2 overflow-auto text-sm text-zinc-300">
                      {wizardResult.applied.length === 0 ? <div className="text-zinc-500">No skill gains applied yet.</div> : wizardResult.applied.map((item, index) => <div key={`${item.source}-${item.skill}-${index}`} className="rounded-2xl bg-zinc-900 p-3">{item.source}: {item.gain >= 0 ? `+${item.gain}` : item.gain} {item.skill}</div>)}
                    </div>
                  </div>
                </div>
              </div>
            </Section>
          )}
        </div>
        <div className="space-y-6">
          <Section title="Wizard notes" description="The Fall only.">
            <div className="space-y-3 text-sm text-zinc-300">
              <div className="rounded-2xl bg-zinc-950 p-4">All skills begin at 30.</div>
              <div className="rounded-2xl bg-zinc-950 p-4">Most life-path results grant one or two skills, each at +1d5.</div>
              <div className="rounded-2xl bg-zinc-950 p-4">Adulthood terms last 3 years and aging begins at 40.</div>
              <div className="rounded-2xl bg-zinc-950 p-4">Players choose the adulthood path manually.</div>
            </div>
          </Section>
          <DiceWidget />
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
      <div className="space-y-6">
        <Section title="Identity" description="The core sheet fields from the Z-LAND character sheet, plus a quick archetype loader if you want to pivot away from the wizard output." right={<select value={character.meta.archetype} onChange={(e) => { const name = e.target.value; setMeta({ archetype: name }); if (name) applyArchetype(name); }} className="min-h-[44px] rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-base text-white outline-none focus:border-emerald-500 sm:text-sm"><option value="">Apply archetype...</option>{Object.keys(archetypes).map((name) => <option key={name} value={name}>{name}</option>)}</select>}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Input label="Character Name" value={character.meta.characterName} onChange={(e) => setMeta({ characterName: e.target.value })} placeholder="Sabina Ward" />
            <Input label="Era" value={character.meta.era} onChange={(e) => setMeta({ era: e.target.value })} placeholder="The Fall" />
            <Input label="Hometown" value={character.profile.hometown} onChange={(e) => setProfile({ hometown: e.target.value })} placeholder="Bristol" />
            <Input label="Sex" value={character.profile.sex} onChange={(e) => setProfile({ sex: e.target.value })} placeholder="Female" />
            <Input label="Age" value={character.profile.age} onChange={(e) => setProfile({ age: e.target.value })} placeholder="27" />
            <Input label="Build" value={character.profile.build} onChange={(e) => setProfile({ build: e.target.value })} placeholder="Athletic" />
            <Input label="Handedness" value={character.profile.handedness} onChange={(e) => setProfile({ handedness: e.target.value })} placeholder="Right-handed" />
            <Input label="Skin Colour" value={character.profile.skinColour} onChange={(e) => setProfile({ skinColour: e.target.value })} placeholder="Olive" />
            <Input label="Hair Colour" value={character.profile.hairColour} onChange={(e) => setProfile({ hairColour: e.target.value })} placeholder="Brown" />
            <Input label="Eye Colour" value={character.profile.eyeColour} onChange={(e) => setProfile({ eyeColour: e.target.value })} placeholder="Green" />
            <div className="md:col-span-2 xl:col-span-3"><Input label="Concept / Archetype Pitch" value={character.background.concept} onChange={(e) => setBackground({ concept: e.target.value })} placeholder="Ex-navy medic who refuses to leave anyone behind." /></div>
          </div>
        </Section>

        <Section title="Life Path Notes" description="The wizard fills these in automatically, but you can edit them freely afterward.">
          <div className="grid gap-4 lg:grid-cols-2">
            <TextArea label="Childhood" value={character.background.childhood} onChange={(e) => setBackground({ childhood: e.target.value })} />
            <TextArea label="Teen Years" value={character.background.teenYears} onChange={(e) => setBackground({ teenYears: e.target.value })} />
            <TextArea label="Adulthood" value={character.background.adulthood} onChange={(e) => setBackground({ adulthood: e.target.value })} />
            <TextArea label="Loved Ones / Priorities" value={character.background.lovedOnes} onChange={(e) => setBackground({ lovedOnes: e.target.value })} />
          </div>
        </Section>
      </div>

      <div className="space-y-6">
        <Section title="Portrait" description="Upload a character portrait up to 2 MB.">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950">
              {character.meta.portraitData ? <img src={character.meta.portraitData} alt="Character portrait" className="aspect-[3/4] w-full object-cover" /> : <div className="flex aspect-[3/4] items-center justify-center text-sm text-zinc-500">No portrait uploaded yet.</div>}
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black hover:bg-emerald-400" onClick={() => portraitInputRef.current?.click()}><Upload className="h-4 w-4" /> Upload Portrait</button>
              {character.meta.portraitData ? <button className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-red-600" onClick={removePortrait}><Trash2 className="h-4 w-4" /> Remove</button> : null}
            </div>
            <input ref={portraitInputRef} type="file" accept="image/*" onChange={handlePortraitUpload} className="hidden" />
            {character.meta.portraitName ? <div className="text-xs text-zinc-500">{character.meta.portraitName}</div> : null}
          </div>
        </Section>

        <Section title="Snapshot" description="Quick numbers that matter during play.">
          <div className="grid gap-3">
            {summaryCards.map((card) => <div key={card.label} className="rounded-2xl bg-zinc-950 p-4"><div className="text-xs uppercase tracking-[0.18em] text-zinc-500">{card.label}</div><div className="mt-2 text-2xl font-black text-white">{card.value}</div><div className="mt-1 text-sm text-zinc-400">{card.hint}</div></div>)}
          </div>
        </Section>

        <DiceWidget />
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      <Section title="Skill Roller" description="Set a manual modifier first, then roll any skill. Hunger, thirst, sleep, temperature, exhaustion, mental wounds, and Wealth pressure are already included.">
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-zinc-950 p-4">
              <div className="mb-2 text-xs uppercase tracking-[0.18em] text-zinc-500">Current Sigils</div>
              <div className="flex items-center justify-between gap-4">
                <div><div className="text-3xl font-black text-white">{currentSigils}</div><div className="text-sm text-zinc-400">Threshold {sigilThreshold}</div></div>
                <div className="flex gap-2"><button className="h-11 w-11 rounded-2xl bg-zinc-800 text-white hover:bg-zinc-700" onClick={() => adjustSigils(-1)}>-</button><button className="h-11 w-11 rounded-2xl bg-zinc-800 text-white hover:bg-zinc-700" onClick={() => adjustSigils(1)}>+</button></div>
              </div>
              <button className="mt-3 inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-700" onClick={resetSigilsToThreshold}>Reset to Threshold</button>
            </div>
            <div className="rounded-3xl bg-zinc-950 p-4">
              <Input label="Manual Modifier" type="number" value={skillRollModifier} onChange={(e) => setSkillRollModifier(Number(e.target.value) || 0)} />
              <button className={`mt-3 inline-flex min-h-[48px] items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold ${queuedSigilBonus ? "bg-amber-500 text-black" : "bg-zinc-800 text-white hover:bg-zinc-700"}`} onClick={() => { if (!queuedSigilBonus && currentSigils <= 0) return; setQueuedSigilBonus((prev) => !prev); }}><Crosshair className="h-4 w-4" /> {queuedSigilBonus ? "Sigil +25 Armed" : "Arm Sigil +25"}</button>
              <div className="mt-3 text-xs text-zinc-500">Spend the Sigil before rolling. A reroll is offered only after a failed check.</div>
            </div>
          </div>
          <RollResultCard result={skillRollResult} rerollEnabled={Boolean(skillRollResult && !skillRollResult.success && currentSigils > 0)} onReroll={rerollSkillCheck} />
        </div>
      </Section>

      <Section title="Skills" description="Base skill values, effective values, and one-click rolling.">
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

      <Section title="Specialisations" description="Add any unlocked specialisations once a skill hits 50+ and keep them separate from the parent skill." right={<button className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400" onClick={() => setCharacter((prev) => ({ ...prev, specialisations: [...prev.specialisations, { parent: "", name: "", level: "" }] }))}><Plus className="h-4 w-4" /> Add</button>}>
        <div className="space-y-3">
          {character.specialisations.map((spec, index) => (
            <div key={index} className="grid gap-3 rounded-2xl bg-zinc-950 p-4 md:grid-cols-[1fr_1fr_120px_auto]">
              <Input label="Parent Skill" value={spec.parent} onChange={(e) => setCharacter((prev) => ({ ...prev, specialisations: arrayUpdate(prev.specialisations, index, { parent: e.target.value }) }))} placeholder="Fight" />
              <Input label="Specialisation" value={spec.name} onChange={(e) => setCharacter((prev) => ({ ...prev, specialisations: arrayUpdate(prev.specialisations, index, { name: e.target.value }) }))} placeholder="One Handed Weapons" />
              <Input label="Level" type="number" value={spec.level} onChange={(e) => setCharacter((prev) => ({ ...prev, specialisations: arrayUpdate(prev.specialisations, index, { level: clampNonNegative(e.target.value) }) }))} placeholder="62" />
              <div className="flex items-end"><button className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-red-600" onClick={() => setCharacter((prev) => ({ ...prev, specialisations: prev.specialisations.filter((_, i) => i !== index) }))}><Trash2 className="h-4 w-4" /> Remove</button></div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );

  const renderModifierCard = (title, description, section, fields) => {
    const values = character.combat.modifiers[section];
    const total = getCombatModifierTotal(section);
    return (
      <div className="rounded-3xl bg-zinc-950 p-4">
        <div className="mb-3 flex items-start justify-between gap-3"><div><div className="text-base font-bold text-white">{title}</div><div className="mt-1 text-sm text-zinc-500">{description}</div></div><div className="rounded-2xl bg-zinc-900 px-3 py-2 text-right"><div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Total</div><div className="text-xl font-black text-white">{total >= 0 ? `+${total}` : total}</div></div></div>
        <div className="grid gap-2 md:grid-cols-2">
          {fields.map((field) => (
            <label key={field.key} className="flex min-h-[52px] items-center justify-between gap-3 rounded-2xl bg-zinc-900 px-3 py-3 text-sm text-zinc-300">
              <span>{field.label}</span>
              {field.type === "count" ? <input type="number" min={0} value={values[field.key]} onChange={(e) => setCombat({ modifiers: { ...character.combat.modifiers, [section]: { ...values, [field.key]: clampNonNegative(e.target.value) } } })} className="h-11 w-20 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-center text-base text-white outline-none focus:border-emerald-500 sm:text-sm" /> : <input type="checkbox" checked={values[field.key]} onChange={(e) => setCombat({ modifiers: { ...character.combat.modifiers, [section]: { ...values, [field.key]: e.target.checked } } })} className="h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-emerald-500" />}
            </label>
          ))}
        </div>
      </div>
    );
  };

  const renderWeaponList = (category) => {
    const weapons = character.combat.weapons.filter((weapon) => weapon.category === category);
    return (
      <div className="space-y-3">
        {weapons.map((weapon, displayIndex) => {
          const actualIndex = character.combat.weapons.findIndex((item) => item === weapon);
          return (
            <div key={`${category}-${displayIndex}`} className="rounded-2xl bg-zinc-950 p-4">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.2fr_120px_120px_120px_140px_auto]">
                <Input label="Weapon" value={weapon.name} onChange={(e) => setCombat({ weapons: arrayUpdate(character.combat.weapons, actualIndex, { name: e.target.value }) })} placeholder={category === "ranged" ? "Hunting Rifle" : "Hatchet"} />
                <label className="block"><span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Class</span><select value={weapon.weightClass} onChange={(e) => { const weightClass = e.target.value; setCombat({ weapons: arrayUpdate(character.combat.weapons, actualIndex, { weightClass, damage: weaponClassData[weightClass].damage, woundMod: weaponClassData[weightClass].woundMod }) }); }} className="min-h-[48px] w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-base text-white outline-none focus:border-emerald-500 sm:text-sm">{Object.keys(weaponClassData).map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
                <label className="block"><span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Range</span><select value={weapon.rangeBand} onChange={(e) => setCombat({ weapons: arrayUpdate(character.combat.weapons, actualIndex, { rangeBand: e.target.value }) })} className="min-h-[48px] w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-base text-white outline-none focus:border-emerald-500 sm:text-sm">{rangeBands.map((band) => <option key={band} value={band}>{band}</option>)}</select></label>
                <Input label="Damage" type="number" value={weapon.damage} onChange={(e) => setCombat({ weapons: arrayUpdate(character.combat.weapons, actualIndex, { damage: clampNonNegative(e.target.value) }) })} />
                <label className="block"><span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Assigned Skill</span><select value={weapon.skill} onChange={(e) => setCombat({ weapons: arrayUpdate(character.combat.weapons, actualIndex, { skill: e.target.value }) })} className="min-h-[48px] w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-base text-white outline-none focus:border-emerald-500 sm:text-sm">{skillOrder.map((skill) => <option key={skill} value={skill}>{skill}</option>)}</select></label>
                <div className="flex items-end gap-2"><button className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black hover:bg-emerald-400" onClick={() => rollWeaponAttack(weapon)}><Dices className="h-4 w-4" /> Attack</button><button className="inline-flex min-h-[48px] items-center justify-center rounded-2xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-red-600" onClick={() => setCombat({ weapons: character.combat.weapons.filter((_, index) => index !== actualIndex) })}><Trash2 className="h-4 w-4" /></button></div>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-[120px_1fr]"><Input label="Wound Mod" type="number" value={weapon.woundMod} onChange={(e) => setCombat({ weapons: arrayUpdate(character.combat.weapons, actualIndex, { woundMod: Number(e.target.value) || 0 }) })} /><Input label="Notes" value={weapon.notes} onChange={(e) => setCombat({ weapons: arrayUpdate(character.combat.weapons, actualIndex, { notes: e.target.value }) })} /></div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderCombat = () => (
    <div className="space-y-6">
      <Section title="Combat Rolls" description="Core combat modifier toggles are split between ranged and melee. Weapon attacks use the assigned skill plus all active combat modifiers for that section.">
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-4">
            {renderModifierCard("Ranged Attack", "Core ranged attack modifiers.", "rangedAttack", [{ key: "inMelee", label: "In melee" }, { key: "movingQuickly", label: "Moving quickly" }, { key: "offHanded", label: "Off-handed weapon" }, { key: "firingBlindly", label: "Firing blindly" }, { key: "aimed", label: "Aimed" }, { key: "areaOfEffect", label: "Area of effect attack" }])}
            {renderModifierCard("Ranged Defense", "Core ranged defense modifiers.", "rangedDefense", [{ key: "inMelee", label: "In melee" }, { key: "movingQuickly", label: "Moving quickly" }, { key: "areaOfEffect", label: "Area of effect attack" }, { key: "dodge", label: "Dodge" }, { key: "surprised", label: "Surprised by attack" }, { key: "inCover", label: "In cover" }])}
            {renderModifierCard("Melee Attack", "Core melee attack modifiers.", "meleeAttack", [{ key: "charging", label: "Charging" }, { key: "superiorPosition", label: "Superior position" }, { key: "offHanded", label: "Off-handed weapon" }, { key: "aimed", label: "Aimed" }, { key: "flankingAllies", label: "Allies flanking", type: "count" }])}
            {renderModifierCard("Melee Defense", "Core melee defense modifiers.", "meleeDefense", [{ key: "parry", label: "Parry" }, { key: "superiorPosition", label: "Superior position" }, { key: "offHanded", label: "Off-handed weapon" }, { key: "dodge", label: "Dodge" }, { key: "flankingEnemies", label: "Enemies flanking", type: "count" }])}
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
            <RollResultCard result={combatRollResult} rerollEnabled={false} onReroll={() => {}} label="Last combat roll" />
            <div className="rounded-3xl bg-zinc-950 p-4 text-sm text-zinc-300"><div className="font-semibold text-white">Sigil bonus queue</div><div className="mt-2">{queuedSigilBonus ? "The next roll will spend a Sigil for +25." : "No Sigil bonus armed."}</div></div>
          </div>
        </div>
      </Section>
      <Section title="Ranged Weapons" description="Add any ranged weapon, assign its skill, and roll attacks with the current ranged attack modifiers." right={<button className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400" onClick={() => setCombat({ weapons: [...character.combat.weapons, makeWeapon("ranged")] })}><Plus className="h-4 w-4" /> Add Ranged</button>}>
        {renderWeaponList("ranged")}
      </Section>
      <Section title="Melee Weapons" description="Add any melee weapon, assign its skill, and roll attacks with the current melee attack modifiers." right={<button className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400" onClick={() => setCombat({ weapons: [...character.combat.weapons, makeWeapon("melee")] })}><Plus className="h-4 w-4" /> Add Melee</button>}>
        {renderWeaponList("melee")}
      </Section>
      <Section title="Combat Notes" description="Player-facing space for preferred attack routines, stunts, and reminders."><TextArea label="Combat Notes" value={character.combat.combatNotes} onChange={(e) => setCombat({ combatNotes: e.target.value })} rows={5} /></Section>
    </div>
  );

  const renderHealth = () => (
    <div className="space-y-6">
      <Section title="Physical Health" description="Select a hit location on the body diagram to manage armour, damage slots, and grievous wounds in a side panel.">
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <BodyDiagram selected={activeHealthLocation} onSelect={setActiveHealthLocation} states={character.combat.hitLocations} />
          <div className="rounded-3xl bg-zinc-950 p-4">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div><div className="text-xl font-bold text-white">{hitLocations.find((loc) => loc.key === activeHealthLocation)?.label}</div><div className="mt-1 text-sm text-zinc-400">Hit location {hitLocations.find((loc) => loc.key === activeHealthLocation)?.range}</div></div>
              <select value={selectedLocationState.armour} onChange={(e) => updateLocation(activeHealthLocation, { armour: e.target.value })} className="min-h-[44px] rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-base text-white outline-none focus:border-emerald-500 sm:text-sm">{armourOptions.map((opt) => <option key={opt} value={opt}>{opt} Armour</option>)}</select>
            </div>
            <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-3">
              {Array.from({ length: constitutionSlots }).map((_, idx) => {
                const filled = selectedLocationState.slots[idx];
                return <button key={idx} onClick={() => togglePhysicalSlot(activeHealthLocation, idx)} className={`min-h-[64px] rounded-2xl border px-3 py-3 text-left transition ${filled ? "border-red-500 bg-red-500/20 text-red-100" : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600"}`}><div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Slot {idx + 1}</div><div className="mt-1 font-semibold">{slotLabel(idx)}</div></button>;
              })}
            </div>
            <label className="inline-flex items-center gap-2 text-sm text-zinc-300"><input type="checkbox" checked={selectedLocationState.destroyed} onChange={(e) => updateLocation(activeHealthLocation, { destroyed: e.target.checked })} className="h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-emerald-500" /> Location Destroyed</label>
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between"><div className="text-sm font-semibold text-white">Grievous wounds for this location</div><button className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400" onClick={() => setCombat({ grievousWounds: [...character.combat.grievousWounds, { location: activeHealthLocation, description: "", healTime: "" }] })}><Plus className="h-4 w-4" /> Add</button></div>
              <div className="space-y-3">
                {filteredGrievousWounds.length === 0 ? <div className="rounded-2xl bg-zinc-900 p-4 text-sm text-zinc-500">No grievous wounds logged for this location.</div> : filteredGrievousWounds.map((item, index) => {
                  const actualIndex = character.combat.grievousWounds.findIndex((entry) => entry === item);
                  return <div key={`${item.location}-${index}`} className="grid gap-3 rounded-2xl bg-zinc-900 p-4 md:grid-cols-[1fr_160px_auto]"><Input label="Wound" value={item.description} onChange={(e) => setCombat({ grievousWounds: arrayUpdate(character.combat.grievousWounds, actualIndex, { description: e.target.value }) })} /><Input label="Heal Time" value={item.healTime} onChange={(e) => setCombat({ grievousWounds: arrayUpdate(character.combat.grievousWounds, actualIndex, { healTime: e.target.value }) })} /><div className="flex items-end"><button className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-red-600" onClick={() => setCombat({ grievousWounds: character.combat.grievousWounds.filter((_, entryIndex) => entryIndex !== actualIndex) })}><Trash2 className="h-4 w-4" /> Remove</button></div></div>;
                })}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Mental Health" description="Will determines how many Minor, Significant, and Grievous mental wound slots are available.">
        <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl bg-zinc-950 p-4">
            {[["minor", "Minor"], ["significant", "Significant"], ["grievous", "Grievous"]].map(([bucket, label]) => (
              <div key={bucket} className="mb-4 last:mb-0">
                <div className="mb-2 text-sm font-semibold text-white">{label}</div>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                  {Array.from({ length: willSlots }).map((_, idx) => {
                    const filled = character.mental[bucket][idx];
                    return <button key={idx} onClick={() => toggleMentalSlot(bucket, idx)} className={`min-h-[52px] rounded-2xl border px-3 py-3 text-sm transition ${filled ? "border-purple-400 bg-purple-500/20 text-purple-100" : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600"}`}>{label} {idx + 1}</button>;
                  })}
                </div>
              </div>
            ))}
            <label className="mt-2 inline-flex items-center gap-2 text-sm text-zinc-300"><input type="checkbox" checked={character.mental.destroyed} onChange={(e) => setMental({ destroyed: e.target.checked })} className="h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-emerald-500" /> Mental trauma tracked as destroyed</label>
          </div>
          <div className="rounded-3xl bg-zinc-950 p-4"><div className="mb-3 text-sm font-semibold text-white">Current mental penalties</div><div className="space-y-3 text-sm text-zinc-300"><div className="rounded-2xl bg-zinc-900 p-3">Significant wound penalty: {character.mental.significant.slice(0, willSlots).some(Boolean) ? "-10 active" : "none"}</div><div className="rounded-2xl bg-zinc-900 p-3">Grievous wound penalty: {character.mental.grievous.slice(0, willSlots).some(Boolean) ? "-15 active" : "none"}</div><div className="rounded-2xl bg-zinc-900 p-3">Affected skills: Deceive, Diplomacy, Intimidate, Intuition, Logic, Perception</div></div></div>
        </div>
      </Section>

      <Section title="Grievous Mental Wounds" description="Track the subject, condition, and any successes toward recovery." right={<button className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400" onClick={() => setMental({ grievousEntries: [...character.mental.grievousEntries, { subject: "", condition: "", successes: "" }] })}><Plus className="h-4 w-4" /> Add</button>}>
        <div className="space-y-3">
          {character.mental.grievousEntries.map((item, index) => (
            <div key={index} className="grid gap-3 rounded-2xl bg-zinc-950 p-4 md:grid-cols-[1fr_1fr_140px_auto]">
              <Input label="Subject" value={item.subject} onChange={(e) => setMental({ grievousEntries: arrayUpdate(character.mental.grievousEntries, index, { subject: e.target.value }) })} />
              <Input label="Condition" value={item.condition} onChange={(e) => setMental({ grievousEntries: arrayUpdate(character.mental.grievousEntries, index, { condition: e.target.value }) })} />
              <Input label="Successes" value={item.successes} onChange={(e) => setMental({ grievousEntries: arrayUpdate(character.mental.grievousEntries, index, { successes: e.target.value }) })} />
              <div className="flex items-end"><button className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-red-600" onClick={() => setMental({ grievousEntries: character.mental.grievousEntries.filter((_, i) => i !== index) })}><Trash2 className="h-4 w-4" /> Remove</button></div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );

  const renderSurvival = () => (
    <div className="space-y-6">
      <Section title="Survival Penalties" description="This sheet computes the clear numeric penalties from hunger, thirst, sleep deprivation, exhaustion, and temperature.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-3xl bg-zinc-950 p-4"><div className="mb-2 text-sm font-semibold text-white">Hunger failures</div><NumberStepper value={character.survival.hungerFails} onChange={(value) => setSurvival({ hungerFails: clampNonNegative(value) })} min={0} max={20} /><div className="mt-3 text-sm text-zinc-400">Physical {computed.hungerPhysical} / Non-physical {computed.hungerMental}</div></div>
          <div className="rounded-3xl bg-zinc-950 p-4"><div className="mb-2 text-sm font-semibold text-white">Thirst failures</div><NumberStepper value={character.survival.thirstFails} onChange={(value) => setSurvival({ thirstFails: clampNonNegative(value) })} min={0} max={20} /><div className="mt-3 text-sm text-zinc-400">Physical {computed.thirstPhysical} / Non-physical {computed.thirstMental}</div></div>
          <div className="rounded-3xl bg-zinc-950 p-4"><div className="mb-2 text-sm font-semibold text-white">Sleep failures</div><NumberStepper value={character.survival.sleepFails} onChange={(value) => setSurvival({ sleepFails: clampNonNegative(value) })} min={0} max={20} /><div className="mt-3 text-sm text-zinc-400">All skills {computed.sleepAll}</div></div>
          <div className="rounded-3xl bg-zinc-950 p-4"><div className="mb-2 text-sm font-semibold text-white">Exhaustion penalty</div><NumberStepper value={character.survival.exhaustionPenalty} onChange={(value) => setSurvival({ exhaustionPenalty: clampNonNegative(value) })} min={0} max={60} /><div className="mt-3 text-sm text-zinc-400">Physical only {computed.exhaustionPhysical}</div></div>
          <div className="rounded-3xl bg-zinc-950 p-4"><div className="mb-2 text-sm font-semibold text-white">Temperature</div><select value={character.survival.temperature} onChange={(e) => setSurvival({ temperature: e.target.value })} className="min-h-[48px] w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-base text-white outline-none focus:border-emerald-500 sm:text-sm">{temperatureOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select><div className="mt-3 text-sm text-zinc-400">All skills {computed.tempAll}</div></div>
        </div>
      </Section>

      <Section title="Food, Water, Sleep, Infection" description="Quick bookkeeping for the apocalypse grind.">
        <div className="grid gap-4 xl:grid-cols-2">
          <div className="space-y-4 rounded-3xl bg-zinc-950 p-4"><Input label="Infection Status" value={character.survival.infectionStatus} onChange={(e) => setSurvival({ infectionStatus: e.target.value })} placeholder="Uninfected / bitten / feverish" /><div className="rounded-2xl bg-zinc-900 p-4 text-sm text-zinc-300">Carry capacity by Might: <span className="font-semibold text-white">{mightCarryDays} days worth</span> of food and water.</div><TextArea label="Survival Notes" value={character.survival.notes} onChange={(e) => setSurvival({ notes: e.target.value })} rows={5} /></div>
          <div className="rounded-3xl bg-zinc-950 p-4"><div className="mb-3 flex items-center justify-between"><div className="text-sm font-semibold text-white">Perishables tracker</div><button className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400" onClick={() => setSurvival({ perishables: [...character.survival.perishables, { type: "", units: 0, daysLeft: 0 }] })}><Plus className="h-4 w-4" /> Add</button></div><div className="space-y-3">{character.survival.perishables.map((item, index) => <div key={index} className="grid gap-3 rounded-2xl bg-zinc-900 p-4 md:grid-cols-[1fr_120px_120px_auto]"><Input label="Type" value={item.type} onChange={(e) => setSurvival({ perishables: arrayUpdate(character.survival.perishables, index, { type: e.target.value }) })} /><Input label="Units" type="number" value={item.units} onChange={(e) => setSurvival({ perishables: arrayUpdate(character.survival.perishables, index, { units: clampNonNegative(e.target.value) }) })} /><Input label="Days Left" type="number" value={item.daysLeft} onChange={(e) => setSurvival({ perishables: arrayUpdate(character.survival.perishables, index, { daysLeft: clampNonNegative(e.target.value) }) })} /><div className="flex items-end"><button className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-red-600" onClick={() => setSurvival({ perishables: character.survival.perishables.filter((_, i) => i !== index) })}><Trash2 className="h-4 w-4" /> Remove</button></div></div>)}</div></div>
        </div>
      </Section>
    </div>
  );

  const renderInventory = () => (
    <div className="space-y-6">
      <Section title="Gear & Wealth" description="Z-LAND uses the Wealth skill instead of a currency ledger, but this page keeps the things players always need at hand.">
        <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl bg-zinc-950 p-4"><div className="mb-3 flex items-center justify-between"><div className="text-sm font-semibold text-white">Gear</div><button className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400" onClick={() => setInventory({ gear: [...character.inventory.gear, { name: "", qty: 1, notes: "" }] })}><Plus className="h-4 w-4" /> Add</button></div><div className="space-y-3">{character.inventory.gear.map((item, index) => <div key={index} className="grid gap-3 rounded-2xl bg-zinc-900 p-4 md:grid-cols-[1fr_100px_1fr_auto]"><Input label="Item" value={item.name} onChange={(e) => setInventory({ gear: arrayUpdate(character.inventory.gear, index, { name: e.target.value }) })} /><Input label="Qty" type="number" value={item.qty} onChange={(e) => setInventory({ gear: arrayUpdate(character.inventory.gear, index, { qty: clampNonNegative(e.target.value) }) })} /><Input label="Notes" value={item.notes} onChange={(e) => setInventory({ gear: arrayUpdate(character.inventory.gear, index, { notes: e.target.value }) })} /><div className="flex items-end"><button className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-red-600" onClick={() => setInventory({ gear: character.inventory.gear.filter((_, i) => i !== index) })}><Trash2 className="h-4 w-4" /> Remove</button></div></div>)}</div></div>
          <div className="rounded-3xl bg-zinc-950 p-4"><div className="mb-3 flex items-center justify-between"><div className="text-sm font-semibold text-white">Ammo / consumables</div><button className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400" onClick={() => setInventory({ ammo: [...character.inventory.ammo, { type: "", qty: "", notes: "" }] })}><Plus className="h-4 w-4" /> Add</button></div><div className="space-y-3">{character.inventory.ammo.map((item, index) => <div key={index} className="grid gap-3 rounded-2xl bg-zinc-900 p-4 md:grid-cols-[1fr_120px_1fr_auto]"><Input label="Type" value={item.type} onChange={(e) => setInventory({ ammo: arrayUpdate(character.inventory.ammo, index, { type: e.target.value }) })} /><Input label="Qty" value={item.qty} onChange={(e) => setInventory({ ammo: arrayUpdate(character.inventory.ammo, index, { qty: e.target.value }) })} /><Input label="Notes" value={item.notes} onChange={(e) => setInventory({ ammo: arrayUpdate(character.inventory.ammo, index, { notes: e.target.value }) })} /><div className="flex items-end"><button className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-red-600" onClick={() => setInventory({ ammo: character.inventory.ammo.filter((_, i) => i !== index) })}><Trash2 className="h-4 w-4" /> Remove</button></div></div>)}</div><div className="mt-4 grid gap-4 md:grid-cols-2"><div><div className="mb-2 text-sm font-semibold text-white">Wealth pressure</div><NumberStepper value={character.inventory.wealthPenalty} onChange={(value) => setInventory({ wealthPenalty: clampNonNegative(value) })} min={0} max={50} /></div><TextArea label="Stash / vehicle / base notes" value={character.inventory.stashNotes} onChange={(e) => setInventory({ stashNotes: e.target.value })} rows={4} /></div></div>
        </div>
      </Section>
    </div>
  );

  const renderNotes = () => (
    <div className="grid gap-6 xl:grid-cols-2">
      <Section title="Character Notes" description="Freeform space for appearance, contacts, and the emotional fallout of the apocalypse."><div className="space-y-4"><TextArea label="Appearance" value={character.notes.appearance} onChange={(e) => setNotes({ appearance: e.target.value })} /><TextArea label="Allies / Factions / NPCs" value={character.notes.allies} onChange={(e) => setNotes({ allies: e.target.value })} /><TextArea label="Session Notes" value={character.notes.sessionNotes} onChange={(e) => setNotes({ sessionNotes: e.target.value })} rows={8} /></div></Section>
      <Section title="Goals & Campaign Notes" description="Player-facing threads, goals, and reminders."><div className="space-y-4"><TextArea label="Goals / Personal Threads" value={character.notes.goals} onChange={(e) => setNotes({ goals: e.target.value })} rows={6} /><div className="rounded-3xl bg-zinc-950 p-4 text-sm text-zinc-300">This version is player-facing only and The Fall focused.</div></div></Section>
    </div>
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_35%),linear-gradient(180deg,_#0a0a0a_0%,_#111111_100%)] pb-24 text-white md:pb-0">
      <style>{`
        input, select, textarea { font-size: 16px; }
        button { touch-action: manipulation; }
        @media (min-width: 640px) {
          input, select, textarea { font-size: 14px; }
        }
      `}</style>
      {appMode === "home" && renderHome()}
      {appMode === "wizard" && renderWizard()}
      {appMode === "sheet" && (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 overflow-hidden rounded-[32px] border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl backdrop-blur">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Z-LAND Interactive Character Sheet • The Fall</div>
                <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">{APP_TITLE}</h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400 sm:text-base">The guided character creator feeds directly into this player sheet, but every field stays editable after creation.</p>
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
              return <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`inline-flex min-h-[44px] items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition ${active ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800"}`}><Icon className="h-4 w-4" /> {tab.label}</button>;
            })}
          </div>

          <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pb-28 md:pb-12">
            {activeTab === "overview" && renderOverview()}
            {activeTab === "skills" && renderSkills()}
            {activeTab === "combat" && renderCombat()}
            {activeTab === "health" && renderHealth()}
            {activeTab === "survival" && renderSurvival()}
            {activeTab === "inventory" && renderInventory()}
            {activeTab === "notes" && renderNotes()}
          </motion.div>
          <MobileTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      )}
      <RollPopup
        open={Boolean(rollModal && appMode === "sheet")}
        title={rollModal?.title ?? "Roll"}
        result={rollModal?.result ?? null}
        onClose={() => setRollModal(null)}
        onReroll={rerollSkillCheck}
        rerollEnabled={Boolean(rollModal && rollModal.kind === "skill" && rollModal.result && !rollModal.result.success && currentSigils > 0)}
      />
    </div>
  );
}
