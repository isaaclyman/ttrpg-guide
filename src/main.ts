import "./style.scss";
import "./table.scss";
import rpgs from "../data.json";
import { columns } from "./headers";
import {
  DownloadModule,
  EditModule,
  ExportModule,
  FilterModule,
  FormatModule,
  FrozenColumnsModule,
  MoveColumnsModule,
  PopupModule,
  ResizeTableModule,
  SortModule,
  Tabulator,
} from "tabulator-tables";

rpgs.sort((rpg1, rpg2) => {
  return rpg1.subreddit_size < rpg2.subreddit_size
    ? 1
    : rpg1.subreddit_size > rpg2.subreddit_size
    ? -1
    : 0;
});

Tabulator.registerModule([
  DownloadModule,
  EditModule,
  ExportModule,
  FilterModule,
  FormatModule,
  FrozenColumnsModule,
  MoveColumnsModule,
  PopupModule,
  ResizeTableModule,
  SortModule,
]);

const table = new Tabulator("#rpgtable", {
  columns,
  data: rpgs,
  initialSort: [{ column: "popularity", dir: "desc" }],
  movableColumns: true,
});

function handleMobileScreens() {
  const mobileMode = window.innerWidth < 800;
  table.updateColumnDefinition("name", {
    ...columns[0],
    frozen: !mobileMode,
  });

  if (mobileMode) {
    document.querySelector("#desktop-info")?.classList.remove("hidden");
  } else {
    document.querySelector("#desktop-info")?.classList.add("hidden");
  }
}

table.on("tableBuilt", () => {
  handleMobileScreens();

  addEventListener("resize", handleMobileScreens);

  table.redraw();
  setTimeout(() => {
    table.redraw();
  }, 500);
});

function searchMatchesRow(data: any, {searchText}: { searchText: string }): boolean {
  const searchable = [
    data.name,
    data.core_setting,
    data.largest_subreddit,
    data.known_for,
    data.core_mechanic,
    ...data.core_books?.map((bk: any) => bk.title),
    data.license && data.license.is_permissive
      ? "Permissive license"
      : data.license && !data.license.is_permissive
      ? "Limited license"
      : "No license found",
    (data.license && data.license.display) ?? '',
    data.srd_url ?? '',
    data.most_famous_property,
    data.crunch,
    data.owner,
    data.timeline
  ].join('\n');

  return searchable.toLowerCase().includes(searchText.toLowerCase());
}

const searchInput = document.querySelector(
  "#search"
) as HTMLInputElement | null;
if (searchInput) {
  searchInput.addEventListener("input", (event) => {
    const text = (event.target as HTMLInputElement).value;
    if (typeof text !== "string" || !text?.trim()) {
      table.clearFilter(false);
    } else {
      table.setFilter(searchMatchesRow, { searchText: text });
    }
  });
}

const downloadJson = document.querySelector('#download-json') as HTMLAnchorElement | null;
if (downloadJson) {
  downloadJson.addEventListener('click', (_) => {
    table.download('json', `TTRPG Guide ${new Date().toLocaleString()}.json`);
  });
}

const downloadHtml = document.querySelector('#download-html') as HTMLAnchorElement | null;
if (downloadHtml) {
  downloadHtml.addEventListener('click', (_) => {
    table.download('html', `TTRPG Guide ${new Date().toLocaleString()}.html`);
  });
}

const downloadCsv = document.querySelector('#download-csv') as HTMLAnchorElement | null;
if (downloadCsv) {
  downloadCsv.addEventListener('click', (_) => {
    table.download('csv', `TTRPG Guide ${new Date().toLocaleString()}.csv`);
  });
}