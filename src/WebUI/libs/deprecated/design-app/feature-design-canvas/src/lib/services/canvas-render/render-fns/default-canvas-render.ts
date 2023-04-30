/*
 export const defaultCanvasRender = (ctx: CanvasRenderingContext2D, selectedSnapshot: SelectedStateSnapshot, entityStore: CanvasEntityStore, entities: CanvasEntity[]) => {
 // const { selectedSnapshot } = this._machine.allSnapshots
 // ctx.canvas
 return (ctx: CanvasRenderingContext2D) => {
 ctx.save()
 ctx.setTransform(1, 0, 0, 1, 0, 0)
 ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
 ctx.restore()
 ctx.save()
 ctx.beginPath()
 entities = entities || entityStore.panels.getEntities()
 entities.forEach((entity) => {
 this.drawEntityV2(entity, selectedSnapshot)
 // this.drawEntity(entity)
 })
 ctx.restore()
 ctx.save()
 if (selectedSnapshot.matches('EntitySelectedState.EntitiesSelected')) {
 this.drawSelectedBox()
 }

 if (selectedSnapshot.matches('StringSelectedState.StringSelected')) {
 this.drawSelectedStringBox()
 this.drawSelectedBox()
 }
 /!*			if (this._machine.selectedSnapshot.matches('EntitySelectedState.EntitiesSelected')) {
 this.drawSelectedBox()
 }*!/
 /!*			if (this._machine.matches('SelectedState.MultipleEntitiesSelected')) {
 console.log('multiple entities selected')
 this.drawSelectedBox()
 }*!/
 ctx.restore()
 }
 }*/
