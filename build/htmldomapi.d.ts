/**
 * 对 DOM API 进行进一步封装
 */
export interface DOMAPI {
    createElement: (tagName: any, options?: ElementCreationOptions) => HTMLElement;
    createElementNS: (namespaceURI: string, qualifiedName: string, options?: ElementCreationOptions) => Element;
    createDocumentFragment?: () => DocumentFragment;
    createTextNode: (text: string) => Text;
    createComment: (text: string) => Comment;
    insertBefore: (parentNode: Node, newNode: Node, referenceNode: Node | null) => void;
    removeChild: (node: Node, child: Node) => void;
    appendChild: (node: Node, child: Node) => void;
    parentNode: (node: Node) => Node | null;
    nextSibling: (node: Node) => Node | null;
    tagName: (elm: Element) => string;
    setTextContent: (node: Node, text: string | null) => void;
    getTextContent: (node: Node) => string | null;
    isElement: (node: Node) => node is Element;
    isText: (node: Node) => node is Text;
    isComment: (node: Node) => node is Comment;
    isDocumentFragment?: (node: Node) => node is DocumentFragment;
}
export declare const htmlDomApi: DOMAPI;
