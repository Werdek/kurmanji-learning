/**
 * A1.2 grammar points used by Units 4–6.
 * Rule text is written for learners; citations point to the ledger in
 * LINGUISTIC_RESOURCES.md.
 */

export const a12Grammar = [
  {
    id: "G13",
    title: "Telling the time",
    stage: "A1.2",
    rule: "Ask Saet çend e? ('What time is it?'). The answer uses Saet + number + e: Saet du e (It is two o'clock). For half past, use û nîv: Saet du û nîv e (half past two). For minutes past, add û + number: Saet sê û pênc e (five past three). For 'to the hour', use kêm: Saet çar kêm deh e (ten to four). Saet means both 'hour' and 'clock'; deqîqe means 'minute'.",
    examples: [
      { ku: "Saet yek e.", en: "It is one o'clock." },
      { ku: "Saet du û nîv e.", en: "It is half past two." },
      { ku: "Saet sê û pênc e.", en: "It is five past three." },
      { ku: "Saet pênc kêm deh e.", en: "It is ten to five." },
    ],
    commonErrors: [
      "Omitting the final copula e: *Saet du.",
      "Confusing nîv (half) with nîvro (noon).",
      "Putting kêm before the hour instead of before the minutes.",
    ],
    sourceRefs: ["TH §9", "CHY"],
    reviewStatus: "checked",
  },
  {
    id: "G14",
    title: "Days, months and frequency",
    stage: "A1.2",
    rule: "The days are duşem, sêşem, çarşem, pêncşem, în, şemî and yekşem. Months include rêbendan, reşemî, adar, avrêl, gulan, hezîran, tîrmeh, tebax, rezber, kewçêr, sermawez and berfanbar. Frequency adverbs include her roj (every day), tim (always), pir caran (often), carinan (sometimes), kêm caran (rarely) and qet (never). Adverbs normally come before the verb.",
    examples: [
      {
        ku: "Duşem roja yekem a hefteyê ye.",
        en: "Monday is the first day of the week.",
      },
      { ku: "Ez her roj dixebitim.", en: "I work every day." },
      { ku: "Ew carinan dereng tê.", en: "He/she sometimes comes late." },
      { ku: "Ez qet naçim wir.", en: "I never go there." },
    ],
    commonErrors: [
      "Using roj alone for a named day of the week.",
      "Placing qet after the verb instead of before it.",
      "Mixing sibeh (morning) with sibê (tomorrow).",
    ],
    sourceRefs: ["TH §9", "CHY"],
    reviewStatus: "checked",
  },
  {
    id: "G15",
    title: "Location with li and postpositions",
    stage: "A1.2",
    rule: "Location is expressed with li ('in/at') and postpositions that follow the noun: li malê (at home), li bajar (in the city), li ser maseyê (on the table), li bin kursiyê (under the chair), li pêş malê (in front of the house), li paş malê (behind the house), li nav odeyê (inside the room), li cem te (next to you). Many postpositions require the oblique case on the following noun.",
    examples: [
      { ku: "Ez li malê me.", en: "I am at home." },
      { ku: "Pirtûk li ser maseyê ye.", en: "The book is on the table." },
      { ku: "Zarok li bin darê ne.", en: "The children are under the tree." },
      {
        ku: "Dikan li pêş meydanê ye.",
        en: "The shop is in front of the square.",
      },
    ],
    commonErrors: [
      "Putting the postposition before the noun: *li ser mase rather than li ser maseyê.",
      "Omitting li in a location phrase.",
      "Using the direct form where the postposition needs the oblique.",
    ],
    sourceRefs: ["TH §17", "TH §18"],
    reviewStatus: "checked",
  },
  {
    id: "G16",
    title: "Imperatives",
    stage: "A1.2",
    rule: "The singular imperative is the bare verb stem: here! (go!), were! (come!), bide! (give!), bixwe! (eat!), vexwe! (drink!), bigere! (search!), raweste! (stop!). The plural or polite imperative adds -in: herin!, werin!, bidin!, bixwin!, vexwin!, bigerin!, rawestin!. Negative imperatives use ne-: neçe! (don't go!), neyê! (don't come!), nedin! (don't give!).",
    examples: [
      { ku: "Here rastê!", en: "Go straight ahead!" },
      { ku: "Were malê!", en: "Come home!" },
      { ku: "Ji kerema xwe, avê bide min.", en: "Please give me water." },
      { ku: "Neçe wir!", en: "Do not go there!" },
    ],
    commonErrors: [
      "Using the infinitive as an imperative: *çûn instead of here.",
      "Forgetting -in in a polite plural command.",
      "Using na- instead of ne- in a prohibition.",
    ],
    sourceRefs: ["TH §16", "CHY"],
    reviewStatus: "checked",
  },
  {
    id: "G17",
    title: "Adjectives, colours and the ezafe",
    stage: "A1.2",
    rule: "An adjective normally follows its noun and is linked by the ezafe: mala mezin (the big house), kurê ciwan (the handsome boy), keça mezin (the big girl). The ezafe agrees with the noun: -ê for masculine singular, -a for feminine singular, -ên for plural. Colours are adjectives: kirasê sor (the red shirt), sola reş (the black shoe), cilên şîn (the blue clothes).",
    examples: [
      { ku: "mala mezin", en: "the big house" },
      { ku: "kurê ciwan", en: "the handsome boy" },
      { ku: "keça mezin", en: "the big girl" },
      { ku: "kirasê sor", en: "the red shirt" },
      { ku: "solên reş", en: "the black shoes" },
    ],
    commonErrors: [
      "Putting the adjective before the noun as in English.",
      "Using the masculine ezafe with a feminine noun.",
      "Dropping the ezafe between noun and adjective.",
    ],
    sourceRefs: ["TH §4", "TH §5"],
    reviewStatus: "checked",
  },
  {
    id: "G18",
    title: "Comparatives with -tir",
    stage: "A1.2",
    rule: "Add -tir to the adjective to form a comparative: mezin → mezintir (bigger), piçûk → piçûktir (smaller), biha → bihatir (more expensive), erzan → erzantir (cheaper), baş → baştir (better). The standard of comparison is marked with ji: Ev mal ji wê mezintir e (This house is bigger than that one). The superlative uses herî + adjective: herî mezin (the biggest).",
    examples: [
      {
        ku: "Ev kiras ji yê sor erzantir e.",
        en: "This shirt is cheaper than the red one.",
      },
      { ku: "Kurê min ji min dirêjtir e.", en: "My son is taller than me." },
      { ku: "Ev herî baş e.", en: "This one is the best." },
    ],
    commonErrors: [
      "Using zêde instead of the -tir suffix.",
      "Omitting ji before the standard of comparison.",
      "Adding -tir twice: *mezintirtir.",
    ],
    sourceRefs: ["TH §5", "CHY"],
    reviewStatus: "checked",
  },
  {
    id: "G19",
    title: "Numbers above 20 and prices",
    stage: "A1.2",
    rule: "The tens are bîst (20), sî (30), çil (40), pêncî (50), şêst (60), heftê (70), heştê (80), not (90) and sed (100). Join tens and units with û: bîst û pênc (25), sed û yek (101). Ask Çend e? ('How much is it?') and answer with the amount plus a currency and the copula: Pêncî lîre ye (It is fifty lira). Fractions are nîv (half) and çaryek (quarter).",
    examples: [
      { ku: "bîst û pênc", en: "twenty-five" },
      { ku: "sed û deh", en: "one hundred and ten" },
      { ku: "Çend e?", en: "How much is it?" },
      { ku: "Pêncî lîre ye.", en: "It is fifty lira." },
      { ku: "Du kîlo sê euro ne.", en: "Two kilos are three euros." },
    ],
    commonErrors: [
      "Reversing tens and units: *pênc û bîst for 25.",
      "Omitting the conjunction û between tens and units.",
      "Using the singular copula with a plural price.",
    ],
    sourceRefs: ["TH §9", "CHY"],
    reviewStatus: "checked",
  },
  {
    id: "G20",
    title: "Daily routines and sequencing",
    stage: "A1.2",
    rule: "Daily routines use the present tense with time expressions. Sequence with pêşî (first), paşê (then), dû re (after that) and dawiyê (finally). Common routine verbs are rabûn (get up), şûştin (wash), xwarin (eat), çûn (go), xebitîn (work), vegerîn (return) and razan (sleep). Time expressions include sibehê (in the morning), nîvro (at noon), êvarê (in the evening) and şevê (at night).",
    examples: [
      {
        ku: "Ez sibehê saet heftê radibim.",
        en: "I get up at seven in the morning.",
      },
      { ku: "Paşê ez avê vedixwim.", en: "Then I drink water." },
      { ku: "Ez nîvro nan dixwim.", en: "I eat bread at noon." },
      { ku: "Êvarê ez vedigerim malê.", en: "In the evening I return home." },
    ],
    commonErrors: [
      "Using a past tense for a habitual routine.",
      "Omitting the time expression that anchors the sequence.",
      "Confusing sibeh (morning) with sibê (tomorrow).",
    ],
    sourceRefs: ["TH §13", "TH §19"],
    reviewStatus: "checked",
  },
] as const;
