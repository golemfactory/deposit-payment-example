export function queryShadowRootDeep(
  hostsSelectorList: ReadonlyArray<{
    selector: string
    useShadowRoot: boolean
  }>
): ShadowRoot | HTMLElement | never {
  let element: ShadowRoot | Element | null | undefined = undefined

  hostsSelectorList.forEach(
    ({
      selector,
      useShadowRoot,
    }: {
      selector: string
      useShadowRoot: boolean
    }) => {
      const root = element ?? document
      element = useShadowRoot
        ? root.querySelector(selector)?.shadowRoot
        : root.querySelector(selector)
      if (!element)
        throw new Error(
          `Cannot find a shadowRoot element with selector "${selector}". The selectors chain is: ${hostsSelectorList.join(
            ', '
          )}`
        )
    }
  )

  if (!element)
    throw new Error(
      `Cannot find a shadowRoot of this chain: ${hostsSelectorList.join(', ')}`
    )
  return element as ShadowRoot | HTMLElement
}

export function queryShadowRootDeepAll(
  hostsSelectorList: ReadonlyArray<{
    selector: string
    useShadowRoot: boolean
  }>
): Array<ShadowRoot | HTMLElement> | never {
  //@ts-ignore
  let elements: Array<ShadowRoot | HTMLElement> = [document]

  if (hostsSelectorList.length === 0) {
    throw new Error('The hostsSelectorList cannot be empty')
  }

  hostsSelectorList.forEach(
    ({
      selector,
      useShadowRoot,
    }: {
      selector: string
      useShadowRoot: boolean
    }) => {
      let newElements: Array<ShadowRoot | HTMLElement> = []

      elements.forEach((element) => {
        const el = useShadowRoot
          ? Array.from((element as HTMLElement)?.querySelectorAll(selector))
              .filter((e) => e.shadowRoot !== null)
              .map((e) => {
                return e.shadowRoot as ShadowRoot
              })
          : Array.from(element?.querySelectorAll<HTMLElement>(selector))
        newElements = [...newElements, ...el]
      })

      if (newElements.length === 0) {
        throw new Error(
          `Cannot find a shadowRoot element with selector "${selector}". The selectors chain is: ${hostsSelectorList
            .map((item) => item.selector)
            .join(', ')}`
        )
      }

      elements = newElements
    }
  )

  return elements
}

export function adjustShadowRootStyles(
  hostsSelectorList: ReadonlyArray<{
    selector: string
    useShadowRoot: boolean
  }>,
  styles: string
): void {
  const sheet = new CSSStyleSheet()
  sheet.replaceSync(styles)

  const shadowRoot = queryShadowRootDeep(hostsSelectorList)

  if (shadowRoot instanceof Element) {
    throw new Error(
      `The shadowRoot of this chain: ${hostsSelectorList.join(
        ', '
      )} is not a ShadowRoot`
    )
  } else {
    shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, sheet]
  }
}
