import { ColumnDefinition, RowComponent } from "tabulator-tables";
import { colorsByTag } from "./tags";

const crunchAmounts = [
  "low ",
  "medium-low ",
  "medium ",
  "medium-high ",
  "high ",
];

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
    },
  },
  {
    field: "subreddit_size",
    title: "Subreddit",
    headerSortTristate: true,
    formatter: function (cell) {
      const sub = cell.getData().largest_subreddit;
      const size = cell.getValue();
      if (!sub || !size) {
        return "???";
      }

      const container = document.createElement("div");

      const sizeText = document.createElement("div");
      sizeText.innerText = numberFormatter.format(Number(size));
      container.appendChild(sizeText);

      const subLink = document.createElement("a");
      subLink.innerText = sub;
      subLink.href = `https://reddit.com/${sub}`;
      subLink.target = "_blank";
      container.appendChild(subLink);

      return container;
    },
    sorter: "number",
  },
  {
    field: "discord_size",
    title: "Discord",
    sorter: "number",
    headerSortTristate: true,
    formatter: function (cell) {
      const url = cell.getData().discord_url;
      const size = cell.getValue();
      if (!url || !size) {
        return "???";
      }

      const container = document.createElement("div");

      const sizeText = document.createElement("div");
      sizeText.innerText = numberFormatter.format(Number(size));
      container.appendChild(sizeText);

      const subLink = document.createElement("a");
      subLink.innerText = "Discord";
      subLink.href = url;
      subLink.target = "_blank";
      container.appendChild(subLink);

      return container;
    },
  },
  {
    field: "tags",
    title: "Tags",
    formatter: function (cell) {
      const tags = cell.getValue() as string[];
      if (!tags || !tags.length) {
        const anchor = document.createElement("a");
        anchor.innerText = "Help us tag this game!";
        anchor.href = "https://github.com/isaaclyman/ttrpg-guide/issues/3";
        anchor.target = "_blank";
        return anchor;
      }

      const container = document.createElement("div");
      for (const tag of tags) {
        const tagElement = document.createElement("div");
        const definition = colorsByTag[tag] ?? {};
        tagElement.classList.add("tag");
        tagElement.style.backgroundColor = definition.bgColor;
        tagElement.style.color = definition.text == 'dark' ? '#101010' : '#DEDEDE';
        tagElement.innerText = tag;
        tagElement.title = definition.tooltip;
        container.appendChild(tagElement);
      }

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
    sorter: "number",
    formatter: function (cell) {
      const books = cell.getData().core_books;
      if (!books) {
        return "???";
      }

      const container = document.createElement("div");

      for (const book of books) {
        const bookDiv = document.createElement("div");
        const anchor = document.createElement("a");
        anchor.innerText = `${book.price}—${book.title}`;
        anchor.href = book.url;
        anchor.target = "_blank";
        bookDiv.appendChild(anchor);
        container.appendChild(bookDiv);
      }

      return container;
    },
    formatterParams: {
      labelField: "price_of_entry",
      urlField: "purchase_url",
      target: "_blank",
    },
  },
  {
    field: "license",
    title: "License",
    headerSortTristate: true,
    formatter: function (cell) {
      const srdUrl = cell.getData().srd_url;
      const license = cell.getValue();
      if (!srdUrl && !license) {
        return "❌ No license found";
      }

      const container = document.createElement("div");

      if (license) {
        const permissiveLine = document.createElement("div");
        permissiveLine.innerText = license.is_permissive
          ? "✅ Permissive license"
          : "⛓️ Limited license";
        container.appendChild(permissiveLine);

        const licenseLine = document.createElement("div");
        const licenseAnchor = document.createElement("a");
        licenseAnchor.innerText = license.display;
        licenseAnchor.href = license.url;
        licenseAnchor.target = "_blank";
        licenseLine.appendChild(licenseAnchor);
        container.appendChild(licenseLine);
      } else {
        const noLicenseLine = document.createElement("div");
        noLicenseLine.innerText = "❌ No license found";
        container.appendChild(noLicenseLine);
      }

      if (srdUrl) {
        const srdLine = document.createElement("div");
        const srdAnchor = document.createElement("a");
        srdAnchor.innerText = "System Reference Document";
        srdAnchor.href = srdUrl;
        srdAnchor.target = "_blank";
        srdLine.appendChild(srdAnchor);
        container.appendChild(srdLine);
      }

      return container;
    },
    sorter: function (aLicense, bLicense, aRow, bRow) {
      function getValue(license: any, row: RowComponent): number {
        return (license !== null ? 2 : 0) + (license?.is_permissive ? 2 : 0) + (row.getData().srd_url !== null ? 1 : 0);
      }
      const aValue = getValue(aLicense, aRow);
      const bValue = getValue(bLicense, bRow);

      return aValue - bValue;
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
