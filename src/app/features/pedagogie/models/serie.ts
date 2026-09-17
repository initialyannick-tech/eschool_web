

export interface Serie {
  id?: number;
  code?: string;
  libelle?: string;
  description?: string;
  actif?: boolean;
}

export class Covert {
  public static toSerie(json: string): Serie {
    return JSON.parse(json);
  }
  public static serieToJson(value: Serie): string {
    return JSON.stringify(value);
  }
}
