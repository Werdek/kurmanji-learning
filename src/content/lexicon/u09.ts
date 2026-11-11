/**
 * U9 lexicon — “Xaniyê Nû” (The New Home).
 * Rooms, furniture, chores, neighbourhood and descriptive adjectives.
 */

import { lx } from "./helpers";

export const u09Lexemes = [
  lx("lex.apartman", "apartman", "apartment building", "noun", "m"),
  lx("lex.ode", "ode", "room", "noun", "f"),
  lx("lex.salon", "salon", "living room", "noun", "m"),
  lx("lex.mitbax", "mitbax", "kitchen", "noun", "f"),
  lx("lex.sersok", "serşok", "bathroom", "noun", "f"),
  lx("lex.koridor", "korîdor", "corridor", "noun", "m"),
  lx("lex.qat", "qat", "floor; storey", "noun", "m"),
  lx("lex.ban", "ban", "roof", "noun", "m"),
  lx("lex.deri", "derî", "door", "noun", "m"),
  lx("lex.pace", "pace", "window", "noun", "f"),
  lx("lex.diwar", "dîwar", "wall", "noun", "m"),
  lx("lex.erd", "erd", "floor; ground", "noun", "m"),
  lx("lex.baxce", "baxçe", "garden", "noun", "m"),
  lx("lex.hewdi", "hewdî", "yard", "noun", "f"),
  lx("lex.garaj", "garaj", "garage", "noun", "f"),

  lx("lex.mase", "mase", "table", "noun", "f"),
  lx("lex.kursi", "kursî", "chair", "noun", "f"),
  lx("lex.nivin", "nivîn", "bed", "noun", "f"),
  lx("lex.qenepe", "qenepe", "sofa", "noun", "f"),
  lx("lex.dolab", "dolab", "cupboard; wardrobe", "noun", "m"),
  lx("lex.ref", "ref", "shelf", "noun", "f"),
  lx("lex.televizyon", "televîzyon", "television", "noun", "f"),
  lx("lex.sarinc", "sarinc", "fridge", "noun", "f"),
  lx("lex.sobe", "sobê", "stove", "noun", "f"),
  lx("lex.firne", "firne", "oven", "noun", "f"),
  lx("lex.cira", "çira", "lamp", "noun", "f"),
  lx("lex.balgi", "balgî", "pillow", "noun", "m"),
  lx("lex.betani", "betanî", "blanket", "noun", "f"),
  lx("lex.xali", "xalî", "carpet; rug", "noun", "f"),
  lx("lex.perde", "perde", "curtain", "noun", "f"),
  lx("lex.ayine", "ayîne", "mirror", "noun", "f"),
  lx("lex.tablo", "tablo", "picture", "noun", "f"),

  lx("lex.sup-kirin", "sûp kirin", "to sweep", "verb", undefined, ["CHY"]),
  lx("lex.toz-paqij-kirin", "toz paqij kirin", "to dust", "verb", undefined, [
    "CHY",
  ]),
  lx("lex.rez-kirin", "rêz kirin", "to arrange; to tidy", "verb", undefined, [
    "CHY",
  ]),
  lx("lex.cekirin", "çêkirin", "to make; to cook", "verb", undefined, ["CHY"]),
  lx("lex.avdan", "avdan", "to water", "verb", undefined, ["CHY"]),
  lx(
    "lex.cop-derxistin",
    "çop derxistin",
    "to take out the rubbish",
    "verb",
    undefined,
    ["CHY"],
  ),
  lx(
    "lex.cil-hilanin",
    "cil hilanîn",
    "to hang up laundry",
    "verb",
    undefined,
    ["CHY"],
  ),

  lx("lex.taxa", "taxa", "neighbourhood", "noun", "f"),
  lx("lex.firossgeh", "firoşgeh", "shop", "noun", "f"),
  lx("lex.postexane", "postexane", "post office", "noun", "f"),
  lx("lex.bank", "bank", "bank", "noun", "f"),

  lx("lex.ron", "ron", "bright; lit", "adjective"),
  lx("lex.paqij", "paqij", "clean", "adjective"),
  lx("lex.qirej", "qirêj", "dirty", "adjective"),
  lx("lex.saxlem", "saxlem", "healthy", "adjective"),
  lx("lex.spehi", "spehî", "beautiful", "adjective"),
  lx("lex.aram", "aram", "quiet; calm", "adjective"),
];
