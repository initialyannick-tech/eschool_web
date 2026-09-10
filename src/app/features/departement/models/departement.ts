export interface Departement {
  id?: number;
  libelle?: string;
  slug?: string;
  description?: string;
}

export class Convert {
  public static toDepartement(json: string): Departement {
    return JSON.parse(json);
  }

  public static departementToJson(value: Departement): string {
    return JSON.stringify(value);
  }

}
