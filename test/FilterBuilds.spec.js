import FilterBuilds from '@/components/FilterBuilds.vue'

describe('FilterBuilds', () => {
  it('sets the correct default data', () => {
    expect(typeof FilterBuilds.data).toBe('function')
    const defaultData = FilterBuilds.data()
    expect(defaultData.buttonTxt).toBe('Show builds after this date')
  })
})
