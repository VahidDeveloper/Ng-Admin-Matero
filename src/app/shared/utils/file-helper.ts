export class FileHelper {
  private static chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  /**
   *   Use a lookup table to find the index.
   */
  private static lookup = new Uint8Array(256);

  /**
   * convert array buffer to base64
   * @param buffer
   * @private
   */
  public static arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i += 3) {
      binary += this.chars[bytes[i] >> 2];
      binary += this.chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
      binary += this.chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
      binary += this.chars[bytes[i + 2] & 63];
    }

    if (len % 3 === 2) {
      binary = binary.substring(0, binary.length - 1);
    } else if (len % 3 === 1) {
      binary = binary.substring(0, binary.length - 2);
    }

    return binary;
  }

  /**
   * convert base64 to array buffer
   * @param base64
   * @private
   */
  public static base64ToArrayBuffer(base64: string) {
    this._setCharLookUp();
    const bufferLength = base64?.length * 0.75,
      len = base64?.length;
    let p = 0,
      encoded1,
      encoded2,
      encoded3,
      encoded4;
    const bytes = new Uint8Array(bufferLength);
    for (let i = 0; i < len; i += 4) {
      encoded1 = this.lookup[base64.charCodeAt(i)];
      encoded2 = this.lookup[base64.charCodeAt(i + 1)];
      encoded3 = this.lookup[base64.charCodeAt(i + 2)];
      encoded4 = this.lookup[base64.charCodeAt(i + 3)];
      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }
    return bytes.buffer;
  }

  /**
   * it would set default char lookup table
   * @private
   */
  private static _setCharLookUp(): void {
    for (let i = 0; i < FileHelper.chars.length; i++) {
      FileHelper.lookup[FileHelper.chars.charCodeAt(i)] = i;
    }
  }

  public static convertToBase64WithExtraEdit(str: string): string {
    try {
      return window.btoa(String(str)).replace(/\//g, '-').replace(/\+/g, '_').replace(/=/g, '~');
    } catch (e) {
      console.warn(e);
      return '';
    }
  }

  public static downloadBlobFile(
    fileName: string,
    res: any,
    type: 'application/pdf' | 'text/json' | 'text/plain' | 'application/zip' = 'text/json',
    cb?: any
  ) {
    const url = (window.URL || window['webkitURL']).createObjectURL(new Blob([res], { type }));
    FileHelper.downloadFileByUrl(fileName, url, cb);
  }

  public static downloadFileByUrl(fileName: string, url: string, cb?: any) {
    const anchor: any = document.createElement('a');
    anchor.download = fileName;
    anchor.href = url;
    anchor.click();
    if (cb) cb();
  }

  public static openInNewWindow(url: string, target: '_blank' | '_self') {
    window.open(url, target);
  }
}
