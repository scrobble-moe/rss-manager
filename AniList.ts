import { gql, request } from 'https:/deno.land/x/graphql_request/mod.ts';
import ky from 'https:/esm.sh/ky';

export interface Anime {
  id: number;
  title: {
    romaji: string;
  };
  coverImage: {
    extraLarge: string;
  };
}

export class AniList {
  constructor() {
    console.log(ky);
  }

  public async gqlRequest<T>(query: string): Promise<T> {
    return (await request("https://graphql.anilist.co", query)).Media;
  }

  public getAnime(id: string) {
    const query = gql`
        {
          Media(id: ${id}, type: ANIME) {
          id
          title {
            romaji
          }
          coverImage {
            extraLarge
          }
        }
        }
      `;
    return this.gqlRequest<Anime>(query);
  }
}
