export interface feeds {
  [name: string]: {
    articles: article[];
    hasError: boolean;
    isLoading: boolean;
    lastBuildDate: string;
    title: string;
    uid: string;
    url: string;
  };
}

export interface article {
  "category": string;
  "categoryId": string;
  "comments": string;
  "date": string;
  "description": string;
  "downloads": string;
  "id": string;
  "infoHash": string;
  "leechers": string;
  "link": string;
  "remake": string;
  "seeders": string;
  "size": string;
  "title": string;
  "torrentURL": string;
  "trusted": string;
}

export interface rules {
  [name: string]: {
    enabled: boolean;
    mustContain: string;
    mustNotContain: string;
    useRegex: boolean;
    episodeFilter: string;
    smartFilter: boolean;
    previouslyMatchedEpisodes: string[];
    affectedFeeds: string[];
    ignoreDays: number;
    lastMatch: string;
    addPaused: boolean;
    assignedCategory: string;
    savePath: string;
  };
}

export class Client {
  public url: URL;

  constructor(url: URL) {
    this.url = url;
  }

  private async apiRequest<t>(
    endpoint: string,
    method: "GET" | "POST",
    body?: URLSearchParams,
  ) {
    return await fetch(new URL(`${this.url.origin}/api/v2/${endpoint}`), {
      credentials: "same-origin",
      method,
      body,
    }).then(
      (res) => res.json() as Promise<t>,
    );
  }
  public getFeeds() {
    return this.apiRequest<feeds>("rss/items?withData=true", "GET");
  }

  public getRules() {
    return this.apiRequest<rules>("rss/rules", "GET");
  }

  // https://nyaa.si/?page=rss&u=Judas

  public addFeed(url: string) {
    const data = new URLSearchParams();
    data.append("url", url);
    data.append("path", "");
    return this.apiRequest<feeds>("rss/addFeed", "POST", data);
  }
}
