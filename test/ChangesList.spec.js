import ChangesList from '@/components/ChangesList.vue'

describe('ChangesList', () => {
  it('sets the correct default data', () => {
    expect(typeof ChangesList.data).toBe('function')
    const defaultData = ChangesList.data()
    expect(defaultData.showChange).toBe(false)
    expect(defaultData.selectedChange).toEqual({})
    expect(defaultData.buttonTxt).toBe('Show changes after this date')
    expect(defaultData.loading).toBe(true)
    expect(defaultData.errored).toBe(false)
  })
})
