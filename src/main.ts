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

rpgs.forEach(rpg => {
  (rpg as any).searchable = [
    rpg.name,
    rpg.core_setting,
    rpg.largest_subreddit,
    ...rpg.tags,
    rpg.known_for,
    rpg.core_mechanic,
    rpg.character_comp,
    rpg.character_progression,
    ...rpg.core_books?.map((bk: any) => bk.title),
    rpg.license && rpg.license.is_permissive
      ? "Permissive license"
      : rpg.license && !rpg.license.is_permissive
      ? "Limited license"
      : "No license found",
    (rpg.license && rpg.license.display) ?? '',
    rpg.srd_url ?? '',
    rpg.most_famous_property,
    rpg.crunch,
    rpg.owner,
    rpg.timeline
  ].join('\n');
})

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
  const searchable = data.searchable ?? '';
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
    table.download('json', `TTRPG Guide ${new Date().toLocaleDateString()}.json`);
  });
}

const downloadHtml = document.querySelector('#download-html') as HTMLAnchorElement | null;
if (downloadHtml) {
  downloadHtml.addEventListener('click', (_) => {
    table.download('html', `TTRPG Guide ${new Date().toLocaleDateString()}.html`);
  });
}

const downloadCsv = document.querySelector('#download-csv') as HTMLAnchorElement | null;
if (downloadCsv) {
  downloadCsv.addEventListener('click', (_) => {
    table.download('csv', `TTRPG Guide ${new Date().toLocaleDateString()}.csv`);
  });
}