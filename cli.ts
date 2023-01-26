import { Command } from 'https:/deno.land/x/cliffy@v0.25.7/command/mod.ts';
import { Input } from 'https:/deno.land/x/cliffy@v0.25.7/prompt/input.ts';
import { Select } from 'https:/deno.land/x/cliffy@v0.25.7/prompt/select.ts';
import { printImage } from 'https:/x.nest.land/terminal_images@3.0.0/mod.ts';

import { AniList } from './AniList.ts';
import { Client } from './Client.ts';

type manageOption = "manageFeed" | "manageSubscriptions";

await new Command()
  .name("rss-manager")
  .version("0.1.0")
  .description("qBittorrent & AniList RSS manager")
  .arguments("<url: string>")
  .parse(Deno.args);

const url = new URL(Deno.args[0]);

const client = new Client(url);
const aniList = new AniList();

const option = await Select.prompt({
  message: "What do you want to do?",
  options: [
    { name: "Manage RSS Feeds", value: "manageFeed" },
    { name: "Manage Subscriptions", value: "manageSubscriptions" },
  ],
}) as manageOption;

switch (option) {
  case "manageFeed": {
    const feeds = await client.getFeeds();

    // await client.addFeed("https://nyaa.si/?page=rss&u=Judas");
    const selectedFeed = await Select.prompt({
      message: "Select feed to manage",
      options: [...Object.keys(feeds), { value: "NEW", name: "Add new feed" }],
    });

    if (selectedFeed === "NEW") {
      const feedURL = await Input.prompt("Feed URL:");
      await client.addFeed(feedURL);
    } else {
      const selectedFeedItem = await Select.prompt({
        message: `Manage feed ${selectedFeed}`,
        options: feeds[selectedFeed].articles.map((article, index) => {
          return {
            value: index.toString(),
            name: article.title,
          };
        }),
      });

      const aniListID = await Input.prompt(
        `Enter AniList ID for ${
          feeds[selectedFeed].articles[parseInt(selectedFeedItem)].title
        }:`,
      );

      const anime = await aniList.getAnime(aniListID);
      console.log(anime);

      console.log(anime.title.romaji);
      printImage({
        // replace this with the URL or local file path of the image you want to print out
        path: anime.coverImage.extraLarge,

        // by default the size of the image is set to fit in the terminal,
        // but you can override it with the width property
        width: 90,
      });
    }

    break;
  }

  case "manageSubscriptions": {
    printImage({
      // replace this with the URL or local file path of the image you want to print out
      path:
        "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx144553-Q5M7iNLHMuCl.jpg",

      // by default the size of the image is set to fit in the terminal,
      // but you can override it with the width property
      width: 90,
    });

    break;
  }
}
