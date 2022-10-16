/**
 * Custom JSON helper to stringify and parse JSON
 */
export default class Json {
  public static stringify(value: any): string {
    return JSON.stringify(value)
  }

  public static parse(value: string): any {
    let parsed = JSON.parse(value);
    if (typeof parsed === 'string') parsed = Json.parse(parsed);
    return parsed;
  }

  public static isJSON(value: string): boolean {
    try {
      JSON.parse(value)
    } catch (e) {
      return false
    }
    return true
  }
}
