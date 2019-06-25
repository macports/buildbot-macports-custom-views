import Port from '@/components/Port.vue'

describe('Port', () => {
  it('sets the correct default data', () => {
    expect(typeof Port.data).toBe('function')
    const defaultData = Port.data()
    expect(defaultData.info).toBe(null)
    expect(defaultData.myBuilds).toBe(null)
    expect(defaultData.loading).toBe(true)
    expect(defaultData.errored).toBe(false)
  })
})
