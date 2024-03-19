import "./style.scss";
import Alpine from "alpinejs";
import rpgs from "../data.json";
import { headers } from "./headers";

window.Alpine = Alpine;

rpgs.sort((rpg1, rpg2) => {
  return rpg1.subreddit_size < rpg2.subreddit_size
    ? 1
    : rpg1.subreddit_size > rpg2.subreddit_size
    ? -1
    : 0;
});

Alpine.data("rpgdata", () => ({
  rpgs,
  headers,
}));

Alpine.start();
