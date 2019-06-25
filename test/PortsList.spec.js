import PortsList from '@/components/PortsList.vue'

describe('PortsList', () => {
  it('sets the correct default data', () => {
    expect(typeof PortsList.data).toBe('function')
    const defaultData = PortsList.data()
    expect(defaultData.search).toBe('')
    expect(defaultData.portsList).toBe(null)
    expect(defaultData.loading).toBe(true)
    expect(defaultData.errored).toBe(false)
    expect(defaultData.showPort).toBe(false)
  })
})
