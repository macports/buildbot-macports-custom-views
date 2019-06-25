import Change from '@/components/Change.vue'

describe('Change', () => {
  it('sets the correct default data', () => {
    expect(typeof Change.data).toBe('function')
    const defaultData = Change.data()
    expect(defaultData.loading).toBe(true)
    expect(defaultData.errored).toBe(false)
    expect(typeof defaultData.baseURL).toBe('string')
  })
})
