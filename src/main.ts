import "./style.scss";
import rpgs from "../data.json";
import { columns } from "./headers";
import {
  DownloadModule,
  ExportModule,
  FilterModule,
  FormatModule,
  FrozenColumnsModule,
  MoveColumnsModule,
  PopupModule,
  SortModule,
  Tabulator,
} from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";
import "tabulator-tables/dist/css/tabulator_midnight.min.css";

rpgs.sort((rpg1, rpg2) => {
  return rpg1.subreddit_size < rpg2.subreddit_size
    ? 1
    : rpg1.subreddit_size > rpg2.subreddit_size
    ? -1
    : 0;
});

Tabulator.registerModule([
  DownloadModule,
  ExportModule,
  FilterModule,
  FormatModule,
  FrozenColumnsModule,
  MoveColumnsModule,
  PopupModule,
  SortModule,
]);

const table = new Tabulator("#rpgtable", {
  columns,
  data: rpgs,
  initialSort: [{ column: "subreddit_size", dir: "desc" }],
  movableColumns: true
});

setTimeout(() => {
  table.redraw();
}, 500);