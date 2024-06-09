export interface IpcError {
  isError: true,
  message: string;
  type: "NO_OP" | "FAILURE";
}

export function isIpcError<K>(result: K | IpcError): result is IpcError {
  return (result != null && (result as any).isError === true);
}