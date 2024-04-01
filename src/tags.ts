export interface TagDefinition {
  bgColor: string;
  text: "light" | "dark";
  tooltip: string;
}

/*
  Organizing Principle:
  Two or more tags can have the same color if they're (usually) mutually exclusive.
  For example, a sandbox game is unlikely to be a heist or a mystery.
  Otherwise, go by gut feeling.
*/
export const colorsByTag: { [tagName: string]: TagDefinition } = {
  // DARK RED
  deadly: {
    bgColor: "#7A281B",
    text: "light",
    tooltip: "high risk of PC death"
  },

  // PURPLE
  heist: {
    bgColor: "#57385c",
    text: "light",
    tooltip: "crack team, well-defined mission"
  },
  mystery: {
    bgColor: "#57385c",
    text: "light",
    tooltip: "focused on following clues, gaining information, and resolving a question"
  },
  sandbox: {
    bgColor: "#57385c",
    text: "light",
    tooltip: "encourages open-ended exploration instead of pre-planned adventures"
  },

  // DARK BROWN
  "fast-paced": {
    bgColor: "#463434",
    text: "light",
    tooltip: "not bogged down by complex mechanics; plot progresses quickly"
  },

  // DARK ORANGE
  drama: {
    bgColor: "#7E551B",
    text: "light",
    tooltip: "mature/emotional themes; focused on complicated character relationships"
  },
  pulpy: {
    bgColor: "#7E551B",
    text: "light",
    tooltip: "shallow, unpretentious fun"
  },

  // DARK YELLOW
  "bite-sized": {
    bgColor: "#5E4C19",
    text: "light",
    tooltip: "tiny ruleset"
  },
  "genre-first": {
    bgColor: "#5E4C19",
    text: "light",
    tooltip: "immersive; loyal to genre/setting above all"
  },
  gritty: {
    bgColor: "#5E4C19",
    text: "light",
    tooltip: "not escapist; doesn't gloss over unpleasant/realistic details"
  },

  // LIGHT GREEN
  chaotic: {
    bgColor: "#52baac",
    text: "dark",
    tooltip: "lots of random effects and unpredictable events"
  },
  cinematic: {
    bgColor: "#52baac",
    text: "dark",
    tooltip: "splashy action, high stakes, and unrealistic risks"
  },

  // DARK GREEN
  "low-prep": {
    bgColor: "#1A6A2D",
    text: "light",
    tooltip: "creating an adventure requires much less effort than other systems"
  },
  "zero-prep": {
    bgColor: "#1A6A2D",
    text: "light",
    tooltip: "the GM shouldn't/can't do anything to prepare the session"
  },

  // DARK BLUE
  action: {
    bgColor: "#1B3376",
    text: "light",
    tooltip: "plot-driven; lots of combat/excitement"
  },
  literary: {
    bgColor: "#1B3376",
    text: "light",
    tooltip: "more about characters and artistic themes than action"
  },

  // BLACK
  dark: {
    bgColor: "#000",
    text: "light",
    tooltip: "grim or hopeless tone; thematically heavy content, fear, and/or gore"
  },

  // GRAY
  humor: {
    bgColor: "#3e4a61",
    text: "light",
    tooltip: "encourages frivolous play and joking"
  },
  tactical: {
    bgColor: "#3e4a61",
    text: "light",
    tooltip: "focused on positioning, planning, and using the rules to your advantage"
  },
  toolkit: {
    bgColor: "#3e4a61",
    text: "light",
    tooltip: "free-form, atomic options for designing characters, adventures, and rulesets"
  },
};
