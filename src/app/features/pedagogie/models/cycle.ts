export interface Cycle {
  id?: number;
  code?: string;
  libelle?: string;
  description?: string;
  actif?: boolean;
}

export class Covert {
  public static toCycle(json: string): Cycle {
    return JSON.parse(json);
  }
  public static cycleToJson(value: Cycle): string {
    return JSON.stringify(value);
  }
}
