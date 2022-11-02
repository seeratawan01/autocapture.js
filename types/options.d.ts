export type PersistenceType = 'memory' | 'localStorage' | 'sessionStorage' | 'none'

export type Attributes =
  | 'tagName'
  | 'className'
  | 'text'
  | 'value'
  | 'type'
  | 'href'
  | 'id'
  | 'name'
  | 'placeholder'
  | 'src'
  | 'title'
  | 'alt'
  | 'role'
  | string

export type Capture =  'tap' | 'form' | 'swipe' | 'scroll' | 'video' | 'form' | 'page' | 'mouse-movement' | string
