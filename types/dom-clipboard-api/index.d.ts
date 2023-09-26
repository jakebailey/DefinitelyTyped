interface Clipboard extends EventTarget {
    read(): Promise<DataTransfer>;
    readText(): Promise<string>;
    write(data: DataTransfer): Promise<void>;
    writeText(data: string): Promise<void>;
}

interface Navigator {
    readonly clipboard: Clipboard;
}
