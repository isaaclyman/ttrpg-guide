import { ColumnDefinition, RowComponent } from "tabulator-tables";

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
    field: "popularity",
    title: "Popularity",
    visible: false,
    sorter: function (_, __, aRow, bRow) {
      function getSize(row: RowComponent) {
        const data = row.getData();
        return Math.max(data.subreddit_size, data.discord_size);
      }
      
      const aSize = getSize(aRow);
      const bSize = getSize(bRow);
      return aSize - bSize;
    }
  },
  {
    field: "subreddit_size",
    title: "Subreddit",
    headerSortTristate: true,
    formatter: function (cell) {
      const sub =  cell.getRow().getData().largest_subreddit;
      const size = cell.getValue();
      if (!sub || !size) {
        return "???";
      }

      const container = document.createElement('div');
      
      const sizeText = document.createElement('div');
      sizeText.innerText = numberFormatter.format(Number(size));
      container.appendChild(sizeText);

      const subLink = document.createElement('a');
      subLink.innerText = sub;
      subLink.href = `https://reddit.com/${sub}`;
      subLink.target = '_blank';
      container.appendChild(subLink);

      return container;
    },
    sorter: 'number'
  },
  {
    field: "discord_size",
    title: "Discord",
    sorter: 'number',
    headerSortTristate: true,
    formatter: function (cell) {
      const url = cell.getRow().getData().discord_url
      const size = cell.getValue();
      if (!url || !size) {
        return "???";
      }

      const container = document.createElement('div');
      
      const sizeText = document.createElement('div');
      sizeText.innerText = numberFormatter.format(Number(size));
      container.appendChild(sizeText);

      const subLink = document.createElement('a');
      subLink.innerText = "Discord";
      subLink.href = url;
      subLink.target = '_blank';
      container.appendChild(subLink);

      return container;
    }
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
