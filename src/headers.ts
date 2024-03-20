import { ColumnDefinition } from "tabulator-tables";

const crunchAmounts = [
  "low ",
  "medium-low ",
  "medium ",
  "medium-high ",
  "high ",
];

const priceMatcher = /^\$([0-9]+)/i;
const yearMatcher = /^[0-9]+/i;

const numberFormatter = new Intl.NumberFormat();

export const columns: ColumnDefinition[] = [
  {
    field: "name",
    title: "System",
    frozen: true,
    headerSortTristate: true,
  },
  {
    field: "most_famous_property",
    title: "Most Famous Properties",
    headerSort: false,
  },
  {
    field: "largest_subreddit",
    title: "Largest Subreddit",
    headerSort: false,
    formatter: 'link',
    formatterParams: function(cell) {
      return {
        labelField: 'largest_subreddit',
        url: `https://reddit.com/${cell.getValue()}`,
        target: '_blank',
      }
    }
  },
  {
    field: "subreddit_size",
    title: "Subreddit Size",
    sorter: "number",
    headerSortTristate: true,
    formatter: function (cell): string {
      return numberFormatter.format(cell.getValue());
    },
  },
  {
    field: "known_for",
    title: "Claim to Fame",
    headerSort: false,
  },
  {
    field: "core_setting",
    title: "Core Setting",
    headerSortTristate: true,
  },
  {
    field: "crunch",
    title: "Amount of Crunch",
    headerSortTristate: true,
    sorter: function (a: string, b: string) {
      const aIndex = crunchAmounts.findIndex((amt) =>
        a.toLowerCase().startsWith(amt)
      );
      const bIndex = crunchAmounts.findIndex((amt) =>
        b.toLowerCase().startsWith(amt)
      );

      if (aIndex === bIndex) {
        return 0;
      }

      if (aIndex === -1) {
        return 1;
      }

      if (bIndex === -1) {
        return -1;
      }

      return aIndex - bIndex;
    },
    headerPopup: `"Crunch" is short for "number-crunching." High-crunch games have very complex and granular rules.`,
    headerPopupIcon: `ⓘ`,
  },
  {
    field: "core_mechanic",
    title: "Core Mechanic",
    headerSort: false,
  },
  {
    field: "price_of_entry",
    title: "Price of Entry (PDF)",
    headerSortTristate: true,
    sorter: function (a: string, b: string) {
      const aPrice = a.toLowerCase().startsWith("free")
        ? "0"
        : priceMatcher.exec(a)?.[1];
      const bPrice = b.toLowerCase().startsWith("free")
        ? "0"
        : priceMatcher.exec(b)?.[1];

      if (aPrice === bPrice) {
        return 0;
      }

      if (!aPrice) {
        return 1;
      }

      if (!bPrice) {
        return -1;
      }

      return Number(aPrice) - Number(bPrice);
    },
    formatter: "link",
    formatterParams: {
      labelField: "price_of_entry",
      urlField: "purchase_url",
      target: "_blank"
    }
  },
  {
    field: "is_open_licensed",
    title: "Open-licensed rules?",
    headerSortTristate: true,
    formatter: function(cell) {
      const url = cell.getRow().getData().srd_url;
      if (!url) {
        return cell.getValue();
      }

      const anchor = document.createElement('a');
      anchor.innerText = cell.getValue();
      anchor.href = url;
      return anchor;
    },
    formatterParams: {
      labelField: "is_open_licensed",
      urlField: "srd_url",
      target: "_blank",
    },
  },
  {
    field: "owner",
    title: "Owner",
    headerSortTristate: true,
  },
  {
    field: "timeline",
    title: "Timeline",
    headerSortTristate: true,
    sorter: function (a: string, b: string) {
      const aYear = yearMatcher.exec(a)?.[0];
      const bYear = yearMatcher.exec(b)?.[0];
      if (aYear === bYear) {
        return 0;
      }

      if (!aYear) {
        return 1;
      }

      if (!bYear) {
        return -1;
      }

      return Number(aYear) - Number(bYear);
    },
  },
] as ColumnDefinition[];
