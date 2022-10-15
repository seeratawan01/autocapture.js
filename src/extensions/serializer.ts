/**
 * If you only need to record and replay changes within the browser locally, then we can simply save the current view by deep copying the DOM object.
 * We now implemented a snapshot by saving the whole DOM object in memory. This is not a good solution because it will consume a lot of memory.
 * But the object itself is not serializable, meaning we can't save it to a specific text format (such as JSON) for transmission. We need that to do remote recording, and thus we need to implement a method for serializing the DOM data.
 *
 * Implementation reasons:
 * - We need to implement a "non-standard" serialization method.
 * - We want to control the amount of code as much as possible, only retaining the necessary
 * functions.
 */
export default class Serializer {
  /**
   * Serialize the DOM object.
   * @param node The DOM object to be serialized.
   * @returns The serialized DOM object.
   */
  public static serialize(node: Node): string {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        return this.serializeElement(node as Element)
      case Node.TEXT_NODE:
        return this.serializeText(node as Text)
      case Node.COMMENT_NODE:
        return this.serializeComment(node as Comment)
      case Node.DOCUMENT_NODE:
        return this.serializeDocument(node as Document)
      case Node.DOCUMENT_TYPE_NODE:
        return this.serializeDocumentType(node as DocumentType)
      case Node.DOCUMENT_FRAGMENT_NODE:
        return this.serializeDocumentFragment(node as DocumentFragment)
      default:
        return ''
    }
  }

  /**
   * Serialize the DOM element.
   */
  private static serializeElement(node: Element): string {
    const tagName = node.tagName.toLowerCase()
    const attrs = this.serializeAttributes(node)
    const children = this.serializeChildren(node)
    return `<${tagName}${attrs}>${children}</${tagName}>`
  }

  /**
   * Serialize the DOM element's attributes.
   */
  private static serializeAttributes(node: Element): string {
    const attrs: string[] = []
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i]
      attrs.push(`${attr.name}="${attr.value}"`)
    }
    return attrs.length ? ' ' + attrs.join(' ') : ''
  }

  /**
   * Serialize the DOM element's children.
   */
  private static serializeChildren(node: Element | Document | DocumentFragment): string {
    let children = ''
    for (let i = 0; i < node.childNodes.length; i++) {
      children += this.serialize(node.childNodes[i])
    }
    return children
  }

  /**
   * Serialize the DOM text.
   */
  private static serializeText(node: Text): string {
    return node.textContent || ''
  }

  /**
   * Serialize the DOM comment.
   */
  private static serializeComment(node: Comment): string {
    return `<!--${node.textContent}-->`
  }

  /**
   * Serialize the DOM document.
   */
  private static serializeDocument(node: Document): string {
    return this.serializeChildren(node)
  }

  /**
   * Serialize the DOM document type.
   */
  private static serializeDocumentType(node: DocumentType): string {
    return `<!DOCTYPE ${node.name}>`
  }

  /**
   * Serialize the DOM document fragment.
   */
  private static serializeDocumentFragment(node: DocumentFragment): string {
    return this.serializeChildren(node)
  }

  /**
   * Deserialize the serialized DOM object.
   * @param serializedNode The serialized DOM object.
   */
  public static deserialize(serializedNode: string): Node {
    const template = document.createElement('template')
    template.innerHTML = serializedNode
    return template.content.firstChild as Node
  }

  /**
   * Fast compression of serialized DOM objects.
   */
  public static compress(serializedNode: string): string {
    return serializedNode.replace(/>\s+</g, '><')
  }

}
