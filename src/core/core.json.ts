/**
 * Module provides custom JSON parsing and stringifying functionality.
 * @class JSON
 * @example
 * // To parse a JSON string:
 * JSON.parse('{"key": "value"}')
 * // To stringify a JSON object:
 * JSON.stringify({key: 'value'})
 */
export default class Json {
  /**
   * Stringify JSON
   * @param value
   * @param arg
   */
  public static stringify(value: any, ...arg): string {
    return JSON.stringify(value, ...arg)
  }

  /**
   * Parse JSON
   * @param value
   */
  public static parse(value: string): any {
    let parsed = JSON.parse(value);
    if (typeof parsed === 'string') parsed = Json.parse(parsed);
    return parsed;
  }

  /**
   * Check if string is valid JSON
   * @param value
   */
  public static isJSON(value: string): boolean {
    try {
      JSON.parse(value)
    } catch (e) {
      return false
    }
    return true
  }
}
