document.addEventListener('DOMContentLoaded', () => {
      const c = document.getElementById('undoCanvas')
      const context = c.getContext('2d')
      const width = c.width
      const height = c.height

      context.lineJoin = 'round'
      context.lineWidth = 3
      context.strokeStyle = 'blue'

      UndoCanvas.enableUndo(context)

      const historyNoLabel = document.getElementById('historyNo')  
      const historySlider = document.getElementById('historySlider')
      historySlider.min = 0
      historySlider.max = context.currentHistoryNo

      const updateControls = () => {
        historyNoLabel.value = context.currentHistoryNo
        historySlider.max = context.newestHistoryNo
        historySlider.value = context.currentHistoryNo
      }                                                              
       
      historySlider.addEventListener('input', (e) => {
        e.preventDefault()
        context.currentHistoryNo = historySlider.value
        updateControls()
      })

                                                                    
      const undoButton = document.getElementById('undoButton')       
      undoButton.addEventListener('click', (e) => {
        e.preventDefault()
        context.undo()
        updateControls()
      })

      const redoButton = document.getElementById('redoButton')
      redoButton.addEventListener('click', (e) => {
        e.preventDefault()
        context.redo()
        updateControls()
      })

      const undoTagButton = document.getElementById('undoTagButton')
      undoTagButton.addEventListener('click', (e) => {
        e.preventDefault()
        context.undoTag()
        updateControls()
      })

      const redoTagButton = document.getElementById('redoTagButton')
      redoTagButton.addEventListener('click', (e) => {
        e.preventDefault()
        context.redoTag()
        updateControls()
      })


      let drawing = false
      let prevMouseX = 0
      let prevMouseY = 0
      let connectLine = false

      const getMouseX = (e) => {
        if(typeof e.targetTouches !== 'undefined'){
          return e.targetTouches[0].pageX - c.offsetLeft
        }
        return e.pageX - c.offsetLeft
      }

      const getMouseY = (e) => {
        if(typeof e.targetTouches !== 'undefined'){
          return e.targetTouches[0].pageY - c.offsetTop
        }
        return e.pageY - c.offsetTop
      }

      const draw = (e) => {
        const mouseX = getMouseX(e)
        const mouseY = getMouseY(e)

        context.beginPath()
        if(connectLine){
          context.moveTo(prevMouseX, prevMouseY)
        }else{
          context.moveTo(mouseX, mouseY)
        }
        context.lineTo(mouseX, mouseY)
        context.closePath()
        context.stroke()
        prevMouseX = mouseX
        prevMouseY = mouseY
        connectLine = true
        updateControls()
      }

      c.addEventListener('mousedown', (e) => {
        e.preventDefault()
        context.putTag()
        drawing = true
        draw(e)
      })

      c.addEventListener('mousemove', (e) => {
        if(drawing){
          e.preventDefault()
          draw(e)
        }
      })

      c.addEventListener('mouseleave', (e) => {
        connectLine = false
      })

      document.addEventListener('mouseup', (e) => {
        if(drawing){
          context.putTag()
        }
        drawing = false
        connectLine = false
      })

      c.addEventListener('touchstart', (e) => {
        e.preventDefault()
        context.putTag()
        drawing = true
        draw(e)
      })

      c.addEventListener('touchmove', (e) => {
        if(drawing){
          e.preventDefault()
          draw(e)
        }
      })

      document.addEventListener('touchend', (e) => {
        if(drawing){
          context.putTag()
        }
        drawing = false
        connectLine = false
      })

      document.addEventListener('touchcancel', (e) => {
        if(drawing){
          context.putTag()
        }
        drawing = false
        connectLine = false
      })

      updateControls()
    })
