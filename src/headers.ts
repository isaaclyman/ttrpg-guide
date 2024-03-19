export interface Header {
  csvHeader: string;
  display: string;
  popoverText?: string;
}

export const headers: Header[] = [{
  csvHeader: "name",
  display: " "
}, {
  csvHeader: "core_setting",
  display: "Core Setting"
}, {
  csvHeader: "largest_subreddit",
  display: "Largest Subreddit"
}, {
  csvHeader: "subreddit_size",
  display: "Subreddit Size"
}, {
  csvHeader: "known_for",
  display: "Claim to Fame"
}, {
  csvHeader: "core_mechanic",
  display: "Core Mechanic"
}, {
  csvHeader: "price_of_entry",
  display: "Price of Entry (PDF)"
}, {
  csvHeader: "is_open_licensed",
  display: "Open-licensed rules?"
}, {
  csvHeader: "most_famous_property",
  display: "Most Famous Properties"
}, {
  csvHeader: "crunch",
  display: "Amount of Crunch",
  popoverText: `"Crunch" is short for number-crunching. It refers to the complexity and granularity of the rules.`
}, {
  csvHeader: "owner",
  display: "Owner"
}, {
  csvHeader: "timeline",
  display: "Timeline"
}];
