/**
 * for stored credential data from server
 */
export class StoredPassword {
  id: number | undefined;
  username: string | undefined;
  domain: string | undefined;
  identifierKey: string | undefined;
  display: string | undefined;

  constructor(preBuildObject: Partial<StoredPassword>) {
    if (preBuildObject) {
      if (preBuildObject.id) {
        this.id = preBuildObject.id;
      }
      if (preBuildObject.username) {
        this.username = preBuildObject.username;
      }
      if (preBuildObject.domain) {
        this.domain = preBuildObject.domain;
      }
      if (preBuildObject.identifierKey) {
        this.identifierKey = preBuildObject.identifierKey;
      }
      this.display = this.getDisplay();
    }
  }

  getDisplay(): string {
    return (
      this.username +
      (this.domain ? '@' + this.domain : '') +
      (this.identifierKey ? '[' + this.identifierKey + ']' : '') +
      '/****'
    );
  }
}
