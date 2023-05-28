const ongoingTouches: Touch[] = []
let offsetX = 0
let offsetY = 0

export function handleStart(event: TouchEvent, canvas: HTMLCanvasElement) {
	event.preventDefault()
	const touches = event.changedTouches
	offsetX = canvas.getBoundingClientRect().left
	offsetY = canvas.getBoundingClientRect().top
	console.log(offsetX, offsetY)
	for (let i = 0; i < touches.length; i++) {
		ongoingTouches.push(copyTouch(touches[i]))
	}
}

export function handleMove(event: TouchEvent, ctx: CanvasRenderingContext2D) {
	event.preventDefault()
	const touches = event.changedTouches
	for (let i = 0; i < touches.length; i++) {
		// const color = document.getElementById('selColor').value
		const idx = ongoingTouchIndexById(touches[i].identifier)
		if (idx >= 0) {
			ctx.beginPath()
			ctx.moveTo(ongoingTouches[idx].clientX - offsetX, ongoingTouches[idx].clientY - offsetY)
			ctx.lineTo(touches[i].clientX - offsetX, touches[i].clientY - offsetY)
			// ctx.lineWidth = document.getElementById('selWidth').value
			// ctx.strokeStyle = color
			ctx.lineJoin = 'round'
			ctx.closePath()
			ctx.stroke()
			ongoingTouches.splice(idx, 1, copyTouch(touches[i])) // swap in the new touch record
			// random changes
		}
	}
}

export function handleEnd(event: TouchEvent, ctx: CanvasRenderingContext2D) {
	event.preventDefault()
	const touches = event.changedTouches
	for (let i = 0; i < touches.length; i++) {
		// const color = document.getElementById('selColor').value
		const idx = ongoingTouchIndexById(touches[i].identifier)
		if (idx >= 0) {
			// ctx.lineWidth = document.getElementById('selWidth').value
			// ctx.fillStyle = color
			ongoingTouches.splice(idx, 1) // remove it; we're done
		}
	}
}

export function handleCancel(event: TouchEvent) {
	event.preventDefault()
	const touches = event.changedTouches
	for (let i = 0; i < touches.length; i++) {
		const idx = ongoingTouchIndexById(touches[i].identifier)
		ongoingTouches.splice(idx, 1) // remove it; we're done
	}
}

export function copyTouch({ identifier, clientX, clientY }: Touch) {
	return { identifier, clientX, clientY } as Touch
}

export function ongoingTouchIndexById(idToFind: number) {
	for (let i = 0; i < ongoingTouches.length; i++) {
		const id = ongoingTouches[i].identifier
		if (id === idToFind) {
			return i
		}
	}
	return -1 // not found
}
