import { Chart } from 'klinecharts';
import { createSignal } from "solid-js";
import { setInputClass } from "../component/input";
import { fullScreen, indicatorModalVisible, instanceApi, periodModalVisible, resolveRootNode, screenshotUrl, setIndicatorModalVisible, setPeriodModalVisible, setScreenshotUrl, setSettingModalVisible, settingModalVisible, theme } from "./chartStore";
export const [ctrlKeyedDown, setCtrlKeyedDown] = createSignal(false)
export const [widgetref, setWidgetref] = createSignal<string | Chart | HTMLElement>('')
export const [timerid, setTimerid] = createSignal<NodeJS.Timeout>()

export const useKeyEvents = () => {
  const handleKeyDown = (event:KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault()
      setCtrlKeyedDown(true)
    }
    if (ctrlKeyedDown()) {
      switch (event.key) {
        case 'o':
          break;
        case 'l':
          break;
        case 'i':
          if (allModalHidden('indi')) {
            setIndicatorModalVisible(visible => !visible)
          }
          break;
        case 's':
          if (allModalHidden('settings')) {
            setSettingModalVisible(visible => !visible)
          }
          break;
        case 'z':
          //TODO: we should undo one step
          break;
        case 'y':
          //TODO: we should redo one step
          break;
        case 'c':
          //TODO: we should copy any selected overlay to clipboard
          break;
        case 'v':
          //TODO: we should paste the copied overlay from clipboard
          break;
        case 'p':
          if (allModalHidden('screenshot'))
            takeScreenshot()
          break;
        case 'f':
          toggleFullscreen()
          break;
        case 'Backspace':
          break;
      }

      return
    }
    if (['1','2','3','4','5','6','7','8','9'].includes(event.key) && allModalHidden('period')) {
      // if (periodInputValue().length < 1)
      if (!periodModalVisible()) {
        setPeriodModalVisible(true)
        setInputClass('klinecharts-pro-input klinecharts-pro-timeframe-modal-input input-error')
      }
    } else if (event.key === ' ') {
    } else if (event.key === 'ArrowDown') {
    } else if (event.key === 'ArrowUp') {
    } else if (event.key === 'Delete') {
      instanceApi()?.removeOverlay()
    } else if (event.key === 'Escape') {
      //TODO: this should hide all modals
      setPeriodModalVisible(false)

      setSettingModalVisible(false)
      setIndicatorModalVisible(false)
      setScreenshotUrl('')
    }
  }

  const handleKeyUp = (event:KeyboardEvent) => {
    if (!event.ctrlKey || !event.metaKey) {
      setCtrlKeyedDown(false)
      event.preventDefault()
    }
  }

  return { handleKeyDown, handleKeyUp }
}

const allModalHidden = (except: 'settings'|'indi'|'screenshot'|'period') => {
  let value = false
  switch (except) {
    case 'settings':
      value = !indicatorModalVisible() && screenshotUrl() === '' && !periodModalVisible()
    case 'indi':
      value = !settingModalVisible() && screenshotUrl() === '' && !periodModalVisible()
      break
    case 'screenshot':
      value = !settingModalVisible() && !indicatorModalVisible() && !periodModalVisible()
      break
    case 'period':
      value = !settingModalVisible() && !indicatorModalVisible() && screenshotUrl() === ''
      break
  }
  return value
}

const takeScreenshot = () => {
  const url = instanceApi()!.getConvertPictureUrl(true, 'jpeg', theme() === 'dark' ? '#151517' : '#ffffff')
  setScreenshotUrl(url)
}

const toggleFullscreen = () => {
  if (!fullScreen()) {
    // const el = ref?.parentElement
    const el = resolveRootNode()
    if (el) {
      // @ts-expect-error
      const enterFullScreen = el.requestFullscreen ?? el.webkitRequestFullscreen ?? el.mozRequestFullScreen ?? el.msRequestFullscreen
      enterFullScreen.call(el)
      // setFullScreen(true)
    } else {
    }
  } else {
    // @ts-expect-error
    const exitFullscreen = document.exitFullscreen ?? document.msExitFullscreen ?? document.mozCancelFullScreen ?? document.webkitExitFullscreen
    exitFullscreen.call(document)
    // setFullScreen(false)
  }
}