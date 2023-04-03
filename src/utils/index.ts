/**
 * 防抖
 */
export const debounce = (fn: Function, delayed: number) => {
  let timer: any
  return function() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    if (!timer) {
      timer = setTimeout(() => {
        fn()
      }, delayed)
    }
  }
}