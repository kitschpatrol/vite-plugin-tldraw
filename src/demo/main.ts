import tldrFileFrame from './assets/test-sketch-three-frames.tldr?frame=frame-3&tldr'
import tldrFile from './assets/test-sketch.tldr'
import tldrFileWithParams from './assets/test-sketch.tldr?format=png&transparent=true&tldr'

document.querySelector<HTMLDivElement>('body')!.innerHTML = `
  <p>Tldr Path: ${tldrFile}</p>
  <img src="${tldrFile}" />
  <p>Tldr Path: ${tldrFileFrame}</p>
  <img src="${tldrFileFrame}" />
  <p>Tldr Path: ${tldrFileWithParams}</p>
  <img src="${tldrFileWithParams}"/>
`
