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
  initialSort: [{ column: "subreddit_size", dir: "desc" }],
  movableColumns: true,
});

function handleMobileScreens() {
  const mobileMode = window.innerWidth < 800;
  table.updateColumnDefinition("name", {
    ...columns[0],
    frozen: !mobileMode,
  });

  if (mobileMode) {
    document.querySelector('#desktop-info')?.classList.remove('hidden');
  } else {
    document.querySelector('#desktop-info')?.classList.add('hidden');
  }
}

table.on('tableBuilt', () => {
  handleMobileScreens();
  
  addEventListener('resize', handleMobileScreens);

  table.redraw();
  setTimeout(() => {
    table.redraw();
  }, 500);
})
