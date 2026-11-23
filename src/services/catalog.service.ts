import api from '@/lib/axios'
import type {
  CatalogFilterParams,
  ModuleOut,
  RightOut,
} from '@/types/catalog'

export const catalogService = {
  async listModules(): Promise<ModuleOut[]> {
    const { data } = await api.get<ModuleOut[] | { data: ModuleOut[] }>('/modules/')
    const list = Array.isArray(data) ? data : data?.data
    return Array.isArray(list) ? list : []
  },

  async getModule(code: string): Promise<ModuleOut> {
    const { data } = await api.get<ModuleOut | { data: ModuleOut }>(`/modules/${code}`)
    return (data && typeof data === 'object' && 'data' in data) ? (data.data as ModuleOut) : (data as ModuleOut)
  },

  async listRights(params?: CatalogFilterParams): Promise<RightOut[]> {
    const { data } = await api.get<RightOut[] | { data: RightOut[] }>('/rights/', { params })
    const list = Array.isArray(data) ? data : data?.data
    return Array.isArray(list) ? list : []
  },

  async getRight(code: string): Promise<RightOut> {
    const { data } = await api.get<RightOut | { data: RightOut }>(`/rights/${code}`)
    return (data && typeof data === 'object' && 'data' in data) ? (data.data as RightOut) : (data as RightOut)
  },
}
