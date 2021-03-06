/**
 * 对 DOM API 进行进一步封装
 */
export interface DOMAPI {
  createElement: (
    tagName: any,
    options?: ElementCreationOptions
  ) => HTMLElement
  createElementNS: (
    namespaceURI: string,
    qualifiedName: string,
    options?: ElementCreationOptions
  ) => Element
  createDocumentFragment?: () => DocumentFragment
  createTextNode: (text: string) => Text
  createComment: (text: string) => Comment
  insertBefore: (
    parentNode: Node,
    newNode: Node,
    referenceNode: Node | null
  ) => void
  removeChild: (node: Node, child: Node) => void
  appendChild: (node: Node, child: Node) => void
  parentNode: (node: Node) => Node | null
  nextSibling: (node: Node) => Node | null
  tagName: (elm: Element) => string
  setTextContent: (node: Node, text: string | null) => void
  getTextContent: (node: Node) => string | null
  isElement: (node: Node) => node is Element
  isText: (node: Node) => node is Text
  isComment: (node: Node) => node is Comment
  isDocumentFragment?: (node: Node) => node is DocumentFragment
}

function createElement(
  tagName: any,
  options?: ElementCreationOptions
): HTMLElement {
  return document.createElement(tagName, options)
}

function createElementNS(
  namespaceURI: string,
  qualifiedName: string,
  options?: ElementCreationOptions
): Element {
  return document.createElementNS(namespaceURI, qualifiedName, options)
}

function createDocumentFragment(): DocumentFragment {
  return document.createDocumentFragment()
}

function createTextNode(text: string): Text {
  return document.createTextNode(text)
}

function createComment(text: string): Comment {
  return document.createComment(text)
}
/**
 * 
 * @param parentNode 父节点
 * @param newNode 要插入的节点
 * @param referenceNode 标杆节点，即在该节点前插入新节点，如果未指定则将新节点插入到父节点末尾
 */
function insertBefore(
  parentNode: Node,
  newNode: Node,
  referenceNode: Node | null
): void {
  parentNode.insertBefore(newNode, referenceNode)
}

function removeChild(node: Node, child: Node): void {
  node.removeChild(child)
}

function appendChild(node: Node, child: Node): void {
  node.appendChild(child)
}

function parentNode(node: Node): Node | null {
  return node.parentNode
}

function nextSibling(node: Node): Node | null {
  return node.nextSibling
}

function tagName(elm: Element): string {
  return elm.tagName
}

function setTextContent(node: Node, text: string | null): void {
  node.textContent = text
}

function getTextContent(node: Node): string | null {
  return node.textContent
}

function isElement(node: Node): node is Element {
  return node.nodeType === 1
}

function isText(node: Node): node is Text {
  return node.nodeType === 3
}

function isComment(node: Node): node is Comment {
  return node.nodeType === 8
}

function isDocumentFragment(node: Node): node is DocumentFragment {
  return node.nodeType === 11
}

export const htmlDomApi: DOMAPI = {
  createElement,
  createElementNS,
  createTextNode,
  createDocumentFragment,
  createComment,
  insertBefore,
  removeChild,
  appendChild,
  parentNode,
  nextSibling,
  tagName,
  setTextContent,
  getTextContent,
  isElement,
  isText,
  isComment,
  isDocumentFragment,
}

// END
