export type EventHandler = (event: Event) => boolean | void

export type AutoCaptureProps = {
  elements?: Array<HTMLElement | Window | Document>
  attributes?: Array<EventAttributes>
  debug?: boolean,
  autoStart?: boolean,
  autoStop?: boolean,
  autoStopTimeout?: number,
  autoStopTimeoutCallback?: () => void,
  autoStopCallback?: () => void,
  autoStartCallback?: () => void,
  autoCaptureCallback?: (event: Event) => boolean | void,
  autoCaptureErrorCallback?: (error: Error) => void,
}

export type EventAttributes = 'className' | 'text' | 'value' | 'type' | 'href' | 'id' | 'name' | 'placeholder' | 'src' | 'title' | 'alt' | 'role' | 'aria-label' | 'aria-labelledby' | 'aria-describedby' | 'aria-controls' | 'aria-expanded' | 'aria-haspopup' | 'aria-hidden' | 'aria-invalid' | 'aria-required' | 'aria-pressed' | 'aria-checked' | 'aria-owns' | 'aria-live' | 'aria-relevant' | 'aria-autocomplete' | 'aria-activedescendant' | 'aria-dropeffect' | 'aria-grabbed' | 'aria-level' | 'aria-multiline' | 'aria-multiselectable' | 'aria-orientation' | 'aria-posinset' | 'aria-setsize' | 'aria-sort' | 'aria-valuemax' | 'aria-valuemin' | 'aria-valuenow' | 'aria-valuetext' | 'aria-atomic' | 'aria-busy' | 'aria-disabled' | 'aria-flowto' | 'aria-readonly' | 'aria-selected' | 'aria-labelledby' | 'aria-describedby' | 'aria-errormessage' | 'aria-invalid' | 'aria-keyshortcuts' | 'aria-roledescription' | 'aria-details' | 'aria-atomic' | 'aria-busy' | 'aria-live' | 'aria-relevant' | 'aria-dropeffect' | 'aria-grabbed' | 'aria-activedescendant' | 'aria-colcount' | 'aria-colindex' | 'aria-colspan' | 'aria-controls' | 'aria-describedby' | 'aria-details' | 'aria-disabled' | 'aria-errormessage' | 'aria-flowto' | 'aria-haspopup' | 'aria-hidden' | 'aria-invalid' | 'aria-keyshortcuts' | 'aria-label' | 'aria-labelledby' | 'aria-level' | 'aria-live' | 'aria-modal' | 'aria-multiline' | 'aria-multiselectable' | 'aria-orientation' | 'aria-owns' | 'aria-placeholder' | 'aria-posinset' | 'aria-pressed' | 'aria-readonly' | 'aria-relevant' | 'aria-required' | 'aria-roledescription' | 'aria-rowcount'
