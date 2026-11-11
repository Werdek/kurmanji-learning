/**
 * A2.1 grammar points used by Units 7–9.
 * Rule text is written for learners; citations point to the ledger in
 * LINGUISTIC_RESOURCES.md.
 */

export const a21Grammar = [
  {
    id: "G21",
    title: "Simple past of intransitive verbs",
    stage: "A2.1",
    rule: "The simple past of an intransitive verb uses the past stem plus the personal endings -im, -î, -, -in, -in, -in: ez hatim, tu hatî, ew hat, em hatin, hûn hatin, ew hatin. Many verbs change stem: çûn → ez çûm, tu çûyî, ew çû; man → ez mam, tu mayî, ew ma; rabûn → ez rabûm; rûniştin → ez rûniştim; vegerîn → ez vegeriyam. Negate with ne-: ez nehatim, ez neçûm, ez nemam. Because these verbs are intransitive, the subject stays in the direct case (ez, tu, ew).",
    examples: [
      { ku: "Ez duh hatim.", en: "I came yesterday." },
      { ku: "Ew dereng çû.", en: "He/she went late." },
      { ku: "Em li gund man.", en: "We stayed in the village." },
      { ku: "Tu kengî vegeriyayî?", en: "When did you return?" },
    ],
    commonErrors: [
      "Using an oblique pronoun with an intransitive past: *Min hatim.",
      "Using the present stem instead of the past stem: *Ez hatim for çûn.",
      "Forgetting the plural ending -in: *Em hat.",
    ],
    sourceRefs: ["TH §18", "CHY"],
    reviewStatus: "checked",
  },
  {
    id: "G22",
    title: "Past copula bûn",
    stage: "A2.1",
    rule: "The past copula is bûn: ez bûm, tu bûyî, ew bû, em bûn, hûn bûn, ew bûn. It describes a past state or a past location: Ez li malê bûm (I was at home), Ew nexweş bû (He/she was ill), Em li gund bûn (We were in the village). The negative is nebûm, nebûyî, nebû, nebûn: Ez li malê nebûm (I was not at home). Do not confuse bûn with the present copula im/î/e/in.",
    examples: [
      { ku: "Ez duh li malê bûm.", en: "I was at home yesterday." },
      { ku: "Ew nexweş bû.", en: "He/she was ill." },
      {
        ku: "Em heta êvarê li gund bûn.",
        en: "We were in the village until evening.",
      },
      { ku: "Ez li malê nebûm.", en: "I was not at home." },
    ],
    commonErrors: [
      "Using the present copula for a past state: *Ez duh li malê me.",
      "Adding the past ending to the wrong person: *Ez bû.",
      "Placing ne- after the copula: *Ez bûm ne li malê.",
    ],
    sourceRefs: ["TH §18", "CHY"],
    reviewStatus: "checked",
  },
  {
    id: "G23",
    title: "Split ergativity in the past transitive",
    stage: "A2.1",
    rule: "In the past tense of a transitive verb, the agent is expressed by an oblique pronoun: min, te, wî, wê, me, we, wan. The patient (the thing acted on) stays in the direct case, and the verb agrees with the patient, not with the agent. Min nan xwar (I ate bread), Te name nivîsî (You wrote a letter), Wan em dîtin (They saw us). This is split ergativity: the present uses direct subjects, while the past transitive uses oblique agents.",
    examples: [
      { ku: "Min nan xwar.", en: "I ate bread." },
      { ku: "Te name nivîsî.", en: "You wrote a letter." },
      { ku: "Wan em dîtin.", en: "They saw us." },
      { ku: "Me av vexwar.", en: "We drank water." },
    ],
    commonErrors: [
      "Using a direct pronoun as the past transitive agent: *Ez nan xwar.",
      "Using an oblique pronoun with an intransitive verb: *Min hatim.",
      "Making the verb agree with the agent instead of the patient: *Min ew dîtin for one person.",
    ],
    sourceRefs: ["TH §18.2", "RIZ"],
    reviewStatus: "checked",
  },
  {
    id: "G24",
    title: "Patient agreement in the ergative past",
    stage: "A2.1",
    rule: "In the past transitive, the verb agrees with the patient in person and number. A singular third-person patient takes the bare stem: Min ew dît (I saw him/her). A plural patient takes -in: Min ew dîtin (I saw them). A first-person patient takes -im: Te ez dîtim (You saw me). A second-person patient takes -î: Min tu dîtî (I saw you). With a plural noun patient, use the plural ending: Min du kitêb xwendin (I read two books).",
    examples: [
      { ku: "Min ew dît.", en: "I saw him/her." },
      { ku: "Min ew dîtin.", en: "I saw them." },
      { ku: "Te ez dîtim.", en: "You saw me." },
      { ku: "Min du kitêb xwendin.", en: "I read two books." },
    ],
    commonErrors: [
      "Using a singular verb with a plural patient: *Min du kitêb xwend.",
      "Using the agent's person on the verb: *Min ez dîtim for 'I saw myself'.",
      "Dropping the -î ending when the patient is tu: *Min tu dît.",
    ],
    sourceRefs: ["TH §18.3", "RIZ"],
    reviewStatus: "checked",
  },
  {
    id: "G25",
    title: "Ezafe chains and the construct extender yê/ya/yên",
    stage: "A2.1",
    rule: "A noun can carry more than one ezafe. Each link agrees with the head noun: mala mezin a sor (the big red house, feminine), xaniyê mezin ê sor (the big red house, masculine), hevalên baş ên min (my good friends, plural). When the next word is a pronoun or a nominalised adjective, the ezafe is replaced by the construct extender yê (masculine), ya (feminine) or yên (plural): yê min (mine, m), ya min (mine, f), yên min (mine, pl), ya sor (the red one, f).",
    examples: [
      { ku: "Mala mezin a sor.", en: "The big red house." },
      { ku: "Xaniyê mezin ê sor.", en: "The big red house." },
      { ku: "Hevalên baş ên min.", en: "My good friends." },
      { ku: "Pirtûka nû ya min.", en: "My new book." },
    ],
    commonErrors: [
      "Using the masculine ezafe with a feminine head noun: *mala mezin ê sor.",
      "Dropping the second ezafe in a chain: *mala mezin sor.",
      "Using ên before a singular noun: *kitêba nû ên min.",
    ],
    sourceRefs: ["TH §4.1", "TH §5"],
    reviewStatus: "checked",
  },
  {
    id: "G26",
    title: "Modals: karîn, xwestin, divê and gerek",
    stage: "A2.1",
    rule: "Modals are followed by the present subjunctive. Karîn means 'to be able': Ez dikarim biaxivim (I can speak); negative Ez nikarim biaxivim. Xwestin means 'to want': Ez dixwazim biçim (I want to go). Divê means 'must': Divê ez biçim (I must go); Divê tu bixebitî. Gerek e means 'it is necessary': Gerek e em vegerin. Pêdivî bi ... heye expresses need: Pêdiviya min bi alîkariyê heye.",
    examples: [
      { ku: "Ez dikarim biaxivim.", en: "I can speak." },
      { ku: "Divê ez biçim.", en: "I must go." },
      { ku: "Gerek e em vegerin.", en: "We have to return." },
      { ku: "Pêdiviya min bi alîkariyê heye.", en: "I need help." },
    ],
    commonErrors: [
      "Using the indicative after a modal: *Ez dikarim diaxivim.",
      "Putting the modal after the main verb: *Ez biçim dixwazim.",
      "Using divê with a past tense: *Divê ez çûm.",
    ],
    sourceRefs: ["TH §16", "TH §16.1", "TH §16.3"],
    reviewStatus: "checked",
  },
  {
    id: "G27",
    title: "Present subjunctive",
    stage: "A2.1",
    rule: "The present subjunctive adds bi- to the present stem: bixwim, bixwî, bixwe, bixwin; biçim, biçî, biçe, biçin; bikim, bikî, bike, bikin; biaxivim. Some very common verbs use a suppletive stem: hatin → bêm, bêyî, bê, bên. The negative replaces bi- with ne-: neçim, nexwim, nebêjim. Bila + subjunctive expresses a wish or indirect command: Bila ew were (Let him/her come).",
    examples: [
      { ku: "Ez bixwim.", en: "Let me eat / I should eat." },
      { ku: "Tu bixwî.", en: "You should eat." },
      { ku: "Ez neçim.", en: "I should not go." },
      { ku: "Bila ew were.", en: "Let him/her come." },
    ],
    commonErrors: [
      "Using the indicative after divê: *Divê ez diçim.",
      "Using ne- with the wrong stem: *nehatim for 'I should not come'.",
      "Forgetting the suppletive b- forms of hatin: *Ez hatin.",
    ],
    sourceRefs: ["TH §16", "TH §17"],
    reviewStatus: "checked",
  },
];
