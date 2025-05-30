import { ColumnDefinition, Formatter, RowComponent } from "tabulator-tables";
import { colorsByTag } from "./tags";
import { maxBy } from "./utils";

const crunchAmounts = [
  "low ",
  "medium-low ",
  "medium ",
  "medium-high ",
  "high ",
];

const yearMatcher = /^[0-9]+/i;

const numberFormatter = new Intl.NumberFormat();

const formatMissingCharacterInfo: Formatter = (cell) => {
  const contents = cell.getValue() as string;
  if (!contents) {
    const anchor = document.createElement("a");
    anchor.classList.add("tag-link");
    anchor.innerText = "Help us describe this game!";
    anchor.href = "https://github.com/isaaclyman/ttrpg-guide/issues/19";
    anchor.target = "_blank";
    return anchor;
  }

  return contents;
};

interface Community {
  label: string;
  url: string;
  size: number;
}

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
    field: "communities",
    title: "Communities",
    headerSortTristate: true,
    formatter: function (cell) {
      const communities = cell.getData().communities as Community[];
      communities.sort((comm1, comm2) => {
        return comm1.size < comm2.size ? 1 : comm1.size > comm2.size ? -1 : 0;
      });

      const container = document.createElement("div");

      for (const community of communities) {
        const commLine = document.createElement("div");

        const sizeSpan = document.createElement("span");
        const size = numberFormatter.format(community.size);
        sizeSpan.innerText = `${size} - `;
        commLine.appendChild(sizeSpan);
        
        const link = document.createElement("a");
        link.href = community.url;
        link.innerText = community.label;
        commLine.appendChild(link);

        container.appendChild(commLine);
      }

      return container;
    },
    sorter: function (comms1: Community[], comms2: Community[]) {
      const largest1 = maxBy(comms1, c => c.size);
      const largest2 = maxBy(comms2, c => c.size);

      return largest1.size > largest2.size ? 1 : largest1.size < largest2.size ? -1 : 0;
    }
  },
  {
    field: "tags",
    title: "Tags",
    headerSort: false,
    formatter: function (cell) {
      const tags = cell.getValue() as string[];
      if (!tags || !tags.length) {
        const anchor = document.createElement("a");
        anchor.classList.add("tag-link");
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
        tagElement.style.color =
          definition.text == "dark" ? "#101010" : "#DEDEDE";
        tagElement.innerText = tag;
        tagElement.title = definition.tooltip;
        container.appendChild(tagElement);
      }

      return container;
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
    field: "character_comp",
    title: "Character Composition",
    formatter: formatMissingCharacterInfo,
    headerSort: false,
  },
  {
    field: "character_progression",
    title: "Character Progression",
    formatter: formatMissingCharacterInfo,
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
        return (
          (license !== null ? 2 : 0) +
          (license?.is_permissive ? 2 : 0) +
          (row.getData().srd_url !== null ? 1 : 0)
        );
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
