export type RightBrief = {
  code: string
  display_name: string
}

export type LevelOut = {
  code: string
  display_name: string
  rank: number
  audience: string
  adds: RightBrief[]
}

export type ModuleOut = {
  code: string
  kind: string
  display_name: string
  description: string | null
  subject_bound: boolean
  sort_order: number
  is_active: boolean
  levels: LevelOut[]
}

export type RightOut = {
  code: string
  display_name: string
  description: string | null
  module: string | null
  level: string | null
  audience: string
  subject_bound: boolean
  is_platform: boolean
  is_active: boolean
}

export type CatalogFilterParams = {
  module?: string
  audience?: string
}
