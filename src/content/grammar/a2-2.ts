/**
 * A2.2 grammar points used by Units 10–12.
 * Rule text is written for learners; citations point to the ledger in
 * LINGUISTIC_RESOURCES.md.
 */

export const a22Grammar = [
  {
    id: "G28",
    title: "Future with dê and the subjunctive",
    stage: "A2.2",
    rule: "The future is formed with the invariable particle dê (or ê) plus the present subjunctive: Ez dê sibê biçim (I will go tomorrow), Ew dê were (He/she will come), Em dê bixwin (We will eat). The pronouns can contract with ê in writing: ez ê / ezê, tu yê / tuyê, ew ê / ewê, em ê / emê, hûn ê / hûnê. Ewê sibê biçe is the contracted form of Ew dê sibê biçe. Do not use wê as a universal future particle: *Ez wê biçim is wrong; say Ez dê biçim.",
    examples: [
      { ku: "Ez dê sibê biçim.", en: "I will go tomorrow." },
      { ku: "Ew dê were.", en: "He/she will come." },
      { ku: "Ewê sibê biçe.", en: "He/she will go tomorrow." },
      {
        ku: "Em ê vê havînê li deryayê bin.",
        en: "We will be by the sea this summer.",
      },
    ],
    commonErrors: [
      "Using the present indicative after dê: *Ez dê diçim.",
      "Treating wê as a universal future marker: *Ez wê biçim.",
      "Using the past stem after dê: *Ez dê çûm.",
    ],
    sourceRefs: ["TH §16.2", "CHY"],
    reviewStatus: "checked",
  },
  {
    id: "G29",
    title: "Relative clauses with ku",
    stage: "A2.2",
    rule: "A relative clause is introduced by ku. The antecedent (the noun described) stands in the construct state, so it carries the ezafe: Pirtûka ku min xwend, ya min e (The book that I read is mine), Zilamê ku hat, birayê min e (The man who came is my brother), Mala ku me kirî mezin e (The house that we bought is big). The main clause can follow or precede the relative clause. The construct extender yê/ya/yên often resumes the antecedent: ya min e, yê min e, yên min in.",
    examples: [
      {
        ku: "Pirtûka ku min xwend, ya min e.",
        en: "The book that I read is mine.",
      },
      {
        ku: "Zilamê ku hat, birayê min e.",
        en: "The man who came is my brother.",
      },
      {
        ku: "Mala ku me kirî mezin e.",
        en: "The house that we bought is big.",
      },
      { ku: "Ya ku tu dibêjî rast e.", en: "What you say is true." },
    ],
    commonErrors: [
      "Dropping the ezafe on the antecedent: *Pirtûk ku min xwend.",
      "Using the direct pronoun as the past transitive agent inside the clause: *Pirtûka ku ez xwend.",
      "Using the wrong construct extender: *Pirtûka ku min xwend, yê min e.",
    ],
    sourceRefs: ["TH §30", "RIZ"],
    reviewStatus: "checked",
  },
  {
    id: "G30",
    title: "Reported speech with ku",
    stage: "A2.2",
    rule: "Reported speech uses gotin + ku + the reported clause: Wî got ku ew dê sibê bê (He said that he would come tomorrow), Wê got ku ez nexweş im (She said that I am ill), Min got ku ez birçî me (I said that I am hungry). The tense may stay as in the original, especially when the time reference is still clear; do not backshift automatically as in English. The subject of gotin is oblique in the past: min, te, wî, wê, me, we, wan.",
    examples: [
      {
        ku: "Wî got ku ew dê sibê bê.",
        en: "He said that he would come tomorrow.",
      },
      { ku: "Wê got ku ez nexweş im.", en: "She said that I am ill." },
      { ku: "Min got ku ez birçî me.", en: "I said that I am hungry." },
      { ku: "Wan got ku em dikarin bên.", en: "They said that we can come." },
    ],
    commonErrors: [
      "Using a direct subject with past gotin: *Ew got ku …",
      "Dropping ku: *Wî got ew dê bê.",
      "Backshifting every tense mechanically: *Wê got ku ez nexweş bûm when the illness is still current.",
    ],
    sourceRefs: ["TH §29", "TH §33"],
    reviewStatus: "checked",
  },
  {
    id: "G31",
    title: "Conditional with heke, eger and ger",
    stage: "A2.2",
    rule: "A real condition uses heke, eger or ger plus the present subjunctive: Heke tu bêyî, ez dê bi te re biçim (If you come, I will go with you). Heke hewa baş be, em dê biçin (If the weather is good, we will go). Heke tu nexweş î, divê tu bêhnvedanê bikî (If you are ill, you must rest). The condition can come before or after the main clause. The main clause may be present, future or a modal clause.",
    examples: [
      {
        ku: "Heke tu bêyî, ez dê bi te re biçim.",
        en: "If you come, I will go with you.",
      },
      {
        ku: "Heke hewa baş be, em dê biçin.",
        en: "If the weather is good, we will go.",
      },
      {
        ku: "Heke tu nexweş î, divê tu bêhnvedanê bikî.",
        en: "If you are ill, you must rest.",
      },
      {
        ku: "Ger tu bixwazî, em dikarin li vir bimînin.",
        en: "If you want, we can stay here.",
      },
    ],
    commonErrors: [
      "Using the indicative after heke: *Heke tu têyî.",
      "Using the past in a real condition: *Heke tu hatî.",
      "Forgetting the main-clause particle dê when the result is future: *Heke tu bêyî, ez bi te re biçim.",
    ],
    sourceRefs: ["TH §16.1", "TH §25.1"],
    reviewStatus: "checked",
  },
  {
    id: "G32",
    title: "High-frequency subordinators",
    stage: "A2.2",
    rule: "Berî ku means 'before', piştî ku 'after', dema ku 'when', da ku / ji bo ku 'so that', and ji ber ku 'because'. The verb after berî ku, piştî ku and da ku is normally subjunctive: Berî ku em biçin, divê em bilêtan bikirin (Before we go, we must buy tickets). Piştî ku em gihîştin, em li otêlê man (After we arrived, we stayed at the hotel). Ez dixebitim da ku ez fêr bibim (I work so that I learn). Dema ku and ji ber ku can take the indicative.",
    examples: [
      {
        ku: "Berî ku em biçin, divê em bilêtan bikirin.",
        en: "Before we go, we must buy tickets.",
      },
      {
        ku: "Piştî ku em gihîştin, em li otêlê man.",
        en: "After we arrived, we stayed at the hotel.",
      },
      { ku: "Ez dixebitim da ku ez fêr bibim.", en: "I work so that I learn." },
      {
        ku: "Ez hatim ji ber ku te telefon kir.",
        en: "I came because you called.",
      },
    ],
    commonErrors: [
      "Using the indicative after berî ku: *Berî ku em diçin.",
      "Confusing berî ku (before) with piştî ku (after).",
      "Using da ku with a past verb when the purpose is still future: *Ez hatim da ku alîkarî kir.",
    ],
    sourceRefs: ["TH §29", "CHY"],
    reviewStatus: "checked",
  },
];
