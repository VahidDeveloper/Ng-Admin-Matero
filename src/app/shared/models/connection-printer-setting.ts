/**
 * connection printer setting
 */
export class ConnectionPrinterSetting {
  /**
   * if enabled a printer will be added to remote machine printers by the specified name;
   * and when user prints something in remote machine a pdf file will be download in clint system who is connecting by wina
   */
  printerEnabled: boolean | undefined;
  printerName?: string;
}
